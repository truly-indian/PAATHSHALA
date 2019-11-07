const router = require("express").Router();
const bodyParser = require('body-parser')
//import controllers for post routes
const { addCourse, addSubject, addChapter, addTopic, signUpCourseAdmin, loginCourseAdmin } = require("../controllers/Courses");

//import controllers for get routes
const {getCourses, getSubjects, getChapters, getTopics} = require('../controllers/Courses')

//import controllers for delete routes
const {deleteCourse, delteSubject, deleteChapter, deleteTopic} =require('../controllers/Courses')

//import controllers for edit routes
const {editCourse, editSubject, editChapter, editTopic, editPassword} =require('../controllers/Courses')
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
router.post("/addcourse", verifyToken, addCourse);

//---------------add subjects post router -----------------//
router.post("/addsubject", verifyToken, addSubject);

//----------add chapter post route--------------------//
router.post("/addchapter",verifyToken, addChapter);

//-----------------add topic post route --------------//
router.post("/addtopic",verifyToken, addTopic);

//-----------------all the get routes for courses starts from here------------------//
//--------get route for all the courses-------------------//
router.get('/courses',verifyToken, getCourses)

//------------get route for all the subjects----------------------//
router.get('/subjects',verifyToken, getSubjects)

//==============get route for all the chapters=================//
router.get('/chapters',verifyToken, getChapters)

//rotue for getting all the topics//
router.get('/topics',verifyToken, getTopics)

// all the delte routes for courses starts from here ---------//
//-------delete route for course
router.delete('/:courseid',verifyToken, deleteCourse)

// ----delete route for subject------------------//
router.delete('/:subjectid',verifyToken, delteSubject)

//--------delete route for chapter----------------//
router.delete('/:chapterid',verifyToken, deleteChapter)

//------------delete route for topic--------------//
router.delete('/:topicid',verifyToken, deleteTopic)

//=================update routes start from here===================//
router.put('/:courseid',verifyToken, editCourse)

//===========update route for subject====================//
router.put('/:subjectid',verifyToken, editSubject)

//===========edit route for chapter================//
router.put('/:chapterid',verifyToken, editChapter)

//edit route for topic==========//
router.put('/:topicid',verifyToken, editTopic)

//edit route for courseAdmin to change password//
router.put('/changepassword',verifyToken, editPassword)



module.exports = router;
