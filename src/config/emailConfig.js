import nodemailer from 'nodemailer';

var transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "351ba1bf241496",
    pass: "a7341f1a77201f"
  }
});
export default transporter;