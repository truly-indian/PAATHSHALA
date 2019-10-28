const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//here we need to add section type schema

const sectionTypeSchema = new Schema({
  videos: [
    new Schema({
      id: {
        type: Schema.Types.ObjectId
      },
      link: { type: String },
      section_name: {
        type:String
      }
    })
  ],
  theory_img: [
    new Schema({
      id: {
        type: Schema.Types.ObjectId
      },
      img_path: { light: "", dark: "" },
      section_name: {
        type:String
      }
    })
  ],
  theory_richtext: [
    new Schema({
      id: {
        type: Schema.Types.ObjectId
      },
      text_data: { type: String },
      section_name: {
        type:String
      }
    })
  ],
  quiz: [
    {
      questionsimg: { light: String, dark: String },
      answerimg: { light: String, dark: String },
      videoSolutionURL: {},
      answerkey: String,
      section_name: {
        type:String
      }
    }
  ], // need to be discuss
  assignment: [
    {
      questionsimg: { light: "", dark: "" },
      answerimg: { light: "", dark: "" },
      videoSolutionURL: {},
      section_name: {
        type:String
      }
    }
  ]
});

const kdSectionSchema = new Schema({
  id: {
    type: Schema.Types.ObjectId
  },
  section_title: {
    type: String
  },
  section_type: sectionTypeSchema,
  page_title: {
    type: String
  }
});

const KDSECTION = mongoose.model("kdsection", kdSectionSchema);

module.exports = { model: KDSECTION, schema: kdSectionSchema };
