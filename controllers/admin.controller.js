const Admin = require("../models/Admin");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const emailValidation = require("../helpers/emailValidation");
const uuid = require("uuid");
const { errorHandler } = require("../helpers/error_handler");

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
    const admin_activation_link = uuid.v4();
    const data = await Admin({
      admin_name,
      admin_email,
      admin_password: adminHashedPassword,
      admin_is_active,
      admin_is_creator,
      admin_activation_link,
    });
    await data.save();
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

const loginAdmin = async (req, res) => {
  try {
    let admin;
    const { login, admin_password } = req.body;
    if (emailValidation(login))
      admin = await Admin.findOne({ admin_email: login });
    if (!admin)
      return res.error(400, { friendlyMsg: "Email or Password is incorrect" });
    const validPassword = bcrypt.compareSync(
      admin_password,
      admin.admin_password
    );
    if (!validPassword)
      return res.error(400, { friendlyMsg: "Email or Password incorrect" });
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
