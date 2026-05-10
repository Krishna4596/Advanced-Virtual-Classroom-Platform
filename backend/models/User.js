/**
 * ============================================================
 * 🗃️ TITAN USER SCHEMA (v5.1 - Anti-Crash Build)
 * Ref: Report Section 3.1 (Identity Management)
 * Fixed: Removed 'next' from async pre-save hook to prevent crashes.
 * ============================================================
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Identity node requires a designation (Name)"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Electronic mailing address is mandatory"],
      unique: true, 
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Invalid email format detected"],
    },
    password: {
      type: String,
      required: [true, "Security encryption key (Password) is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false, 
    },
    role: {
      type: String,
      enum: ["student", "teacher", "parent", "admin"],
      default: "student",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    // 🔥 NEURAL LINK: Parent-Child Relationship Array
    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// 🔒 1. CRYPTOGRAPHIC MIDDLEWARE: Password Hashing
// 🔥 FIX: Removed 'next' parameter. Mongoose handles async promises automatically.
userSchema.pre("save", async function () {
  // Agar password modify nahi hua hai, toh seedha return (no next() needed)
  if (!this.isModified("password")) return;

  // Hashing process (Mongoose automatically catches errors in async functions)
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 🔑 2. IDENTITY VALIDATION: Password Match Function
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// 🚀 EXPORT: Default module export
const User = mongoose.model("User", userSchema);
module.exports = User;