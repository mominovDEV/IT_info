// const jwt = require("jsonwebtoken");
const config = require("config");
const myJwt = require("../services/JwtService");

module.exports = async function (req, res, next) {
  if (req.method === "OPTIONS") {
    next();
  }
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(403).json({ message: "avtor ruyhatdan utmagan" });
    }
    console.log(authorization);
    const bearer = authorization.split(" ")[0];
    const token = authorization.split(" ")[1];
    if (bearer != "Bearer" || !token) {
      return res.status(403).json({ message: "bear ruyhatdan utmagan" });
    }

    const [error, decodedToken] = await to(
      myJwt.verifyAccess(token, config.get("secret"))
    );
    if (error) {
      return res.status(403).send({ message: error.message });
    }
    req.author = decodedToken;
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).send({ message: "bear ruyhatdan utmagan" });
  }
};
async function to(promise) {
  return promise.then((response) => [null, response]).catch((error) => [error]);
}
