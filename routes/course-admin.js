const router = require("express").Router();
const bodyParser = require('body-parser')
//import controllers for post routes
const { addCourse, addSubject, addChapter, addTopic, signUpCourseAdmin, loginCourseAdmin } = require("../controllers/Courses");

//import controllers for get routes
const {getCourses, getSubjects, getChapters, getTopics} = require('../controllers/Courses')

//import controllers for delete routes
const {deleteCourse, delteSubject, deleteChapter, deleteTopic} =require('../controllers/Courses')

//import controllers for edit routes
const {editCourse, editSubject, editChapter, editTopic} =require('../controllers/Courses')
/* important please use camelCase notation for variables and attributes should have First letter in uppercase  */
/* okk i will use camelCase from now just saw this message*/


//verifyToken utility
const verifyToken = require('../utils/verifyToken')
const localStorage = require('../utils/localStorage')

router.use(bodyParser.urlencoded({extended: false}))
router.use(bodyParser.json())
//----------post route for course admin------------//
router.post('/signup', signUpCourseAdmin)

//=================post route for login CourseAdmin==================//
router.post('/login', loginCourseAdmin)

// ====================get route for logging course admin out=================//
router.get('/logout', (req,res) => {
 localStorage.removeItem('loginToken')
 res.status(200)
 .json({
     message: 'Logged Out successfully'
 })
})
//-----------------add course post route ----------//
router.post("/addcourse", addCourse);

//---------------add subjects post router -----------------//
router.post("/addsubject", addSubject);

//----------add chapter post route--------------------//
router.post("/addchapter", addChapter);

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

//=================update routes start from here===================//
router.put('/:courseid', editCourse)

//===========update route for subject====================//
router.put('/:subjectid', editSubject)

//===========edit route for chapter================//
router.put('/:chapterid', editChapter)

//edit route for topic==========//
router.put('/:topicid', editTopic)




module.exports = router;
