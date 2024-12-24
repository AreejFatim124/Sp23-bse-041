const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // Check for token in cookies
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).send({ message: "Authentication required" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Store the decoded user information in the request

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(403).send({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
