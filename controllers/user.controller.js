const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("../services/JwtService");
const config = require("config");
const emailValidation = require("../helpers/emailValidation");
const ApiError = require("../error/ApiError");
const generate = require("generate-password")

const addUser = async (req, res) => {
  try {
    const {
      user_name,
      user_email,
      user_password,
      user_info,
      user_photo
    } = req.body;
    const userHashedPassword = bcrypt.hashSync(user_password, 7);

    // const user_activation_link = uuid.v4()
    const data = await User({
      user_name,
      user_email,
      user_password: userHashedPassword,
      user_info,
      user_photo,
      user_activation_link
    });
    await data.save();
    // await mailService.sendActivationMail(
    //   user_email,
    //   `${config.get("api_url")}/api/user/activate/${user_activation_link}`
    // )
    // const payload = {
    //   id:data._id,
    //   user_is_active:data.user_is_active
    // }
    const tokens = jwt.generateTokens(payload)
    data.user_token = tokens.refreshToken
    await data.save()
    res.cookie("refreshToken",tokens.refreshToken,{
      maxAge:config.get("refresh_ms"),
      httpOnly:true
    })
    res.ok(200,{...tokens,user:payload});
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const data = await User.find({});
    if (!data.length)
      return res.error(400, { friendlyMsg: "Information not found" });
    res.send(data);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};
const getUser = async (req, res) => {
  try {
    const id = req.params.id;
    const idData = await User.findById(id);
    if (!idData)
      return res.error(400, { friendlyMsg: "Information is not found" });
    // res.ok(200, idData);
    res.status(200).send(idData)
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const idData = await User.findById(id);
    if (!idData)
      return res.error(400, { friendlyMsg: "Information was not found" });
    const {
      user_name,
      user_email,
      user_password,
      user_info,
      user_photo,
      user_reg_date,
    } = req.body;
    const userHashedPassword = bcrypt.hashSync(user_password, 7);
    const data = await User.findByIdAndUpdate(
      { _id: id },
      {
        user_name,
        user_email,
        user_password: userHashedPassword,
        user_info,
        user_photo,
        user_reg_date,
      }
    );
    await data.save();
    res.ok(200, "OK.Info was updated");
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const idData = await User.findById(id);
    if (!idData)
      return res.error(400, { friendlyMsg: "Information was not found" });
    await User.findByIdAndDelete(id);
    if (req.user.id !== req.params.id){
      ApiError.unauthorized(res, {
        friendlyMsg: "User ro'yxatga olinmagan"
      });
    }
    res.ok(200, { friendlyMsg: "Ok. userInfo is deleted" });
  }
    catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
} 

const loginUser = async (req, res) => {
  let user;
  const { login, user_password } = req.body;
  if (emailValidation(login)) user = await User.findOne({ user_email: login });
  else user = await User.findOne({ user_name: login });
  if (!user) return res.error(400, { friendlyMsg: "Malumotlar notogri" });
  const validPassword = bcrypt.compareSync(user_password, user.user_password);
  if (!validPassword)
    return res.error(400, { friendlyMsg: "Malumotlaringiz notogri" });
  const payload = {
    id: user.id,
  };
  const tokens = jwt.generateTokens(payload);
  user.user_token = tokens.refreshToken;
  await user.save();
  res.cookie("refreshToken", tokens.refreshToken, {
    maxAge: config.get("refresh_ms"),
    httpOnly: true,
  });
  res.ok(200, tokens);
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    let user;
    if (!refreshToken)
      return res.error(400, { friendlyMsg: "Token is not found" });
    user = await User.findOneAndUpdate(
      { user_token: refreshToken },
      { user_token: "" },
      { new: true }
    );
    if (!user) return res.error(400, { friendlyMsg: "Token topilmadi" });
    res.clearCookie("refreshToken");
    res.ok(200, user);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const refreshUserToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken)
      return res.error(400, { friendlyMsg: "Token is not found" });
    const adminDataFromCookie = await jwt.verifyRefresh(refreshToken);
    const adminDataFromDb = await User.findOne({ admin_token: refreshToken });
    if (!adminDataFromCookie || !adminDataFromDb) {
      return res.error(400, { friendlyMsg: "Admin is not registered" });
    }
    const user = await User.findById(adminDataFromCookie.id);
    if (!user) return res.error(400, { friendlyMsg: "ID is incorrect" });
    const payload = {
      id: user.id,
    };
    const tokens = jwt.generateTokens(payload);
    user.user_token = tokens.refreshToken;
    await user.save();
    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("refresh_ms"),
      httpOnly: true,
    });
    res.ok(200, tokens);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const activateLink = async (req,res) => {
  try {
    const link = req.params.link
    const data = await User.findOne({user_activation_link:link})
    if(!data) return res.error(403,{friendlyMsg:"Data is not found"})
    if(data.user_is_active == true) return res.error(400,{friendlyMsg:"User has already been activated"})
    data.user_is_active = true
    await data.save()
    res.ok(200,"User is activated")
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
}

const forgetPassword = async (req,res) =>{
  try {
    const {user_email} = req.body
    const user = await User.findOne({user_email})
    if(!user) return res.error(400,{friendlyMsg:"Information is not found"})
    let password = generate.generate({
      length: 10,
      numbers: true
    });
    await mailService.sendPasswordMail(
      user_email,
      password
    )
    let hashpassword = bcrypt.hashSync(password,7)
    user.user_password = hashpassword
    await user.save()
    res.ok(200,{message:"We send new password to your email"})
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
}
module.exports = {
  getUser,
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  loginUser,
  logout,
  refreshUserToken,
  activateLink,
  forgetPassword
};
