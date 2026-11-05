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
import dotenv from "dotenv";

dotenv.config();

const transporter = {
  async sendMail(options) {
    const toList = (Array.isArray(options.to) ? options.to : [options.to]).map(
      (email) => ({ email }),
    );

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "GymPass",
          email: process.env.SENDER_EMAIL || process.env.EMAIL_USER,
        },
        to: toList,
        subject: options.subject,
        htmlContent: options.html,
        textContent: options.text,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || `Brevo error ${res.status}`);
    }

    return {
      messageId: data.messageId,
      accepted: options.to,
    };
  },
};

export default transporter;
