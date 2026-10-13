import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const transporter = {
  async sendMail(options) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured.");
    }

    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "GymPass <onboarding@resend.dev>",
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
    });

    if (result.error) {
      console.error("Resend email error:", result.error);
      throw new Error(result.error.message || "Email delivery failed.");
    }

    return result.data;
  },
};

export default transporter;

// import nodemailer from "nodemailer";
// import dotenv from "dotenv";

// dotenv.config();

// console.log("EMAIL_USER:", process.env.EMAIL_USER);
// console.log(
//   "EMAIL_PASS length:",
//   process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : "Missing",
// );

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
//   transporter.verify((error) => {
//     if (error) {
//       console.error("❌ Transport verify failed:");
//       console.error(error);
//     } else {
//       console.log("✅ Mail transporter is ready.");
//     }
//   });
// }

// export default transporter;
