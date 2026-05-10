/**
 * ============================================================
 * 🔐 TITAN AUTHENTICATION CONTROLLER (v5.4 - Master Build)
 * Ref: Report Section 3.1 & 3.2 (Identity & Security)
 * Fix: Prevented Double-Hashing, Added Profile & Password Updates.
 * ============================================================
 */
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const LoginOTP = require("../models/LoginOTP");
const EmailVerification = require("../models/EmailVerification");
const RefreshToken = require("../models/RefreshToken");
const sendMail = require("../utils/sendMail");
const nodemailer = require("nodemailer");
const { successResponse, errorResponse } = require("../utils/apiResponse");

// --- 🛠️ NEURAL HELPERS ---
const generateOTP = () => crypto.randomInt(100000, 999999).toString();

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role }, 
    process.env.JWT_SECRET, 
    { expiresIn: "1h" }
  );
  const refreshToken = jwt.sign(
    { id: user._id }, 
    process.env.JWT_REFRESH_SECRET, 
    { expiresIn: "7d" }
  );
  return { accessToken, refreshToken };
};

// --- 👤 1. GET ME (Identity Discovery) ---
exports.getMe = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Invalid session context. Node unverified." });
  }

  const userId = req.user.id || req.user._id;
  const user = await User.findById(userId).populate("children", "name email");

  if (!user) {
    return res.status(401).json({ success: false, message: "Identity no longer exists in the neural database." });
  }

  return res.status(200).json({
    success: true,
    user: { 
      id: user._id, 
      name: user.name, 
      email: user.email, 
      role: user.role,
      children: user.children 
    }
  });
});

// --- 🔄 2. REFRESH TOKEN (Rotation Protocol) ---
exports.refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken || req.body.refreshToken;
  if (!token) return errorResponse(res, "Session Error: No refresh token detected", 401);

  const record = await RefreshToken.findOne({ token });
  if (!record || new Date() > record.expiresAt) {
    return errorResponse(res, "Session Expired: Please login again to sync node", 403);
  }

  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(decoded.id);
  if (!user) return errorResponse(res, "User node not found", 404);

  const { accessToken } = generateTokens(user);
  
  const cookieOptions = { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production", 
    sameSite: "lax",
    maxAge: 3600000 
  };
  res.cookie("accessToken", accessToken, cookieOptions);

  return successResponse(res, "Token Protocol Rotated Successfully", { token: accessToken, role: user.role });
});

// --- 📝 3. REGISTER (With Guardian-Student Neural Link) ---
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role, childEmail } = req.body; 
  
  if (!email || !password || !name) {
    return errorResponse(res, "Identity Error: Missing critical node parameters", 400);
  }
  
  const normalizedEmail = email?.toLowerCase()?.trim();

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) return errorResponse(res, "Identity Error: Email already registered in system", 400);

  let childrenArray = [];
  // Optional Child Email Logic for Parents
  if (role === "parent" && childEmail) {
    const normalizedChildEmail = childEmail?.toLowerCase()?.trim();
    const childAccount = await User.findOne({ email: normalizedChildEmail, role: "student" });
    
    if (!childAccount) return errorResponse(res, "Linked Student node not found in database.", 404);
    childrenArray.push(childAccount._id);
  }

  const user = await User.create({ 
    name: name?.trim(), 
    email: normalizedEmail, 
    password, 
    role,
    children: childrenArray 
  });
  
  const otp = generateOTP();
  await EmailVerification.create({ user: user._id, otp, expiresAt: new Date(Date.now() + 15 * 60 * 1000) });

  try {
    await sendMail(user.email, "TITAN - Verify Email", `Your registration OTP is: ${otp}`);
    return successResponse(res, "Verification email broadcasted.", null, 201);
  } catch (e) {
    return successResponse(res, "Node created (Dev Mode Active).", { devOtp: otp }, 201);
  }
});

// --- 📧 4. VERIFY EMAIL OTP ---
exports.verifyEmailOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return errorResponse(res, "Missing email or OTP verification sequence", 400);

  const normalizedEmail = email?.toLowerCase()?.trim();
  const user = await User.findOne({ email: normalizedEmail });
  if (!user) return errorResponse(res, "Identity node not found", 404);

  const record = await EmailVerification.findOne({ user: user._id, otp: otp?.toString()?.trim() });
  if (!record || new Date() > record.expiresAt) {
    return errorResponse(res, "Security Error: Invalid or expired OTP sequence", 400);
  }

  user.isVerified = true;
  await user.save();
  await EmailVerification.deleteOne({ _id: record._id });

  return successResponse(res, "Email Verified Successfully. Node Active.");
});

// --- 🔑 5. LOGIN (Identity Handshake) ---
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return errorResponse(res, "Missing login credentials", 400);

  const normalizedEmail = email?.toLowerCase()?.trim();
  const user = await User.findOne({ email: normalizedEmail }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    return errorResponse(res, "Credential Error: Handshake Denied", 401);
  }

  if (!user.isVerified) return errorResponse(res, "Security Lock: Verify email first to activate node", 403);

  const otp = generateOTP();
  await LoginOTP.findOneAndUpdate(
    { user: user._id }, 
    { otp, expiresAt: new Date(Date.now() + 15 * 60 * 1000) }, 
    { upsert: true, new: true }
  );

  try {
    await sendMail(user.email, "TITAN - Login Code", `Your login code is: ${otp}`);
    return successResponse(res, "MFA Challenge sent to Email.");
  } catch (mailError) {
    return successResponse(res, "MFA Challenge (Dev Mode Active).", { devOtp: otp });
  }
});

