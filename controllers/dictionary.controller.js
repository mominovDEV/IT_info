const Dictionary = require("../models/Dictionary");
const ApiError = require("../error/ApiError");

const addDictionary = async (req, res) => {
  try {
    const { term, letter } = req.body;
    let check = await Dictionary.findOne({
      term: { $regex: term, $options: "i" },
    });
    if (check) {
      return res.error(404, { message: "This is has already added" });
    }
    const data = await Dictionary({ term, letter });
    await data.save();
    res.ok(200, { message: "The term is added! " });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};
const getDictionaries = async (req, res) => {
  try {
    const data = await Dictionary.find({});
    res.send(data);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};
const updateDictionary = async (req, res) => {
  try {
    const id = req.params.id;
    const { term, letter } = req.body;
    await Dictionary.findByIdAndUpdate({ _id: id }, { term, letter });
    res.ok(200, { message: "Term is succesfully updated" });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};
const getDictionary = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Dictionary.findById(id);
    res.send(data);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};
const deleteDictionary = async (req, res) => {
  try {
    const id = req.params.id;
    await Dictionary.findByIdAndDelete(id);
    res.ok(200, "The term is deleted");
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};
const getTermByLetter = async (req, res) => {
  try {
    const letter = req.params.letter;
    const data = await Dictionary.find({ letter });
    res.send(data);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};
module.exports = {
  addDictionary,
  getDictionaries,
  updateDictionary,
  getDictionary,
  getTermByLetter,
  deleteDictionary,
};
