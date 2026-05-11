// backend/utils/sendMail.js
const nodemailer = require("nodemailer");
const logger = require("./logger");

/**
 * 📧 NEURAL MAIL INTERFACE (TITAN v4.2)
 * Ref: Report Section 3.3.1 (Identity Verification & MFA)
 * Purpose: Handling outbound SMTP communication for OTPs and academic alerts.
 */

// 🛰️ TRANSPORTER CONFIGURATION: Optimized for Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Your 16-digit Google App Password
  },
  // 🛡️ PERFORMANCE: Use pooling for bulk transmissions (e.g., class announcements)
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
});

// 🔍 STARTUP HANDSHAKE: Validating SMTP tunnel integrity
transporter.verify((error, success) => {
  if (error) {
    logger.error("❌ Mail Engine Sync Failed: " + error.message);
  } else {
    console.log("🚀 [TITAN-MAIL]: Ready for outbound transmissions.");
  }
});

/**
 * @param {string} to - Recipient email address
 * @param {string} subject - Email Subject
 * @param {string} text - Plain text fallback
 */
const sendMail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: `"Titan Virtual Classroom" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      // 🎨 TITAN BRANDED TEMPLATE
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #1e293b; padding: 20px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 24px; letter-spacing: 2px;">TITAN SECURITY</h1>
          </div>
          <div style="padding: 30px; line-height: 1.6; color: #334155; background-color: #ffffff;">
            <p style="font-size: 16px;">Hello User,</p>
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 20px 0;">
              <p style="margin: 0; font-size: 18px; font-weight: bold; color: #1e293b;">${text}</p>
            </div>
            <p style="font-size: 14px; color: #64748b;">If you did not request this, please secure your account immediately.</p>
          </div>
          <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #94a3b8;">
            © 2026 Titan Virtual Classroom Protocol. Automated Node.
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`📨 Email Dispatched: ${info.messageId} to ${to}`);
    return info;
  } catch (error) { 
    logger.error("❌ SMTP Handshake Error: ", error.message);
    throw new Error("Failed to send verification email. Check SMTP settings.");
  }
};

module.exports = sendMail;