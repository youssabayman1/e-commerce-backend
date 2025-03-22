const nodemailer = require("nodemailer");

const sendEmail = async (option) => {
  try {
    // 1. Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // Ensure you use correct variable name
      port: process.env.EMAIL_PORT, // Ensure this is correctly set (e.g., 587 for Gmail)
      service: "gmail", // or another service name like "outlook", or you can remove it if using custom SMTP
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASSWORD, // Your email password or app password
      },
    });

    // 2. Define mail options
    const mailOpts = {
      from: "E-Shop App <yousstest910@gmail.com>", // Sender address
      to: option.email, // Recipient address (from the options passed to the function)
      subject: option.subject, // Subject of the email
      text: option.message, // Body of the email
    };

    // 3. Send email
    await transporter.sendMail(mailOpts);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("There was an error sending the email");
  }
};

module.exports = sendEmail;
