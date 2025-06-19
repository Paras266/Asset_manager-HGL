import dotenv from "dotenv";
dotenv.config(); // Must be called before accessing process.env

import nodemailer from "nodemailer";

export const sendMail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER, // your email
      pass: process.env.MAIL_PASS, // app password
    },
  });

  await transporter.sendMail({
    from: `"Haldyn Glass" <${process.env.MAIL_USER}>`,
    to,
    subject,
    text,
  });
};
