const router = require("express").Router();

//import controllers for post routes
const { addCourse, addSubject, addChapter, addTopic } = require("../controllers/Courses");

//import controllers for get routes
const {getCourses, getSubjects, getChapters, getTopics} = require('../controllers/Courses')

//import controllers for delete routes
const {deleteCourse, delteSubject, deleteChapter, deleteTopic} =require('../controllers/Courses')
/* important please use camelCase notation for variables and attributes should have First letter in uppercase  */
/* okk i will use camelCase from now just saw this message*/

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
router.get('/topics', getTopics)

// all the delte routes for courses starts from here ---------//
//-------delete route for course
router.delete('/:courseid', deleteCourse)

// ----delete route for subject------------------//
router.delete('/:subjectid', delteSubject)

//--------delete route for chapter----------------//
router.delete('/:chapterid', deleteChapter)

//------------delete route for topic--------------//
router.delete('/:topicid', deleteTopic)


module.exports = router;