// --- 🔑 6. VERIFY LOGIN OTP (Session Initialization) ---
exports.verifyLoginOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ success: false, message: "Missing OTP verification sequence" });

  const normalizedEmail = email?.toLowerCase()?.trim();
  const user = await User.findOne({ email: normalizedEmail });
  if (!user) return res.status(404).json({ success: false, message: "Identity node not found" });

  const record = await LoginOTP.findOne({ user: user._id, otp: otp?.toString()?.trim() });
  if (!record || new Date() > record.expiresAt) {
    return res.status(400).json({ success: false, message: "Security Error: Invalid or expired OTP sequence" });
  }

  const { accessToken, refreshToken } = generateTokens(user);

  await RefreshToken.create({ 
    user: user._id, 
    token: refreshToken, 
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
  });

  const cookieOptions = { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production", 
    sameSite: "lax" 
  };

  res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 3600000 });
  res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 604800000 });

  await LoginOTP.deleteOne({ _id: record._id });

  return res.status(200).json({
    success: true,
    token: accessToken,
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
});

// --- 🔄 7. RESEND OTP ---
exports.resendEmailOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return errorResponse(res, "Email parameter missing", 400);

  const normalizedEmail = email?.toLowerCase()?.trim();
  const user = await User.findOne({ email: normalizedEmail });
  if (!user) return errorResponse(res, "Identity node not found", 404);

  const otp = generateOTP();
  await EmailVerification.findOneAndUpdate(
    { user: user._id },
    { otp, expiresAt: new Date(Date.now() + 15 * 60 * 1000) },
    { upsert: true }
  );

  try {
    await sendMail(user.email, "TITAN - New OTP", `Your new OTP is: ${otp}`);
    return successResponse(res, "New MFA Code broadcasted.");
  } catch (mailError) {
    return successResponse(res, "New Code (Dev Mode).", { devOtp: otp });
  }
});

// --- 🚪 8. LOGOUT (Node Clean) ---
exports.logout = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (token) await RefreshToken.deleteOne({ token });
  
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return successResponse(res, "Session Terminated: Node memory cleaned");
});

// --- 🔗 9. LINK ADDITIONAL CHILD ---
exports.linkAdditionalChild = asyncHandler(async (req, res) => {
  const { childEmail } = req.body;
  if (!childEmail) return errorResponse(res, "Target student email is required.", 400);

  const parentId = req.user.id || req.user._id;
  const normalizedChildEmail = childEmail?.toLowerCase()?.trim();

  const student = await User.findOne({ email: normalizedChildEmail, role: "student" });
  if (!student) return errorResponse(res, "Student node not found in registry.", 404);

  const updatedParent = await User.findByIdAndUpdate(
    parentId, 
    { $addToSet: { children: student._id } },
    { returnDocument: 'after' }
  ).populate("children", "name email");

  return successResponse(res, "Neural link established with additional student node!", updatedParent.children);
});


// ============================================================
// 🔐 10. NEURAL KEY RECOVERY (Forgot Password)
// ============================================================
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  
  const user = await User.findOne({ email });
  if (!user) {
    return errorResponse(res, "No node found with this email.", 404);
  }

  const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.EMAIL_USER || 'test@example.com', 
      pass: process.env.EMAIL_PASS || 'password'
    }
  });

  const mailOptions = {
    from: 'Titan Engine Admin <admin@titan.com>',
    to: user.email,
    subject: 'TITAN: Neural Key Recovery (Password Reset)',
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #020617; color: #fff; padding: 40px; border-radius: 10px;">
        <h2 style="color: #3b82f6;">TITAN SECURITY OVERRIDE</h2>
        <p>We received a request to reset your Neural Key (Password).</p>
        <p>Click the secure link below to proceed. This link will self-destruct in 15 minutes.</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px;">Reset Password</a>
        <p style="margin-top: 30px; font-size: 12px; color: #64748b;">If you didn't request this, ignore this email.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return successResponse(res, "Recovery link dispatched to your email.");
  } catch (emailError) {
    console.log(`\n🚨 [TITAN SECURITY]: Email failed. Use this link to reset password:\n🔗 ${resetUrl}\n`);
    return successResponse(res, "Recovery link generated. (Check Server Console if email fails)");
  }
});

// ============================================================
// 🔑 11. SET NEW PASSWORD (Reset Password via Email)
// ============================================================
exports.resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return errorResponse(res, "Invalid or expired recovery token.", 400);
    }

    // 🔥 FIX: Directly set the password. The User model's pre-save hook will hash it automatically.
    user.password = password;
    await user.save();

    return successResponse(res, "Neural Key updated successfully. You can now login.");
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return errorResponse(res, "Recovery link has expired.", 400);
    }
    return errorResponse(res, "Internal server error or invalid token.", 500);
  }
});

// ============================================================
// ⚙️ 12. UPDATE NODE CONFIG (Update Profile Info)
// ============================================================
exports.updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id || req.user._id);
  
  if (!user) {
    return errorResponse(res, "Node not found in registry.", 404);
  }

  // Sirf Name update kar rahe hain, Email update complex hota hai OTP ke bina
  user.name = req.body.name || user.name;
  await user.save();

  return successResponse(res, "Identity Dossier updated successfully.", {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  });
});

// ============================================================
// 🔐 13. INTERNAL KEY OVERRIDE (Change Password Inside App)
// ============================================================
exports.updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    return errorResponse(res, "Please provide both current and new Neural Keys.", 400);
  }

  const user = await User.findById(req.user.id || req.user._id).select("+password");

  if (!user) {
    return errorResponse(res, "Node not found.", 404);
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return errorResponse(res, "Current Neural Key is incorrect.", 401);
  }

  // 🔥 FIX: Directly assign the new password, pre-save hook handles hashing
  user.password = newPassword;
  await user.save();

  return successResponse(res, "Neural Key updated securely.");
});