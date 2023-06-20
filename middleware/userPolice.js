const jwt = require("../services/JwtService");
const config = require("config");
const to = require("../helpers/error_handler");

module.exports = async function (req, res, next) {
  if (req.method === "OPTIONS") {
    next();
  }
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(403).json({ message: "User1 ro'yxatdan o'tmagan" });
    }
    const token = authorization.split(" ")[1];
    if (!token) {
      return res.status(403).json({ message: "User2 ro'yxatdan o'tmagan" });
    }
    // const decodedData = jwt.verifyAccess(token,config.get("secret"))
    // req.user = decodedData
    // if(user.id !== req.params.id){
    //     return res.status(403).send({message:"Xato! User faqat o'zini o'chira oladi"})
    // }
    [err, decodedData] = await to(
      jwt.verifyAccess(token, config.get("secret"), {})
    );
    if (err) {
      console.log(err.message);
      return res.error(400, { friendlyMsg: err.message });
    }
    req.user = decodedData;
    if (decodedData.id === undefined) {
      return res
        .status(403)
        .send({ message: "Error : JWT Adminga tegishli emas!" });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({ message: "User ro'yxatdan o'tmagan" });
  }
};
