const jwt = require("jsonwebtoken");
const SECRET = process.env.TOKEN;
class JWTHandler {
  static generate(data) {
    return jwt.sign(data, SECRET);
  }
  static validate(jwt) {}
  static getData(jwt) {}
}

module.exports = JWTHandler;
