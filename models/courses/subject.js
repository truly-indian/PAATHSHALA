const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chapterSchema = require("../kdchapter").schema;

const SubjectSchema = new Schema({
  courseId: {
    type: String
  },
  SubjectTitle: {
    type: String
  },
  Description: {
    type: String
  },
  courseTitle:{
   type:String
  },
  Chapters: [chapterSchema]
});

const Subject = mongoose.model("subject", SubjectSchema);

module.exports = { model: Subject, schema: SubjectSchema };
