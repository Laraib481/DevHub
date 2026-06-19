const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendOtpEmail } = require("../utils/mailer");
const {
  generateOtp,
  hashOtp,
  compareOtp,
  getOtpExpiry,
  isOtpExpired,
} = require("../utils/otp");

const router = express.Router();

// Shared shape for the user object returned to the client.
// Never includes the password or any OTP fields.
function publicUser(user) {
  return {
    id: user._id,
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    role: user.role,
    bio: user.bio,
    about: user.about,
    skills: user.skills,
    publicNotes: user.publicNotes,
    publicSnippets: user.publicSnippets,
    publicResources: user.publicResources,
  };
}

router.post("/signup", async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    if (!fullName || !username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    // A verified account already exists -> block. But if a previous signup
    // left an UNVERIFIED account (same email), allow it to be re-registered so
    // the user is not permanently locked out by an abandoned attempt.
    if (existingUser) {
      const sameEmail = existingUser.email === email;
      const isAbandonedUnverified =
        sameEmail && existingUser.isVerified === false;

      if (!isAbandonedUnverified) {
        return res.status(400).json({
          message: "Email or username already exists",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate the email verification OTP and store it hashed with an expiry.
    const otp = generateOtp();
    const verifyOtp = await hashOtp(otp);
    const verifyOtpExpiry = getOtpExpiry();

    let userToVerify;

    if (existingUser) {
      // Re-use the abandoned unverified record with fresh details + OTP.
      existingUser.fullName = fullName;
      existingUser.username = username;
      existingUser.password = hashedPassword;
      existingUser.isVerified = false;
      existingUser.verifyOtp = verifyOtp;
      existingUser.verifyOtpExpiry = verifyOtpExpiry;
      userToVerify = await existingUser.save();
    } else {
      const newUser = new User({
        fullName,
        username,
        email,
        password: hashedPassword,
        isVerified: false,
        verifyOtp,
        verifyOtpExpiry,
        role: "Developer",
        bio: "",
        about: "",
        skills: [],
        publicNotes: [],
        publicSnippets: [],
        publicResources: [],
      });
      userToVerify = await newUser.save();
    }

    // Email the OTP. If sending fails, remove the half-created record so the
    // user can retry cleanly, and report the failure.
    try {
      await sendOtpEmail({
        to: userToVerify.email,
        subject: "Verify your DevHub account",
        heading: "Confirm your email",
        intro: `Hi ${fullName}, use the code below to verify your DevHub account.`,
        otp,
      });
    } catch (mailError) {
      if (!existingUser) {
        await User.findByIdAndDelete(userToVerify._id);
      }
      return res.status(502).json({
        message: "Could not send verification email. Please try again later.",
      });
    }

    return res.status(201).json({
      message:
        "Account created. A verification code has been sent to your email.",
      email: userToVerify.email,
      requiresVerification: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Signup failed",
      error: error.message,
    });
  }
});

// Verify the email using the OTP sent during signup.
router.post("/verify-email", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and verification code are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified === true || user.isVerified === undefined) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    if (isOtpExpired(user.verifyOtpExpiry)) {
      return res.status(400).json({
        message: "Verification code has expired. Please request a new one.",
      });
    }

    const isMatch = await compareOtp(String(otp), user.verifyOtp);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    // Success: mark verified and clear the OTP so it can never be reused.
    user.isVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpiry = null;
    await user.save();

    return res.status(200).json({
      message: "Email verified successfully. You can now log in.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Verification failed",
      error: error.message,
    });
  }
});

// Resend a fresh verification OTP to an unverified account.
router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    // Always respond the same way so this endpoint can't be used to probe
    // which emails are registered.
    const genericResponse = {
      message: "If an unverified account exists, a new code has been sent.",
    };

    if (!user || user.isVerified === true || user.isVerified === undefined) {
      return res.status(200).json(genericResponse);
    }

    const otp = generateOtp();
    user.verifyOtp = await hashOtp(otp);
    user.verifyOtpExpiry = getOtpExpiry();
    await user.save();

    try {
      await sendOtpEmail({
        to: user.email,
        subject: "Your new DevHub verification code",
        heading: "Confirm your email",
        intro: "Here is a new verification code for your DevHub account.",
        otp,
      });
    } catch (mailError) {
      return res.status(502).json({
        message: "Could not send verification email. Please try again later.",
      });
    }

    return res.status(200).json(genericResponse);
  } catch (error) {
    return res.status(500).json({
      message: "Could not resend code",
      error: error.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Block unverified accounts. Note we check `=== false` explicitly: existing
    // users created before this feature have `isVerified === undefined` and are
    // treated as already verified, preserving backward compatibility.
    if (user.isVerified === false) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
        requiresVerification: true,
        email: user.email,
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: publicUser(user),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
});

// Step 1 of password reset: email a reset OTP to the registered address.
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    // Respond identically whether or not the account exists, to avoid leaking
    // which emails are registered.
    const genericResponse = {
      message: "If an account exists, a reset code has been sent.",
    };

    if (!user) {
      return res.status(200).json(genericResponse);
    }

    const otp = generateOtp();
    user.resetOtp = await hashOtp(otp);
    user.resetOtpExpiry = getOtpExpiry();
    await user.save();

    try {
      await sendOtpEmail({
        to: user.email,
        subject: "Reset your DevHub password",
        heading: "Password reset request",
        intro: "Use the code below to reset your DevHub password.",
        otp,
      });
    } catch (mailError) {
      return res.status(502).json({
        message: "Could not send reset email. Please try again later.",
      });
    }

    return res.status(200).json(genericResponse);
  } catch (error) {
    return res.status(500).json({
      message: "Could not process request",
      error: error.message,
    });
  }
});

// Step 2 of password reset: verify the OTP and set the new password.
// Verification and password change happen in a single call so the OTP is
// consumed exactly once.
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        message: "Email, code and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (isOtpExpired(user.resetOtpExpiry)) {
      return res.status(400).json({
        message: "Reset code has expired. Please request a new one.",
      });
    }

    const isMatch = await compareOtp(String(otp), user.resetOtp);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid reset code" });
    }

    // Set the new password and clear the OTP so it cannot be reused.
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = "";
    user.resetOtpExpiry = null;
    await user.save();

    return res.status(200).json({
      message: "Password reset successfully. You can now log in.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Password reset failed",
      error: error.message,
    });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "-password").sort({ createdAt: -1 });

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
});

router.put("/profile/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      fullName,
      username,
      role,
      bio,
      about,
      skills,
      publicNotes,
      publicSnippets,
      publicResources,
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        fullName,
        username,
        role,
        bio,
        about,
        skills,
        publicNotes,
        publicSnippets,
        publicResources,
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        fullName: updatedUser.fullName,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        bio: updatedUser.bio,
        about: updatedUser.about,
        skills: updatedUser.skills,
        publicNotes: updatedUser.publicNotes,
        publicSnippets: updatedUser.publicSnippets,
        publicResources: updatedUser.publicResources,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Profile update failed",
      error: error.message,
    });
  }
});

module.exports = router;