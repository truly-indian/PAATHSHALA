const Course = require("../../models/courses/course").model;
const Subject = require("../../models/courses/subject").model;
const Chapter = require("../../models/courses/chapter").model;
const Topic = require('../../models/courses/topic').model
// all the post routes for courses starts from here//////
//=============add course rotue===========//
exports.addCourse = (req, res) => {
  //here need to write joi validation check for req.body
  const { CourseTitle, Created_by, Description, Video_link } = req.body;
  const newCourse = {
    CourseTitle,
    Created_by,
    Description,
    Video_link
  };
  new Course(newCourse)
    .save()
    .then(newcourse => {
      res.status(200).json({ ...newcourse._doc, message: "Course Added Successfully", status: 200 });
    })
    .catch(err => {
      res.status(400).json(err);
    });
}; 
//============add Subject routes==================//
exports.addSubject = (req, res) => {
  Course.findOne({ CourseTitle: req.body.CourseTitle }).then(course => {
    if (!course) {
      res.status(404).json({ message: "No such course found!!!", status: 404 });
    }
    const { SubjectTitle, Description, CourseTitle } = req.body;

    const newSubject = {
      courseId: course._id,
      SubjectTitle,
      Description,
      CourseTitle
    };
    new Subject(newSubject)
      .save()
      .then(subject => {
        Subject.findOne({ CourseTitle })
          .then(subject => {
            Course.findOneAndUpdate({ CourseTitle: req.body.CourseTitle }, { $push: { Subjects: subject._id } }, { new: true })
              .then(data => res.json(data))
              .catch(err => console.log(err));
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  });
};
//===============add chapter route======================//
exports.addChapter = (req, res) => {
  Subject.findOne({ SubjectTitle: req.body.SubjectTitle }).then(subject => {
    if (!subject) {
      res.status(400).json("No subject found!!");
    }
    const {subjectTitle, chapterTitle, Description} = req.body
    const newChapter = {
      subjectTitle,
      chapterTitle,
      Description,
      subjectId: subject._id
    };
    new Chapter(newChapter)
      .save()
      .then(chapter => {
        Chapter.findOne({ subjectTitle: req.body.subjectTitle })
          .then(chapter => {
            Subject.findOneAndUpdate({ subjectTitle: req.body.subjectTitle }, { $push: { Chapters: chapter._id } }, { new: true })
              .then(data => res.json(data))
              .catch(err => console.log(err));
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  });
};
//===============addtopic route=======================//
exports.addTopic = (req, res) => {
  Chapter.findOne({ chapterTitle: req.body.chapterTitle }).then(chapter => {
    if (!chapter) {
      res.status(400).json("no chapter found");
    }
    const {topicTitle, Description, chapterTitle} = req.body
    const newTopic = {
      topicTitle,
      chapterId: chapter._id,
      Description,
      chapterTitle
    };
    new Topic(newTopic)
      .save()
      .then(topic => {
        Topic.findOne({ topictitle: req.body.chapterTitle })
          .then(topic => {
            Chapter.findOneAndUpdate({ chapterTitle: req.body.chapterTitle }, { $push: { Topics: topic._id } }, { new: true })
              .then(data => res.json(data))
              .catch(err => console.log(err));
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  });
};

//all the get routes for courses starts from here===============//
//========get rotue for all the courses==============//
exports.getCourses = (req,res) => {
  Course.find()
  .then((courses) => {
        res.status(200).json(courses)
  })
  .catch((err) => {
        res.status(404).json({message:"Course not Found"})
  })
}
//==================get route for all the subjects=====================//
exports.getSubjects = (req,res) => {
    Subject.find()
    .then((subjects) => {
           res.status(200).json(subjects)
    }).catch((err) => {
        res.status(404).json({message:'Subject not found'})
    })
}

//====================get route for all the chapters==================//
exports.getChapters = (req,res) => {
    Chapter.find()
    .then((chapters) => {
       res.status(200).json(chapters)
    }).catch((err) => {
        res.status(404).json({message:'Chapter not found'})
    })
}

//===========get route for all the topics ====================//
exports.getTopics = (req,res) => {
      Topic.find()
      .then((topics) => {
          res.status(200).json(topics)
      })
      .catch((err) => {
            res.status(404).json({message:'Topic not found'})
      })
}

//==================all the delete routes start from here===================//
//---------delete route for course-------------------------
exports.deleteCourse = (req,res) => {
   Course.remove({_id:req.params.courseid})
   .then(() => {
        res.status(200).json({message:'Course has been deleted sucessfully!!'})
   }).catch((err) => {
        res.status(400).json(err)
   })
}

//-------------------delete route for subject-------------------------//
exports.delteSubject = (req,res) => {
    Subject.remove({_id:req.params.subjectid})
    .then(() => {
       res.status(200).json({message:'Subject deleted sucessfully!!'})
    })
    .catch((err) => {
       res.status(400).json(err)
    })
}

//----------------delete route for Chapter---------------------//
exports.deleteChapter = (req,res) => {
    Chapter.remove({_id:req.params.chapterid})
    .then(() => {
      res.status(200).json({message:'chapter deleted sucessfully!!'})
    })
    .catch((err) => {
       res.status(400).json(err)
    })
}

//---------------delete route for topic--------------------//
exports.deleteTopic = (req,res) => {
        Topic.remove({_id:req.params.topicid})
        .then(() => {
           res.status(200).json({message:'topic deleted sucessfully!!'})
        })
        .catch((err) => {
            res.status(400).json(err)
        })
}