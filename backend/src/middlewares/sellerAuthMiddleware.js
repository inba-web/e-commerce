const sellerService = require("../service/sellerService");
const jwtProvider = require("../utils/jwtProvider");

const sellerMiddleware = async (req, res, next) => {
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

    const email = jwtProvider.getEmailFromjwt(token);

    const seller = await sellerService.getSellerByEmail(email);

    if (!seller) {
      return res.status(404).json({
        message: "Seller not found",
      });
    }

    req.seller = seller;

    next();
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = sellerMiddleware;