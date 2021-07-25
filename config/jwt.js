const jwt = require("jsonwebtoken");
const config = require("./auth.config");
module.exports = {
  issue(payload, expiresIn) {
    return jwt.sign(payload, config.secret, {
      expiresIn,
    });
  },
};
