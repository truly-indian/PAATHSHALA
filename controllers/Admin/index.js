const bcrypt = require("bcryptjs");
const Admin = require("../../models/admin").model;
const kdSubject = require("../../models/kdsubject").model;
const kdChapter = require("../../models/kdchapter").model;
const kdTopic = require("../../models/kdtopic").model;
const kdPage = require("../../models/kdpage").model;
const kdSection = require("../../models/kdsection").model;
const jwt = require("jsonwebtoken"); 
//when all the apis are created then we need to implemet verify token

/*--------------joi validation schema-----------*/
const loginSchema = require("../../joi_schema/login");
const { signUpAdminSchema } = require("../../joi_schema/signup");

const localStorage = require("../../utils/localStorage");

//configs
const jwtSecret = require("../../config/jwtSecret");

//-------------signup controller--------------------//

exports.signUpAdmin = async (req, res, next) => {
  const adminExists = await Admin.findOne({ email: req.body.email });

  if (adminExists) {
    return res.status(400).json({ message: "admin with this email already registered" });
  } else {
    const { error, value } = signUpAdminSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(value.password, salt);

      const registeredAdminUser = new Admin({ ...value, password: hashedPassword });

      try {
        const savedAdminUser = await registeredAdminUser.save();
        res.status(200).json({ ...savedAdminUser._doc, message: "Admin Signup Success", status: 200 });
      } catch (err) {
        if (err) throw err;
      }
    }
  }
};

//-----------login controller-------------//

exports.loginAdmin = async (req, res, next) => {
  const { error, value } = loginSchema.validate(req.body);

  if (error) {
    res.status(400).json({ message: error.details[0].message });
  } else {
    let adminObject = {};
    Admin.findOne({ email: value.email })
      .then(registeredAdmin => {
        if (registeredAdmin) {
          adminObject = registeredAdmin;
          return bcrypt.compare(value.password, registeredAdmin.password);
        }
      })
      .then(loginStatus => {
        if (loginStatus) {
          jwt.sign({ id: adminObject._id }, jwtSecret.jwtKey, (err, token) => {
            localStorage.setItem("loginToken", token);
            // res.header("access-token", token);
            res.status(200).json({
              "accessToken": token,
              registeredEmail: adminObject.email,
              message: "Login Success",
              status: 200
            });
          });
        } else {
          res.status(401).json({ msg: "Login Failed", status: 401 });
        }
      })
      .catch(err => console.log(err.message));
  }
};

