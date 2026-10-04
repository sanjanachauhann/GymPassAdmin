import { Router } from "express";
import GymPartnerRequest from "../../models/GymPassPartner.js";
import Partner from "../../models/Partner.js";
import Gym from "../../models/Gym.js";
import crypto from "crypto";
import transporter from "../utils/mail.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const router = Router();

console.log("🔥 REGISTERING ADMIN ROUTES");

router.get("/test123", (req, res) => {
  console.log("🔥 TEST ROUTE HIT");

  res.json({
    message: "ADMIN ROUTER IS WORKING",
  });
});

router.get("/applications", async (req, res) => {
  console.log("🔥 GET /api/admin/applications HIT");

  try {
    const requests = await GymPartnerRequest.find().sort({
      createdAt: -1,
    });
    // console.log(requests);

    res.json(requests);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// router.put("/applications/:id/approve", async (req, res) => {
//   console.log("approving");
//   try {
//     const request = await GymPartnerRequest.findById(req.params.id);

//     if (!request) {
//       return res.status(404).json({
//         success: false,
//         message: "Application not found",
//       });
//     }

//     if (request.status !== "pending") {
//       return res.status(400).json({
//         success: false,
//         message: "Application already processed",
//       });
//     }

//     // Create Partner
//     // const partner = await Partner.create({
//     //   ownerName: request.ownerName,
//     //   email: request.email,
//     //   phone: request.phone,
//     // });

//   }
// });
router.put("/applications/:id/approve", async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Find request
    const request = await GymPartnerRequest.findById(req.params.id).session(
      session,
    );

    if (!request) {
      await session.abortTransaction();
      session.endSession();

      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (request.status !== "pending") {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        success: false,
        message: "Application already processed",
      });
    }

    console.log("email tttttt ", request.email);

    // Check existing partner
    const existingPartner = await Partner.findOne({
      email: request.email,
    }).session(session);

    if (existingPartner) {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        success: false,
        message: "Partner already exists.",
      });
    }

    // Generate invite token
    const inviteToken = crypto.randomBytes(32).toString("hex");

    // Create partner
    const partner = await Partner.create(
      [
        {
          ownerName: request.ownerName,
          email: request.email,
          phone: request.phone,

          password: null,

          status: "invited",

          inviteToken,

          inviteExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      ],
      { session },
    );

    // const gym = await Gym.create(
    //     [
    //       {
    //         partnerId: partner[0]._id,
    //         placeId: request.placeId,
    //         gymName: request.gymName,
    //         address: request.address,
    //         rating: request.rating,
    //         photos: request.photos,
    //         passes: request.passes,
    //       },
    //     ],
    //     { session },
    //   );
    const gymData = {
      partnerId: partner[0]._id,
      placeId: request.placeId,
      gymName: request.gymName,
      address: request.address,
      rating: request.rating,
      photos: request.photos,
      passes: request.passes,
    };

    console.log("Gym data:", gymData);

    const gymDoc = new Gym(gymData);

    console.log("Document before save:", gymDoc);

    await gymDoc.save({ session });

    console.log("Gym created");

    console.log("Gym created");

    // Update request
    request.status = "approved";
    await request.save({ session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    //--------------------------------------------------
    // Send email AFTER database commit
    //--------------------------------------------------

    const inviteLink = `gympasspartners://setup-password?token=${inviteToken}`;

    try {
      console.log(inviteLink);
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: request.email,
        subject: "GymPass Partner Approved",

        html: `
          <h2>Congratulations!</h2>

          <p>Your GymPass application has been approved.</p>

          <p>Click below to activate your account.</p>

          <a href="${inviteLink}">
            Activate Account
          </a>

          <p>This link expires in 24 hours.</p>
        `,
      });
    } catch (mailError) {
      console.log("Email failed:", mailError);
      // Don't fail the approval because email can always be resent.
    }

    res.json({
      success: true,
      partner: partner[0],
      gym: gymDoc,
      request,
    });
  } catch (err) {
    console.log("====================");
    console.log(err);
    console.log(err.stack);
    console.log("====================");

    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    session.endSession();

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.put("/applications/:id/reject", async (req, res) => {
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

    res.json({
      success: true,
      request,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.get("/setup-password", (req, res) => {
  const { token } = req.query;
  // res.redirect(`http://localhost:8081/--/setup-password?token=${token}`);
  res.redirect(inviteLink);
});

router.post("/setup-password", async (req, res) => {
  const { token, password } = req.body;

  const partner = await Partner.findOne({
    inviteToken: token,
  });

  if (!partner) {
    return res.status(400).json({
      message: "Invalid Link",
    });
  }

  if (partner.inviteExpires < Date.now()) {
    return res.status(400).json({
      message: "Invite Expired",
    });
  }

  const hashed = await bcrypt.hash(password, 10);

  partner.password = hashed;

  partner.status = "active";

  partner.inviteToken = null;

  partner.inviteExpires = null;

  await partner.save();

  res.json({
    success: true,
  });
});

export default router;
