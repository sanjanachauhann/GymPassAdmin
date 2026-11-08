import dotenv from "dotenv";

dotenv.config();

const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

// Same interface as the old Nodemailer/Resend transporter,
// so the calls in your routes (transporter.sendMail({...})) don't change.
const transporter = {
  async sendMail(options) {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.MAIL_FROM || process.env.EMAIL_USER;

    if (!apiKey) throw new Error("BREVO_API_KEY is not configured");
    if (!senderEmail) throw new Error("MAIL_FROM is not configured");

    const recipients = (
      Array.isArray(options.to) ? options.to : [options.to]
    ).map((email) => ({ email }));

    const body = {
      sender: { name: "GymPass", email: senderEmail },
      to: recipients,
      subject: options.subject,
    };

    if (options.html) body.htmlContent = options.html;
    if (options.text) body.textContent = options.text;

    const res = await fetch(BREVO_URL, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(
        `Brevo ${res.status}: ${data.message || JSON.stringify(data)}`,
      );
    }

    return {
      messageId: data.messageId,
      accepted: recipients.map((r) => r.email),
    };
  },
};

console.log(
  process.env.BREVO_API_KEY
    ? "✅ Brevo mail transport configured"
    : "❌ BREVO_API_KEY missing",
);

export default transporter;

// import { Resend } from "resend";
// import dotenv from "dotenv";

// dotenv.config();

// const resend = new Resend(process.env.RESEND_API_KEY);

// const transporter = {
//   async sendMail(options) {
//     const result = await resend.emails.send({
//       from: process.env.EMAIL_USER,
//       to: Array.isArray(options.to) ? options.to : [options.to],
//       subject: options.subject,
//       html: options.html,
//       text: options.text,
//     });

//     if (result.error) {
//       throw new Error(result.error.message);
//     }

//     return {
//       messageId: result.data?.id,
//       accepted: options.to,
//     };
//   },
// };

// export default transporter;
// // import nodemailer from "nodemailer";
// // import dotenv from "dotenv";

// // dotenv.config();

// // console.log("EMAIL_USER:", process.env.EMAIL_USER);
// // console.log(
// //   "EMAIL_PASS length:",
// //   process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : "Missing",
// // );

// // // const transporter = nodemailer.createTransport({
// // //   service: "gmail",
// // //   auth: {
// // //     user: process.env.EMAIL_USER,
// // //     pass: process.env.EMAIL_PASS,
// // //   },
// // // });

// // const transporter = nodemailer.createTransport({
// //   host: "smtp.gmail.com",
// //   port: 587,
// //   secure: false,
// //   family: 4,
// //   auth: {
// //     user: process.env.EMAIL_USER,
// //     pass: process.env.EMAIL_PASS,
// //   },
// // });

// // if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
// //   transporter.verify((error) => {
// //     if (error) {
// //       console.error("❌ Transport verify failed:");
// //       console.error(error);
// //     } else {
// //       console.log("✅ Mail transporter is ready.");
// //     }
// //   });
// // }

// // export default transporter;
