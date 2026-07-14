const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const [scheme, token] = (authHeader || "").split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      error: true,
      message: "Authorization header must use the Bearer token format.",
    });
  }

  if (!process.env.ACCESS_TOKEN_SECRET) {
    return res.status(500).json({
      error: true,
      message: "Server access-token secret is not configured.",
    });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({
        error: true,
        message:
          err.name === "TokenExpiredError"
            ? "Access token has expired. Please log in again."
            : "Access token is invalid. Please log in again.",
      });
    }
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken }; 
