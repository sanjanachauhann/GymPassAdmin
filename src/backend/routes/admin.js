import { Router } from "express";
import GymPartnerRequest from "../../models/GymPassPartner.js";
import Partner from "../../models/Partner.js";
import Gym from "../../models/Gym.js";
import Admin from "../../models/Admin.js";
import User from "../../models/User.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Pass from "../../models/Pass.js";
import transporter from "../utils/mail.js";
import adminAuth from "../middleware/adminAuth.js";
import superadminAuth from "../middleware/superadminAuth.js";
import Payments from "../../models/Payments.js";
const router = Router();

console.log("🔥 REGISTERING ADMIN ROUTES");

// ======================================================
// ADMIN LOGIN
// POST /api/admin/login
// ======================================================

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const admin = await Admin.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (admin.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Please set your password using the invitation email",
      });
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        adminId: admin._id,
        email: admin.email,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    return res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

// ======================================================
// TEST
// GET /api/admin/test123
// ======================================================

router.get("/test123", (req, res) => {
  console.log("🔥 TEST ROUTE HIT");

  res.json({
    message: "ADMIN ROUTER IS WORKING",
  });
});

router.get("/me", adminAuth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.adminId)
      .select("_id name email role status")
      .lean();

    if (!admin || admin.status !== "active") {
      return res.status(401).json({
        success: false,
        message: "Invalid or inactive session",
      });
    }

    return res.json({
      success: true,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Get current admin error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to validate session",
    });
  }
});

// ======================================================
// APPLICATIONS
// ======================================================

// Get all gym partner applications
// GET /api/admin/applications

router.get("/applications", adminAuth, async (req, res) => {
  console.log("🔥 GET /api/admin/applications HIT");

  try {
    const applications = await GymPartnerRequest.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error("Get applications error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load applications",
    });
  }
});

// Approve application
// PUT /api/admin/applications/:id/approve

router.put("/applications/:id/approve", adminAuth, async (req, res) => {
  try {
    // ---------- 1. Validate (nothing is written yet) ----------
    const request = await GymPartnerRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Application already processed",
      });
    }

    console.log("Approving application:", request.email);

    const existingPartner = await Partner.findOne({
      email: request.email,
    });

    if (existingPartner) {
      return res.status(400).json({
        success: false,
        message: "Partner already exists.",
      });
    }

    // ---------- 2. Send the invitation email first ----------
    const inviteToken = crypto.randomBytes(32).toString("hex");
    // const inviteLink = `gympasspartners://setup-password?token=${inviteToken}`;
    const baseUrl = process.env.VITE_API_BASE_URL;
    const inviteLink = `${baseUrl}api/admin/open-setup-password?token=${inviteToken}`;
    try {
      console.log("Partner invite link:", inviteLink);

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: request.email,
        subject: "GymPass Partner Approved",

        html: `
              <h2>Welcome to GymPass Partners</h2>

    <p>Hello ${request.ownerName},</p>

    <p>
      Congratulations! Your GymPass application has been approved.
    </p>

    <p>
      Click below to create your password and activate your account:
    </p>

    <a
      href="${inviteLink}"
      style="
        display:inline-block;
        padding:12px 20px;
        background:#23ee09;
        color:#000;
        text-decoration:none;
        border-radius:8px;
        font-weight:bold;
      "
    >
      Set Password
    </a>

    <p>
      This invitation expires in 24 hours.
    </p>
        `,
      });
    } catch (mailError) {
      console.error("Partner invitation email failed:", mailError);

      // Nothing was created, and the application stays "pending",
      // so the admin can simply try approving again.
      return res.status(500).json({
        success: false,
        message: "Could not send invitation email",
      });
    }

    // ---------- 3. Email sent: now create everything in the database ----------
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      // Re-check inside the transaction in case it was approved meanwhile
      const freshRequest = await GymPartnerRequest.findById(
        req.params.id,
      ).session(session);

      if (!freshRequest || freshRequest.status !== "pending") {
        await session.abortTransaction();
        session.endSession();

        return res.status(400).json({
          success: false,
          message: "Application already processed",
        });
      }

      const partner = await Partner.create(
        [
          {
            ownerName: freshRequest.ownerName,
            email: freshRequest.email,
            phone: freshRequest.phone,

            password: null,

            status: "invited",

            inviteToken,

            inviteExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
          },
        ],
        { session },
      );

      const gymData = {
        partnerId: partner[0]._id,
        placeId: freshRequest.placeId,
        gymName: freshRequest.gymName,
        address: freshRequest.address,
        rating: freshRequest.rating,
        photos: freshRequest.photos,
        passes: freshRequest.passes,
      };

      console.log("Gym data:", gymData);

      const gymDoc = new Gym(gymData);

      await gymDoc.save({ session });

      console.log("Gym created:", gymDoc._id);

      freshRequest.status = "approved";

      await freshRequest.save({ session });

      await session.commitTransaction();
      session.endSession();

      return res.json({
        success: true,
        partner: partner[0],
        gym: gymDoc,
        request: freshRequest,
      });
    } catch (dbError) {
      console.error("Partner creation failed after email was sent:", dbError);

      if (session.inTransaction()) {
        await session.abortTransaction();
      }

      session.endSession();

      return res.status(500).json({
        success: false,
        message: dbError.message,
      });
    }
  } catch (error) {
    console.error("====================");
    console.error(error);
    console.error(error.stack);
    console.error("====================");

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Reject application
// PUT /api/admin/applications/:id/reject

router.put("/applications/:id/reject", adminAuth, async (req, res) => {
  try {
    const request = await GymPartnerRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    request.status = "rejected";

    await request.save();

    return res.json({
      success: true,
      request,
    });
  } catch (error) {
    console.error("Reject application error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ======================================================
// PARTNERS
// ======================================================

// Get all partners
// GET /api/admin/partners

router.get("/partners", adminAuth, async (req, res) => {
  try {
    const partners = await Partner.find().sort({ createdAt: -1 }).lean();

    return res.json({
      success: true,
      partners,
    });
  } catch (error) {
    console.error("Get partners error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load partners",
    });
  }
});

// ======================================================
// GYMS
// ======================================================

// Get all gyms
// GET /api/admin/gyms

router.get("/gyms", adminAuth, async (req, res) => {
  try {
    const gyms = await Gym.find().sort({ createdAt: -1 }).lean();

    return res.json({
      success: true,
      gyms,
    });
  } catch (error) {
    console.error("Get gyms error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load gyms",
    });
  }
});

// ======================================================
// PARTNER SETUP PASSWORD
// IMPORTANT:
// This is for GYM OWNERS/PARTNERS.
// DO NOT REMOVE.
// POST /api/admin/setup-password
// ======================================================

router.post("/setup-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Token and password are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const partner = await Partner.findOne({
      inviteToken: token,
    });

    if (!partner) {
      return res.status(400).json({
        success: false,
        message: "Invalid Link",
      });
    }

    if (
      !partner.inviteExpires ||
      partner.inviteExpires.getTime() < Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invite Expired",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    partner.password = hashedPassword;
    partner.status = "active";
    partner.inviteToken = null;
    partner.inviteExpires = null;

    await partner.save();

    return res.json({
      success: true,
      message: "Password created successfully",
    });
  } catch (error) {
    console.error("Partner setup password error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to set password",
    });
  }
});

