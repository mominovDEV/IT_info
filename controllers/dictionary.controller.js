const Dictionary = require("../models/Dictionary");
const addDictionary = async (req, res) => {
  try {
    const { term } = req.body;
    let check = await Dictionary.findOne({
      term: { $regex: term, $options: "i" },
    });
    if (check) {
      return res.json(404, { message: "This is has already added" });
    }
    const data = await Dictionary({ term, letter: term[0] });
    await data.save();
    res.ok(200, { message: "The term is added! " });
  } catch (error) {
    console.log(error);
  }
};
const getDictionaries = async (req, res) => {
  try {
    const data = await Dictionary.find({});
    res.send(data);
  } catch (error) {
    console.log(error);

  }
};
const updateDictionary = async (req, res) => {
  try {
    const id = req.params.id;
    const { term, letter } = req.body;
    await Dictionary.findByIdAndUpdate({ _id: id }, { term, letter });
    res.ok(200, { message: "Term is succesfully updated" });
  } catch (error) {
    console.log(error);

  }
};
const getDictionary = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Dictionary.findById(id);
    res.json(data);
  } catch (error) {
    console.log(error);
  }
};
const deleteDictionary = async (req, res) => {
  try {
    const id = req.params.id;
    await Dictionary.findByIdAndDelete(id);
    res.ok(200, "The term is deleted");
  } catch (error) {
    console.log(error);

  }
};
const getTermByLetter = async (req, res) => {
  try {
    const letter = req.params.letter;
    const data = await Dictionary.find({ letter });
    res.send(data);
  } catch (error) {
    console.log(error);

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