//-----add subject function-----------//
exports.addSubject = (req, res) => {
  console.log(req.body)
  const authData = req.authData;
  if (authData) {
    console.log(authData);
    const { subjectTitle, subjectDescription } = req.body;
    console.log(subjectTitle)
    const newSubject = {
      subject_title: subjectTitle,
      description: subjectDescription
    }
    new kdSubject(newSubject)
      .save()
      .then(newSubject => {
        console.log(newSubject)
        res.status(200).json({newSubject,message:'sucess!!'})
      })
      .catch(err => {
        console.log(err);
        res.status(400).json({ ...err, message: "error" });
      });
  }else {
    res.status(401).json({message: 'Unauthorized'})
  }
}
//-----------add chapter function---------------//
exports.addChapter = (req, res) => {
  //console.log(req.body)
  const authData = req.authData
  if(authData) {
    console.log(authData)
    kdSubject.findOne({ _id: req.params.subjectId }).then(subject => {
      if (!subject) {
        res.status(404).json({ err: "No Subject found!!!" });
      }
      const newChapter = {
        subject_title: req.body.subjectTitle,
        chapterTitle: req.body.chapterTitle,
        description: req.body.chapterDescription,
        subject_id: subject._id
      };
      new kdChapter(newChapter)
        .save()
        .then(chapter => {
          kdChapter.findOne({ subject_id: req.params.subjectId })
            .then(chapter => {
              console.log(chapter._id)
              kdSubject.findOneAndUpdate({ _id: req.body.subjectId })
                .then((kdsub) => {
                  console.log(kdsub)
                  kdsub.chapters.unshift(chapter._id)
                  console.log(kdsub)
                  kdsub.save().then(() => res.json({message:'sucess!!'})).catch(err => console.log(err))
                })
                .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    });
  }else {
    res.status(401).json({message:'Unauthorized!!'})
  }
  
};

//------------add topics function---------------//
exports.addTopic = (req, res) => {
  //console.log(req.body.topicTitle);
  const authData = req.authData
  if(authData) {
    kdChapter.findOne({ _id: req.params.chapterId }).then(chapter => {
      if (!chapter) {
        res.status(404).json({ err: "No Chapter found" });
      }
      const newTopic = {
        title: req.body.chapterTitle,
        topic_title: req.body.topicTitle,
        description: req.body.topicDescription,
        chapter_id: chapter._id
      };
      new kdTopic(newTopic)
        .save()
        .then(topic => {
          kdTopic.findOne({ chapter_id: req.params.chapterId })
            .then(topic => {
              kdChapter.findOneAndUpdate({ _id: req.params.chapterId })
                .then((kdchap) => {
                  kdchap.topics.unshift(topic._id)
                //  console.log(kdsub)
                  kdchap.save().then(() => res.json({message:'sucess!!'})).catch(err => console.log(err))
                })
                .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    })
  }else {
    res.status(401).json({message:'unauthorized!!'})
  }
  
};

//-----------------add pages function--------------------//
exports.addPage = (req, res) => {
  //console.log(req.body.topicTitle);
  const authData = req.authData
  if(authData) {
    kdTopic.findOne({ _id: req.params.topicId}).then(topics => {
      if (!topics) {
        res.status(404).json({ err: "No Chapter found" });
      }
      
      const newPage = {
        page_type: req.body.page_type,
        topic_title: req.body.topicTitle,
        topic_id: topics._id,
        page_title: req.body.page_title
      };
      console.log(newPage)
      new kdPage(newPage)
        .save()
        .then(page => {
          kdPage.findOne({ topic_id: req.params.topicId })
            .then(page => {
              kdTopic.findOneAndUpdate({ _id: req.params.topicId })
                .then((kdtop) => {
                  kdtop.pages.unshift(page._id)
                  //  console.log(kdsub)
                    kdtop.save().then(() => res.json({message:'sucess!!'})).catch(err => console.log(err))
                })
                .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    })
  }else {
    res.status(401).json({message: 'Unauthorized!!'})
  }
  
};

//--------------------add sections function---------------//
exports.addSection = (req, res) => {
  
  const authData = req.authData
  if(authData) {
    kdPage.findOne({page_title:req.body.page_title})
    .then((section) => {
           if(!section) {
             res.status(404).json({message: 'not found!!'})
           }
        const newSection = {
          section_title: req.body.section_title,
          page_title: req.body.page_title,
        }
        if(req.body.section_type == 'videos') {
          newSection.section_name = req.body.section_type
          newSection.videos = req.body.videoLinks
        }
        if(req.body.section_type === 'theory_image') {
           newSection.section_name = req.body.section_type
           newSection.theory_img = req.body.img_path
        }
        if(req.body.section_type === 'theoryrichtext') {
             console.log(req.body.text_data)
             newSection.section_name = req.body.section_type
             newSection.theory_richtext = req.body.text_data
        }
        if(req.body.section_type === 'quiz') {
           //needed to implemented correctly//
               newSection.section_name = req.body.section_type
               newSection.quiz.questionsimg =  req.body.questionsimg
               newSection.quiz.answerimg = req.body.answerimg
               newSection.quiz.answerkey = req.body.answerkey
               newSection.quiz.videoSolutionURL = req.body.videoSolutionURL
        }
        if(req.body.section_type === 'assignment') {
          //needed to be implemented correctly//
             newSection.section_name = req.body.section_type
             newSection.assignment.questionsimg = req.body.questionsimg
             newSection.assignment.answerimg = req.body.answerimg
             newSection.assignment.videoSolutionURL = req.body.videoSolutionURL
        }
        console.log(newSection)
        new kdSection(newSection).save()
        .then((section) => {
           kdSection.findOne({section_title: req.body.section_title})
           .then((section) => {
              kdPage.findOneAndUpdate({page_title: req.body.page_title}, { $push: { Sections: section._id } }, { new: true })
              .then(data => res.json(data))
               .catch(err => console.log(err));
           })
           .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    })
    .catch((err) => {
             console.log(err)
    })
  }else {
    res.status(401).json({message: 'Unauthorized!!'})
  }
  
};

//----------------get all subjects in database--------------//
exports.getSubjects = (req, res) => {
  const authData = req.authData
  if(authData) {
    kdSubject.find()
    .then(kdsubjects => {
      res.status(200).json(kdsubjects);
    })
    .catch(err => {
      res.status(400).json(err);
    });
  }
 else {
   res.status(401).json({message:'unauthorized!!'})
 }
};
//----------------get all chapters in dataabse--------------//
exports.getChapters = (req, res) => {
  const authData = req.authData
  if(authData) {
    console.log(req.params.subjectId)
    kdChapter.find({subject_id: req.params.subjectId})
    .then(chapters => {
      res.status(200).json(chapters);
    })
    .catch(err => {
      res.status(400).json(err);
    });
  }
  else {
    res.status(401).json({message:'unauthorized!!'})
  }
};
//---------------get all topics in the database------------//
exports.getTopics = (req, res) => {
  const authData = req.authData
  if(authData) {
    kdTopic.find({ chapter_id: req.params.chapterId })
    .then(topics => {
      res.status(200).json(topics);
    })
    .catch(err => {
      res.status(400).json(err);
    });
  }
 else {
   res.status(401).json({message: 'Unauthorized!!'})
 }
};

//---------------get all pages of a particular topics in the database------------//
exports.getPages = (req, res) => {
  const authData = req.authData
  if(authData) {
    kdPage.find({ topic_id: req.params.topicId })
    .then(pages => {
      res.status(200).json(pages);
    })
    .catch(err => {
      res.status(400).json(err);
    });
  }
 else {
   res.status(401).json({message: 'Unauthorized!!'})
 }
};



//-------------all the delete routes start from here---------------//
//=---------------delete subject route-------------------------//
exports.deleteSubject = (req, res) => {
  const authData = req.authData
  if(authData) {
    kdSubject.remove({ _id: req.params.subjectid })
    .then(() => {
      res.status(200).json("Subject deleted successfully!!");
    })
    .catch(err => {
      res.status(400).json(err);
    });
  }
 else {
   res.status(401).json({message: 'unauthorized!!'})
 }
};
//-----------------//delete chapter route------------------------//
exports.deleteChapter = (req, res) => {
  const authData = req.authData
  if(authData) {
    kdChapter.remove({ _id: req.params.chapterid })
    .then(() => {
      res.status(200).json("chapter deleted sucessfully!!");
    })
    .catch(err => {
      res.status(400).json(err);
    });
  }
 else {
   res.status(401).json({message: 'unauthorized!!'})
 }
};
//----------------------delete topic route--------------------------//
exports.deleteTopic = (req, res) => {
  const authData = req.authData
  if(authData) {
    kdTopic.remove({ _id: req.params.topicid })
    .then(() => {
      res.status(200).json("topic deleted sucessfully!!");
    })
    .catch(err => {
      res.status(400).json(err);
    });
  }
  else {
    res.status(401).json({message: 'unauthorized!!'})
  }
};
//----------------delete page route--------------------------------//
exports.deletePage = (req, res) => {
  const authData = req.authData
  if(authData) {
    kdPage.remove({ _id: req.params.pageid })
    .then(() => {
      res.status(200).json("page is deleted sucessfully");
    })
    .catch(err => {
      res.status(400).json(err);
    });
  }
 else {
   res.status(401).json({message: 'unauthorized!!'})
 }
};
//---------------delete section route--------------------------------//
exports.deleteSection = (req, res) => {
  const authData = req.authData
  if(authData) {
    kdSection.remove({ _id: req.params.sectionid }).then(() => {
      res.status(200).json("section deleted sucessfully!!");
    })
    .catch((err) => {
        console.log(err)
        res.status(400).json({message:'error occured'})
    })
  }
  else {
    res.status(401).json({message: 'unauthorized!!'})
  }
};

//==========all the updates routes start from here================//

//---------------route for edit subject--------------------//
exports.editSubject = (req, res) => {
  const authData = req.authData
  if(authData) {
    kdSubject.findOne({ _id: req.params.subjectid })
    .then(subject => {
      (subject.subject_title = req.body.subjectTitle), (subject.description = req.body.subjectDescription);
      subject
        .save()
        .then(subj => {
          res.status(200).json(subj);
        })
        .catch(() => {
          res.status(400).json(err);
        });
    })
    .catch(err => {
      res.status(404).json(err);
    });
  }
  else {
    res.status(401).json({message:'unauthorized!!'})
  }
};

//--------------route for edit chapter------------------//
exports.editChapter = (req, res) => {
 // console.log(req.body);
 const authData = req.authData
 if(authData) {
  kdChapter.findOne({ _id: req.params.chapterid })
  .then(chapter => {
    (chapter.subject_title = req.body.subjectTitle),
      (chapter.chapterTitle = req.body.chapterTitle),
      (chapter.description = req.body.chapterDescription),
      chapter
        .save()
        .then(editedchapter => {
          res.status(200).json(editedchapter);
        })
        .catch(err => {
          res.status(400).json(err);
        });
  })
  .catch(err => {
    res.status(400).json(err);
  });
 }
 else {
   res.status(401).json({message:'unauthorized!!'})
 }
};

//==============route for edit page===================//
exports.editPage = (req, res) => {
  const authData = req.authData
  if(authData) {
    kdPage.findOne({ _id: req.params.pageid })
    .then(page => {
      (page.page_type = req.body.page_type), (page.topic_title = req.body.topicTitle), (page.page_title = req.body.page_title);
      page
        .save()
        .then(editedpage => {
          res.status(200).json(editedpage);
        })
        .catch(err => {
          res.status(400).json(err);
        });
    })
    .catch(err => {
      res.status(400).json(err);
    })
    .catch(err => {
      res.status(400).json(err);
    });
  }
 else {
   res.status(401).json({message:'unauthorized!!'})
 }
};

//-------------edit route for topic ----------------//
exports.editTopic = (req, res) => {
  const authData = req.authData
  if(authData) {
    kdTopic.findOne({ _id: req.params.topicid })
    .then(topic => {
      (topic.title = req.body.chapterTitle),
        (topic.topic_title = req.body.topicTitle),
        (topic.description = req.body.topicDescription),
        topic.save()
          .then(editedTopic => {
           // console.log(editedTopic)
            res.status(200).json(editedTopic);
          })
          .catch(err => {
            res.status(400).json(err);
          });
    })
    .catch(err => {
      res.status(400).json(err);
    });
  }
 else {
   res.status(401).json({message: 'unauthorized!!'})
 }
};

//=================edit route for section-----------------//
exports.editSection = (req, res) => {
  const authData = req.authData
  if(authData) {
    kdSection.findOne({ _id: req.params.sectionid })
    .then((section) => {
      section.section_title =  req.body.section_title
      section.page_title = req.body.page_title
      if(req.body.section_type === 'videos') {
        section.section_name = req.body.section_type
        section.videos = req.body.videoLinks
      }
      if(req.body.section_type === 'theory_image') {
        section.section_name = req.body.section_type
        section.theory_img = req.body.img_path
     }
     if(section_type === 'theoryrichtext') {
      section.section_name = req.body.section_type
      section.theoryrich_text = req.body.text_data
     }
     if(section_type === 'quiz') {
       //needed to be implemented the below code is not working
      section.section_type.quiz.section_name = req.body.section_type
      section.section_type.quiz.questionsimg =  req.body.questionsimg
      section.section_type.quiz.ansimg = req.body.answerimg
      section.section_type.quiz.answerkey = req.body.answerkey
      section.section_type.quiz.videoSolution.URL = req.body.videoSolutionURL
     }
     if(section_type === 'assignment') {
       //needed to be implemented the below code is not working
      section.section_type.assignment.section_name = req.body.section_type
      section.section_type.assignment.questionsimg = req.body.questionsimg
      section.section_type.assignment.ansimg = req.body.answerimg
      section.section_type.assignment.videoSolution.URL = req.body.videoSolutionURL
      }
      section.save()
      .then((editedSection) => {
          res.status(200).json(editedSection)
      })
      .catch((err) => {
         console.log(err)
         res.status(400).json({message:'error occured!'})
      })
    })
    .catch((err) => {
          console.log(err)
          res.status(400).json({message:'error occured!!'})
    })
  }
 else {
   res.status(401).json({message:'unauthorized!!'})
 }
}
//---------------route for change password---------------//
exports.editPassword = (req,res,next) => {
     Admin.findOne({email: req.body.email})
     .then((admin) => {
            if(!admin) {
              return res.status(404).json({message: 'No user found!!'})
            }
             bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                admin.password = hashedPassword
                admin.save()
                .then(() => res.status(200).json({message:'password changed sucessfully'}))
             })
           
     })
     .catch((err) => {
        console.log(err)
        res.status(400).json({message: 'error!!'})
     })
}

///all the crud functionality for the admin end here///