// ======================================================
// ADMIN MANAGEMENT
// SUPERADMIN ONLY
// ======================================================

// Get all admins
// GET /api/admin/admins

router.get("/admins", superadminAuth, async (req, res) => {
  try {
    const admins = await Admin.find()
      .select("-password -inviteToken")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      admins,
    });
  } catch (error) {
    console.error("Get admins error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load admins",
    });
  }
});

// Create admin invitation
// POST /api/admin/admins

router.post("/admins", superadminAuth, async (req, res) => {
  try {
    const { name, email, role } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingAdmin = await Admin.findOne({
      email: normalizedEmail,
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "An admin with this email already exists",
      });
    }

    const inviteToken = crypto.randomBytes(32).toString("hex");

    const admin = await Admin.create({
      name: name.trim(),
      email: normalizedEmail,
      password: null,
      role: role === "superadmin" ? "superadmin" : "admin",
      status: "invited",
      inviteToken,
      inviteExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    // const inviteLink = `http://localhost:5173/admin/setup-password?token=${inviteToken}`;
    const adminFrontendUrl = process.env.ADMIN_INVITE_URL;

    if (!adminFrontendUrl) {
      throw new Error("ADMIN_FRONTEND_URL is not configured");
    }

    const inviteLink = `${adminFrontendUrl}/admin/setup-password?token=${inviteToken}`;

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: normalizedEmail,
        subject: "GymPass Admin Invitation",

        html: `
          <h2>Welcome to GymPass Admin</h2>

          <p>Hello ${admin.name},</p>

          <p>
            You have been invited to join the
            GymPass Admin dashboard.
          </p>

          <p>
            Click below to create your password:
          </p>

          <a
            href="${inviteLink}"
            style="
              display:inline-block;
              padding:12px 20px;
              background:#23ee09;
              color:#000;
              text-decoration:none;
              border-radius:8px;
              font-weight:bold;
            "
          >
            Set Password
          </a>

          <p>
            This invitation expires in 24 hours.
          </p>
        `,
      });
    } catch (mailError) {
      console.error("Admin invitation email failed:", mailError);

      await Admin.findByIdAndDelete(admin._id);

      return res.status(500).json({
        success: false,
        message: "Could not send invitation email",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Admin invitation sent successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        status: admin.status,
      },
    });
  } catch (error) {
    console.error("Create admin error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create admin",
    });
  }
});

// Delete admin
// DELETE /api/admin/admins/:id

router.delete("/admins/:id", superadminAuth, async (req, res) => {
  try {
    if (req.params.id === req.admin.adminId) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    await Admin.findByIdAndDelete(req.params.id);

    return res.json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (error) {
    console.error("Delete admin error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete admin",
    });
  }
});

