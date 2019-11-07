const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseAdminSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    min: 6
  },
  role: {
    type: String,
    default: "course-admin"
  }
});

const COURSEADMIN = mongoose.model("courseadminschema", courseAdminSchema);
module.exports = { model: COURSEADMIN, schema: courseAdminSchema };
