const jwt = require("jsonwebtoken");

const verifyJwtToken = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.warn(`No JWT token provided from IP: ${req.ip}`);
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No Token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    logger.warn(`Invalid or expired JWT token from IP: ${req.ip}`);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or Expired Token" });
  }
};

module.exports = { verifyJwtToken };
