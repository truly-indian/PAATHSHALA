const Course = require("../../models/courses/course").model;
const Subject = require("../../models/courses/subject").model;
const Chapter = require("../../models/courses/chapter").model;
const Topic = require('../../models/courses/topic').model
// all the post routes for courses starts from here//////
//=============add course rotue===========//
exports.addCourse = (req, res) => {
  //here need to write joi validation check for req.body
  const { CourseTitle, Created_by, Description, Video_link } = req.body;
  console.log(req.body)
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
  Course.findOne({ CourseTitle: req.body.courseTitle }).then(course => {
    if (!course) {
      return res.status(404).json({ message: "No such course found!!!", status: 404 });
    }
    const { SubjectTitle, Description } = req.body;
   
    const newSubject = {
      courseId: course._id,
      SubjectTitle,
      Description,
      courseTitle:req.body.courseTitle
    };
    
    new Subject(newSubject)
      .save()
      .then(subject => {
        Subject.findOne({SubjectTitle:req.body.SubjectTitle})
          .then(subject => {
            Course.findOneAndUpdate({ CourseTitle: req.body.courseTitle }, { $push: { Subjects: subject._id } }, { new: true })
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
    const {SubjectTitle, chapterTitle, Description} = req.body
    const newChapter = {
      SubjectTitle,
      chapterTitle,
      Description,
      subjectId: subject._id
    };
    new Chapter(newChapter)
      .save()
      .then(chapter => {
        Chapter.findOne({ SubjectTitle: req.body.SubjectTitle })
          .then(chapter => {
            Subject.findOneAndUpdate({ SubjectTitle: req.body.SubjectTitle }, { $push: { Chapters: chapter._id } }, { new: true })
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

//=================all the put routes start from here==================//
exports.editCourse = (req,res) => {
   Course.findOne({_id:req.params.courseid})
   .then((course) => {
    course.CourseTitle=req.body.CourseTitle, 
    course.Created_by = req.body.Created_by,
    course.Description = req.body.Description,
    course.Video_link = req.body.Video_link
    course.save()
    .then((editedcourse) => {
        res.status(200).json(editedcourse)
    })
    .catch((err) => {
       res.status(400).json(err)
    })
   })
   .catch((err) => {
         res.status(400).json(err)
   })
}

//==================edit route for subject=====================//
exports.editSubject = (req,res) => {
         Subject.findOne({_id:req.params.subjectid})
         .then((subject) => {
          subject.SubjectTitle = req.body.subjectTitle,
          subject.Description = req.body.Description, 
          subject.CourseTitle = req.body.CourseTitle
          subject.save()
          .then((editedsubject) => {
             res.status(200).json(editedsubject)
          })
          .catch((err) => {
             res.status(400).json(err)
          })
         })
         .catch((err) => {
            res.status(400).json(err)
         })
}

//==================edit chapter route=============//
exports.editChapter = (req,res) => {
        Chapter.findOne({_id:req.params.chapterid})
        .then((chapter) => {
          chapter.subjectTitle = req.body.subjectTitle,
          chapter.chapterTitle = req.body.chapterTitle,
          chapter.Description = req.body.Description
          chapter.save()
          .then((editedchapter) => {
               res.status(200).json(editedchapter)
          })
          .catch((err) => {
               res.status(400).json(err)
          })
        })
        .catch((err) => {
            res.status(400).json(err)
        })
}

//======================edit route for topic=================//
exports.editTopic = (req,res) => {
       Topic.findOne({_id:req.params.topicid})
       .then((topic) => {
        topic.topicTitle = req.body.topicTitle,
        topic.Description = req.body.Description,
        topic.chapterTitle = req.body.chapterTitle
        topic.save()
        .then((editedsubject) => {
            res.status(200).json(editedsubject)
        })
        .catch((err) => {
             res.status(400).json(err)
        })
       })
       .catch((err) => {
           res.status(400).json(err)
       })
}