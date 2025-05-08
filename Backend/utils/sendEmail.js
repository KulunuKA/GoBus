import nodemailer from "nodemailer";

export const sendEmail = async (email, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "kulunukasthuri38@gmail.com",
        pass: "qhyc zpvw ogig hrtm",
      },
    });

    const mailOptions = {
      from: "pasindumalshan934@gmail.com",
      to: email,
      subject: subject,
      text: message,
    };

    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
