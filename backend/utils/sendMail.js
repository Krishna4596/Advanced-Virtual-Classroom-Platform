// backend/utils/sendMail.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 2525, // 🔥 FIX 1: Render block bypass (2525 port)
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("❌ BREVO CONNECTION ERROR: ", error.message);
  } else {
    console.log("🚀 [TITAN-MAIL]: Ready for outbound transmissions via Brevo.");
  }
});

const sendMail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: `"Titan Virtual Classroom" <krishprajapat9977@gmail.com>`,
      to,
      subject,
      text,
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #1e293b; padding: 20px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 24px; letter-spacing: 2px;">TITAN SECURITY</h1>
          </div>
          <div style="padding: 30px; line-height: 1.6; color: #334155;">
            <p>Hello User,</p>
            <div style="background-color: #f8fafc; padding: 20px; border-left: 4px solid #3b82f6; margin: 20px 0;">
              <p style="margin: 0; font-size: 18px; font-weight: bold;">${text}</p>
            </div>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email Dispatched: ${info.messageId}`);
    return info;
  } catch (error) {
    // 🔥 FIX 2: Asli error console mein print karega
    console.log("\n🔴 ASLI BREVO ERROR KYA HAI: ", error); 
    throw new Error("Failed to send verification email.");
  }
};

module.exports = sendMail;