import nodemailer from "nodemailer";

const sendMail = async (email: string, html: string) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Welcome to Learnlink",
    text: "Hello, welcome to Learnlink",
    html
  };

  return transporter.sendMail(mailOptions);
};

export default sendMail;
