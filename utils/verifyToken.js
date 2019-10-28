const localStorage = require("./localStorage");
const jwt = require("jsonwebtoken");
const jwtSecret = require("../config/jwtSecret");

const verifyToken = (req, res, next) => {
  const savedToken = localStorage.getItem("loginToken");
 console.log(savedToken)
  if (savedToken) {
    jwt.verify(savedToken, jwtSecret.jwtKey, (err, authData) => {
      if (err) {
        res.status(403).json({ message: "You are authorized to access this route" });
      } else {
        req.authData = authData;
        next();
      }
    });
  } else {
    res.status(404).json({ message: "Token not Found, please login" });
  }
};

module.exports = verifyToken;
