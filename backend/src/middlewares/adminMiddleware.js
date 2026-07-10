const jwtProvider = require("../utils/jwtProvider");
const userService = require("../service/userService.js");
const UserRoles = require("../domain/UserRole");

const adminMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access denied. Token missing or invalid.",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Access denied. Token missing or invalid.",
      });
    }

    const email = jwtProvider.getEmailFromjwt(token);
    const user = await userService.findUserByEmail(email);

    if (!user || user.role !== UserRoles.ADMIN) {
      return res.status(403).json({
        message: "Access denied. Admin access only.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = adminMiddleware;
