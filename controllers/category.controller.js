const mongoose = require("mongoose");
const Category = require("../models/Category");
const ApiError = require("../error/ApiError");

const addCategory = async (req, res) => {
  try {
    const { category_name, parent_category_id } = req.body;

    if (parent_category_id !== undefined) {
      let check = await Category.findOne({ category_name });

      let isValid = mongoose.Types.ObjectId.isValid(parent_category_id);

      if (!isValid) return res.json(400, { message: "Id is incorrect" });

      if (check) {
        return res.json(400, { message: "The category has already added" });
      }
      const data = await Category({ category_name, parent_category_id });
      await data.save();
      return res.ok(200, "The category is added! ");
    }
    let check = await Category.findOne({ category_name });
    if (check) {
      return res.json(400, { message: "The category has already added" });
    }
    const data = await Category({ category_name, parent_category_id });
    await data.save();
    return res.json( "The category is added");
  } catch (error) {
    console.log(error);
  }
};
const getCategories = async (req, res) => {
  try {
    const data = await Category.find({});
    if (!data) {
      return res.error(400, { message: "Information not found" });
    }
    res.send(data);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const getCategory = async (req, res) => {
  try {
    const id = req.params.id;
    let isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) return res.error(400, { message: "Id is incorrect" });
    const data = await Category.findById(id);
    if (!data) return res.error(400, { message: "Information not found" });
    res.send(data);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const id = req.params.id;
    let isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) return res.error(400, { message: "Id is incorrect" });
    const data = await Category.findById(id);
    if (!data) {
      return res.error(404, { message: "Not found this such Id" });
    }
    const { error, value } = categoryValidation(req.body);
    if (error) {
      console.log(error);
      return res.error(400, { message: error.details[0].message });
    }
    const { category_name, parent_category_id } = value;
    await Category.findByIdAndUpdate(
      { _id: id },
      { category_name, parent_category_id }
    );
    res.ok(200, "Category is updated");
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    let isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) return res.error(400, { message: "Id is incorrect" });
    const data = await Category.findByIdAndDelete(id);
    if (!data) {
      return res.error(404, { message: "Not found such id" });
    }
    res.ok(200, "Category is deleted");
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};
module.exports = {
  addCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
