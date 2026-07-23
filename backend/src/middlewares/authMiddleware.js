const jwtProvider = require("../utils/jwtProvider");
const userService = require("../service/userService.js");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Invalid token, authorization failed",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Invalid token, authorization failed",
      });
    }

    let email;
    try {
      email = jwtProvider.getEmailFromjwt(token);
    } catch (err) {
      return res.status(401).json({
        message: "Invalid token, authorization failed",
      });
    }

    let user;
    try {
      user = await userService.findUserByEmail(email);
    } catch (err) {
      return res.status(401).json({
        message: "User does not exist, authorization failed",
      });
    }
    req.user = user;
    console.log(`Authenticated user : ${user.email}`);  

    next();
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = authMiddleware;