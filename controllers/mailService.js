const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

const trans = async (mailOptions) => {
  try {
    const sent = await transporter.sendMail(mailOptions);
    return sent;
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = { trans };
