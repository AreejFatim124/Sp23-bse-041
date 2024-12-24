// Import required modules
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Import user model and authMiddleware
const User = require("../../models/user.model");

// Register Route
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
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.redirect("/login"); // Redirect to login page after successful registration
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Login Route
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

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    if (user.role === "admin") {
      res.status(200).redirect("/admin/dashboard")} 
    else {
      res.status(200).redirect("/placeOrder")
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.post("/logout", (req, res) => {
  try {
    console.log("Logout request received");

    // Clear the access token cookie
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // Clear the user session
    req.session.user = null;

    // Redirect to the login page
    res.redirect("/login");
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;

