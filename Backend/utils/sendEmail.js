import nodemailer from "nodemailer";
import fs from "fs";
import handlebars from "handlebars";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to generate email HTML
export const generateEmailHTML = ({
  username,
  status,
  authorityName,
  ownerEmail,
  ownerPhone,
}) => {
  const templatePath = path.join(__dirname, "trip-status-template.html");
  const templateSource = fs.readFileSync(templatePath, "utf8");
  const template = handlebars.compile(templateSource);

  return template({
    username,
    statusText: status === "approved" ? "approved" : "rejected",
    statusClass: status === "approved" ? "status-approved" : "status-rejected",
    isApproved: status === "approved",
    authorityName,
    ownerEmail,
    ownerPhone,
  });
};

// Function to send email
export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "kulunukasthuri38@gmail.com",
        pass: "qhyc zpvw ogig hrtm", // App password (replace securely)
      },
    });

    const mailOptions = {
      from: "pasindumalshan934@gmail.com",
      to,
      subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
