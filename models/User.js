const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    user_name: {
      type: String,
      trim: true,
      requred: true,
    },
    user_email: {
      type: String,
      trim: true,
      unique: true,
      requred: true,
    },
    user_password: {
      type: String,
      requred: true,
    },
    user_info: {
      type: String,
    },
    user_photo: {
      type: String,
    },
    user_is_active: {
      type: Boolean,
      default: false,
    },
    user_token: {
      type: String,
    },
    user_activate_link: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

module.exports = model("User", userSchema);
