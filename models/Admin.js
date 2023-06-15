const { Schema, model } = require("mongoose");

const adminSchema = new Schema(
  {
    admin_name: {
      type: String,
      required: true,
      trim: true,
    },
    admin_email: {
      type: String,
      required: true,
      lowercase: true,
    },
    admin_password: {
      type: String,
      required: true,
    },
    admin_is_active: {
      type: Boolean,
      default: false,
    },
    admin_is_creator: {
      type: Boolean,
    },
    created_date: {
      type: Date,
    },
    updated_date: {
      type: Date,
    },
  },
  { versionKey: false, timestamps: true }
);

module.exports = model("Admin", adminSchema);
