import adminAuth from "./adminAuth.js";

export default function superadminAuth(req, res, next) {
  adminAuth(req, res, () => {
    if (req.admin.role !== "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Superadmin access required",
      });
    }

    next();
  });
}
