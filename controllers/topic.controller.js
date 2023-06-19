const Topic = require("../models/Topic");
const Author = require("../models/Author");

const ApiError = require("../error/ApiError")

const addTopic = async (req, res) => {
  try {
    const {
      author_id,
      topic_title,
      topic_text,
      is_checked,
      id_approved,
      expert_id,
    } = req.body;
    let check1 = await Author.findOne({ _id: author_id });
    let check2 = await Author.findOne({ _id: expert_id });
    if (check1 == null)
      return res.error(400, {message: "author_id bo'yicha ma'lumot yo'q"});
    if (check2 == null) return res.error(400, {message:"expert_id xato kiritilgan"});
    const data = await Topic({
      author_id,
      topic_title,
      topic_text,
      is_checked,
      id_approved,
      expert_id,
    });
    await data.save();
    res.ok(200, "Topic is added ! Succesfully");
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const getTopic = async (req, res) => {
  try {
    const id = req.params.id;
    const idData = await Topic.findById(id);
    if (!idData)
      return res.error(404,{ message: "Id xato berilgan ma'lumot yoq ekan" });
    // res.ok(200, idData);
    res.send(idData)
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};
const getTopics = async (req, res) => {
  try {
    const data = await Topic.find({});
    if (!data) return res.error(404,{message:"ma'lumot topilmadi"});
    res.send(data);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};
const updateTopic = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      author_id,
      topic_title,
      topic_text,
      is_checked,
      id_approved,
      expert_id,
    } = req.body;
    const idData = await Topic.findById(id);
    if (!idData)
      return res.error(400, {message: "Berilgan id bo'yicha ma'lumot topilmadi."});
    await Topic.findByIdAndUpdate(
      { _id: id },
      { author_id, topic_title, topic_text, is_checked, id_approved, expert_id }
    );
    res.ok(200, "Topic is updated");
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};
const deleteTopic = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Topic.findById(id);
    if (!data) return res.error(404,{message:"Id xato kiritilgan!"});
    await Topic.findByIdAndDelete(id);
    res.ok(200, "OK. TopicInfo is deleted");
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};
module.exports = {
  addTopic,
  getTopic,
  getTopics,
  deleteTopic,
  updateTopic,
};