// ======================================================
// ADMIN PASSWORD SETUP
// IMPORTANT:
// This is ONLY for ADMIN accounts.
// POST /api/admin/admins/setup-password
// ======================================================

router.post("/admins/setup-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Token and password are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const admin = await Admin.findOne({
      inviteToken: token,
    });

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "Invalid invitation",
      });
    }

    if (!admin.inviteExpires || admin.inviteExpires.getTime() < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Invitation has expired",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    admin.password = hashedPassword;
    admin.status = "active";
    admin.inviteToken = null;
    admin.inviteExpires = null;

    await admin.save();

    return res.json({
      success: true,
      message: "Password created successfully",
    });
  } catch (error) {
    console.error("Admin setup password error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to set password",
    });
  }
});

// Validate admin invitation
// GET /api/admin/admins/setup-password

router.get("/admins/setup-password", async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Invitation token is required",
      });
    }

    const admin = await Admin.findOne({
      inviteToken: token,
    }).select("name email role status inviteExpires");

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "Invalid invitation",
      });
    }

    if (!admin.inviteExpires || admin.inviteExpires.getTime() < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Invitation has expired",
      });
    }

    return res.json({
      success: true,
      admin: {
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Validate admin invitation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to validate invitation",
    });
  }
});

router.get("/members", adminAuth, async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    const monthlyData = await User.aggregate([
      {
        $match: {
          createdAt: { $exists: true },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    const memberGrowth = monthlyData.map((item) => ({
      month: `${item._id.year}-${String(item._id.month).padStart(2, "0")}`,
      count: item.count,
    }));

    return res.json({
      success: true,
      users,
      memberGrowth,
      totalMembers: users.length,
    });
  } catch (error) {
    console.error("Get members error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load members",
    });
  }
});

router.get("/passes", adminAuth, async (req, res) => {
  try {
    const passes = await Pass.find().sort({ createdAt: -1 }).lean();

    return res.json({
      success: true,
      passes,
      totalPasses: passes.length,
    });
  } catch (error) {
    console.error("Get passes error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load passes",
    });
  }
});

router.get("/payments", adminAuth, async (req, res) => {
  try {
    const payments = await Payments.find().sort({ createdAt: -1 }).lean();

    const totalAmount = payments.reduce(
      (sum, payment) => sum + Number(payment.amount || 0),
      0,
    );

    const successfulPayments = payments.filter(
      (payment) => payment.status === "SUCCESS",
    );

    const pendingPayments = payments.filter(
      (payment) => payment.status === "PENDING",
    );

    const failedPayments = payments.filter(
      (payment) => payment.status === "FAILED",
    );

    return res.json({
      success: true,
      payments,
      totalPayments: payments.length,
      totalAmount,
      successfulPayments: successfulPayments.length,
      pendingPayments: pendingPayments.length,
      failedPayments: failedPayments.length,
    });
  } catch (error) {
    console.error("Get payments error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load payments",
    });
  }
});

// Public page opened from the invitation email; hands the token to the app.
// GET /api/admin/open-setup-password?token=...
router.get("/open-setup-password", (req, res) => {
  const token = String(req.query.token || "");

  // Invite tokens are 64 hex chars; reject anything else (also prevents HTML injection)
  if (!/^[a-f0-9]{64}$/i.test(token)) {
    return res.status(400).send("Invalid invitation link.");
  }

  const appLink = `gympasspartners://setup-password?token=${token}`;
  const fallback = encodeURIComponent(
    process.env.APP_DOWNLOAD_URL || "https://gympasspartners.onrender.com",
  );
  const intentLink =
    `intent://setup-password?token=${token}` +
    `#Intent;scheme=gympasspartners;package=com.sanjanachauhann1.gympasspartners;` +
    `S.browser_fallback_url=${fallback};end`;

  res.type("html").send(`<!doctype html>
<html><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Open GymPass Partners</title>
<style>
  body{margin:0;font-family:system-ui,sans-serif;background:#000;color:#fff;display:flex;
       min-height:100vh;align-items:center;justify-content:center;text-align:center}
  main{max-width:380px;padding:24px} p{color:#bbb}
  a.btn{display:inline-block;margin:16px 0;padding:14px 28px;background:#23ee09;color:#000;
        border-radius:10px;font-weight:700;text-decoration:none}
</style></head>
<body><main>
  <h2>Set up your password</h2>
  <p>Tap below to open the GymPass Partners app.</p>
  <a class="btn" id="open" href="${appLink}">Open the app</a>
  <p><small>App not installed? Install it first, then tap this button again.</small></p>
</main>
<script>
  var isAndroid = /android/i.test(navigator.userAgent);
  var target = isAndroid ? "${intentLink}" : "${appLink}";
  document.getElementById("open").setAttribute("href", target);
  setTimeout(function(){ window.location.href = target; }, 300);
</script>
</body></html>`);
});

export default router;
