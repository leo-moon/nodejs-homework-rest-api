const nodemailer = require("nodemailer");
require("dotenv").config();

const { UKRNET_PASS, EMAIL_FROM } = process.env;

const nodemailerConfig = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_FROM,
    pass: UKRNET_PASS,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async data => {
  const email = { ...data, from: EMAIL_FROM };
  await transport.sendMail(email);
  return true;
};

module.exports = sendEmail;
