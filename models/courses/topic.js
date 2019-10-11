const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TopicSchema = new Schema({
  chapterId: {
    type: String 
  }, 
  topicTitle: {
    type: String
  },
  Description: {
    type: String
  },
  chapterTitle:{
   type:String
  },
  learnpage: {
    type: Array
  },
  theorypage: {
    type: Array
  },
  assignmentpage: {
    type: Array
  }
});

const Topic = mongoose.model("topic", TopicSchema);

module.exports = { model: Topic, schema: TopicSchema };

