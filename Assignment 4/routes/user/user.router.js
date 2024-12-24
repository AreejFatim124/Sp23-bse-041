// Import required modules
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Import user model
const User = require("../../models/user.model");

router.post("/register", async (req, res) => {
    try {
      console.log("Request Body:", req.body); // Log the request body
      const { name, email, password, role } = req.body; 
      console.log("Received registration data:", req.body); // Log the received data

      if (!role || !["admin", "customer"].includes(role)) {
      console.error("Invalid role:", role); // Log invalid role
        return res.status(400).send({ message: "Invalid role" });
      }

      if (!name || !email || !password) {
        return res.status(400).send({ message: "Missing required fields" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = User.create({
      name,
      email,
      password:hashedPassword,
      role,
})
  
      
      res.redirect('/login'); // Redirect to login page after successful registration
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  });


  exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user credentials
    const user = await User.findOne({ email });

    // If the user doesn't exist or the password is invalid
    if (!user || !(await bcrypt.compare(password, user.password))) {
      req.flash("error", "Invalid email or password.");
      return res.redirect("/login");
    }

    // Fetch user's active status from the UserStatus collection
    const userStatus = await UserStatus.findOne({ userId: user._id });

    req.session.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Set tokens in cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true, // Protect the cookie from JavaScript access
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "lax", // Allows cookies to be sent with cross-origin requests
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // Redirect based on user role
    if (user.role === "admin") {
      return res.redirect("admin/dashboard");
    } else if (user.role === "customer") {
      return res.redirect("/placeOrder");
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

  } catch (error) {
    req.flash("error", "Internal Server Error.");
    res.redirect("/login");
  }
};

// REFRESH TOKEN
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.status(401).json({ message: "No refresh token provided" });

    const { user } = verifyRefreshToken(refreshToken);
    const newAccessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid refresh token", error });
  }
};

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).send({ message: "Invalid email or password" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).send({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET, // Ensure this is properly set
      { expiresIn: "1h" }
    );

    if (user.role === "admin") {
      res.status(200).send({ token, redirect: "/admin/dashboard" });
    } else {
      res.status(200).send({ token, redirect: "/placeOrder" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});


module.exports = router;