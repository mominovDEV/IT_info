const Description = require("../models/Description");
const Dictionary = require("../models/Dictionary");
const Category = require("../models/Category");
const mongoose = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");

const addDescription = async (req, res) => {
  try {
    const { dict_id, category_id, description } = req.body;
    let isValid = mongoose.Types.ObjectId.isValid(dict_id);
    let isValid2 = mongoose.Types.ObjectId.isValid(category_id);
    if (!isValid || !isValid2)
      return res.error(404, { message: "Id is incorrect" });
    let ans1 = await Dictionary.findOne({ _id: dict_id });
    let ans2 = await Category.findOne({ _id: category_id });
    if (!ans1) {
      return res.error(400, { message: "Dictionarydan id topilmadi" });
    }
    if (!ans2) {
      return res.error(400, { message: "Categorydan idga topilmadi" });
    }
    const data = await Description({ dict_id, category_id, description });
    await data.save();
    res.ok(200, "Description is added! ");
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const getDescriptions = async (req, res) => {
  try {
    const data = await Description.find({}).populate("dict_id");
    if (!data) {
      return res.json(404, { message: "Information is not found" });
    }
    res.send(data);
  } catch (error) {
    console.log(error);
    errorHandler(res, error);
  }
};

const getDescription = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Description.findById(id);
    if (!result) {
      return res.error(400, { message: "Id bo'yicha ma'lumot topilmadi" });
    }
    // res.ok(200, result);
    res.status(200).send(result);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const updateDescription = async (req, res) => {
  try {
    const id = req.params.id;
    const { dict_id, category_id, description } = req.body;
    let check = await Dictionary.findOne({ _id: dict_id });
    let check2 = await Category.findById({ _id: category_id });
    if (!check || !check2) {
      return res.error(400, { message: "Id bo'yicha ma'lumot topilmadi" });
    }
    const info = await Description.findByIdAndUpdate(
      { _id: id },
      { dict_id, category_id, description }
    );
    res.ok(200, { message: "Description is updated ! " });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const deleteDescription = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Description.findById({ _id: id });
    if (result == null) {
      return res.error(404, { message: "Id bo'yicha ma'lumot yo'q" });
    }
    await Description.findByIdAndDelete(id);
    res.ok(200, "Description is deleted");
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};
module.exports = {
  addDescription,
  getDescriptions,
  getDescription,
  updateDescription,
  deleteDescription,
};
