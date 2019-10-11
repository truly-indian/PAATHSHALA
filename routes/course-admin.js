const router = require("express").Router();

//import controllers for post routes
const { addCourse, addSubject, addChapter, addTopic } = require("../controllers/Courses");

//import controllers for get routes
const {getCourses, getSubjects, getChapters, getTopics} = require('../controllers/Courses')
/* important please use camelCase notation for variables and attributes should have First letter in uppercase  */

//-----------------add course post route ----------//
router.post("/addcourse", addCourse);

//---------------add subjects post router -----------------//
router.post("/addsubject", addSubject);

//----------add chapter post route--------------------//
router.get("/addchapter", addChapter);

//-----------------add topic post route --------------//
router.post("/addtopic", addTopic);

//-----------------all the get routes for courses starts from here------------------//
//--------get route for all the courses-------------------//
router.get('/courses', getCourses)

//------------get route for all the subjects----------------------//
router.get('/subjects', getSubjects)

//==============get route for all the chapters=================//
router.get('/chapters', getChapters)

//rotue for getting all the topics//
router.get('/gettopics', getTopics)

module.exports = router;
