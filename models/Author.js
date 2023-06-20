const { Schema, model } = require("mongoose");

const authorSchema = new Schema(
  {
    author_firstname: {
      type: String,
      required: true,
      trim: true,
    },
    author_lastname: {
      type: String,
      trim: true,
    },
    author_nickname: {
      type: String,
      required: true,
      trim: true,
    },
    author_email: {
      type: String,
      required: true,
      unique: true,
    },
    author_password: {
      type: String,
      required: true,
    },
    author_phone: {
      type: String,
    },

    author_info: {
      type: String,
    },
    author_position: {
      type: String,
    },
    author_photo: {
      type: String,
    },
    is_expert: {
      type: Boolean,
    },
    author_token: {
      type: String,
    },
    author_activation_link:{
      type:String
    },
    author_is_active:{
      type:Boolean,
      default:false,
    },
  },
  { versionKey: false }
);

module.exports = model("author", authorSchema);
