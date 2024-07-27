import { createTransport } from "nodemailer";
const sendEmail = async (to, subject, html) => {
  const transporter = createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: true,
    service: "gmail",
    auth: {
      user: "ziady5060@gmail.com",
      pass: "xjvsspiukvephrvq",
    },
  });

  const info = await transporter.sendMail({
    from: '"ziad yassin" <ziady5060@gmail.com>',
    to: to,
    subject: subject,
    html: html,
  });
  console.log("Message sent: %s", info);
};

export default sendEmail;
