const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const jwt = require("../services/JwtService");
const config = require("config");
const emailValidation = require("../helpers/emailValidation");
const mongoose = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");

const generateAccessToken = (id, is_expert, authorRoles) => {
  const payload = {
    id,
    is_expert,
    authorRoles,
  };
  return jwt.sign(payload, config.get("secret"), { expiresIn: "1h" });
};

const loginAdmin = async (req, res) => {
  try {
    let admin;
    const { login, admin_password } = req.body;
    if (emailValidation(login))
      admin = await Admin.findOne({ admin_email: login });
    if (!admin)
      return res.json(400, { message: "Email or Password is incorrect" });
    const validPassword = bcrypt.compareSync(
      admin_password,
      admin.admin_password
    );
    if (!validPassword)
      return res.json(400, { message: "Email or Password incorrect" });

    const token = generateAccessToken(admin._id, admin.admin_is_active, [
      "READ",
      "WRITE",
    ]);

    res.status(200).send({ token: token });
  } catch (error) {
    console.log(error);
    errorHandler(res, error);
  }
};

const addAdmin = async (req, res) => {
  try {
    const {
      admin_name,
      admin_email,
      admin_password,
      admin_is_active,
      admin_is_creator,
    } = req.body;
    const adminHashedPassword = bcrypt.hashSync(admin_password, 7);
    console.log(adminHashedPassword);
    const data = await Admin({
      admin_name,
      admin_email,
      admin_password: adminHashedPassword,
      admin_is_active,
      admin_is_creator,
    });
    await data.save();
    res.json({ message: "Create success", admin: data });
  } catch (error) {
    console.log(error);
    errorHandler(res, error);
  }
};

const getAdmins = async (req, res) => {
  try {
    const data = await Admin.find({});
    if (!data.length)
      return res.error(400, { message: "Information not found" });
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    errorHandler(res, error);
  }
};

const getAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    let isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) return res.error(300, "Id is Incorrect");
    const idData = await Admin.findById(id);
    if (!idData) return res.error(400, { message: "Information not found" });
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    errorHandler(res, error);
  }
};

const updateAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    let isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) return res.error(300, { message: "Id is Incorrect" });
    const idData = await Admin.findById(id);
    if (!idData)
      return res.error(400, { message: "Information was not found" });
    const {
      admin_name,
      admin_email,
      admin_password,
      admin_is_active,
      admin_is_creator,
      admin_reg_data,
    } = req.body;
    const adminHashedPassword = bcrypt.hashSync(admin_password, 7);
    await Admin.findByIdAndUpdate(
      { _id: id },
      {
        admin_name,
        admin_email,
        admin_password: adminHashedPassword,
        admin_is_active,
        admin_is_creator,
        admin_reg_data,
      }
    );
    res.ok(200, "OK.Info was updated");
  } catch (error) {
    console.log(error);
    errorHandler(res, error);
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    let isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) return res.error(300, { message: "Id is Incorrect" });
    const idData = await Admin.findById(id);
    if (!idData)
      return res.error(400, { message: "Information was not found" });
    await Admin.findByIdAndDelete(id);
    res.ok(200, "Ok. AdminInfo is deleted");
  } catch (error) {
    console.log(error);
    errorHandler(res, error);
  }
};

module.exports = {
  getAdmin,
  getAdmins,
  addAdmin,
  updateAdmin,
  deleteAdmin,
  loginAdmin,
};
