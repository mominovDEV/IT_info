const jwt = require("jsonwebtoken");
const config = require("config");

class JwtService {
  constructor(accesKey, refreshKey, accesTime, refreshTime) {
    this.accesKey = accesKey;
    this.refreshKey = refreshKey;
    this.accesTime = accesTime;
    this.refreshTime = refreshTime;
  }

  async verifyAccess(token) {
    return jwt.verify(token, this.accesKey, {});
  }
  async verifyRefresh(token) {
    return jwt.verify(token, this.refreshKey, {});
  }

  generateTokens(payload) {
    const accesToken = jwt.sign(payload, this.accesKey, {
      expiresIn: this.accesTime,
    });

    const refreshToken = jwt.sign(payload, this.refreshKey, {
      expiresIn: this.refreshTime,
    });

    return {
      accesToken,
      refreshToken,
    };
  }
}

module.exports = new JwtService(
  config.get("access_key"),
  config.get("refresh_key"),
  config.get("acces_time"),
  config.get("refresh_time")
);