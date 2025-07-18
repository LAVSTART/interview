// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// const protect = async (req, res, next) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     try {
//       token = req.headers.authorization.split(" ")[1];
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       req.user = await User.findById(decoded.id).select("-password");
//       next();
//     } catch (error) {
//       console.error(error);
//       res.status(401).json({ message: "Not authorized, token failed" });
//     }
//   }

//   if (!token) {
//     res.status(401).json({ message: "Not authorized, no token" });
//   }
// };

// module.exports = { protect }; // ✅ Very important: must be exported as object

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Check for Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      return next();
    } catch (error) {
      console.error("❌ JWT error:", error.name);

      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Token expired. Please log in again.",
        });
      }

      return res.status(401).json({
        message: "Invalid or malformed token.",
        error: error.message,
      });
    }
  }

  // If no token at all
  if (!token) {
    return res.status(401).json({
      message: "No token provided. Access denied.",
    });
  }
};

module.exports = { protect };
