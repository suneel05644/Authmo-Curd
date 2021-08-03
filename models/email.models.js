// import nodemailer from "nodemailer";

// export const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_LOGIN,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

// export const getPasswordResetURL = (user, token) =>
//   `http://localhost:3500/user/password/reset/${user._id}/${token}`;

// export const resetPasswordTemplate = (user, url) => {
//   const from = process.env.EMAIL_LOGIN;
//   const to = user.email;
//   const subject = "🌻 Backwoods Password Reset 🌻";
//   const html = `
//   <p>Hey ${user.displayName || user.email},</p>
//   <p>We heard that you lost your Backwoods password. Sorry about that!</p>
//   <p>But don’t worry! You can use the following link to reset your password:</p>
//   <a href=${url}>${url}</a>
//   <p>If you don’t use this link within 1 hour, it will expire.</p>
//   <p>Do something outside today! </p>
//   <p>–Your friends at Backwoods</p>
//   `;

//   return { from, to, subject, html };
// };

const nodeMailer = require("nodemailer");

const defaultEmailData = { from: "noreply@node-react.com" };

exports.sendEmail = (emailData) => {
  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: "sunilkumar05644@gmail.com",
      pass: "wayrqqylnisahqye",
    },
  });
  return transporter
    .sendMail(emailData)
    .then((info) => console.log(`Message sent: ${info.response}`))
    .catch((err) => console.log(`Problem sending email: ${err}`));
};
