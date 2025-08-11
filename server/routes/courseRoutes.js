const express = require('express');
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  getInstructorCourses
} = require('../controllers/courseController');
const auth = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getCourses)
  .post(auth, createCourse);

router.get('/instructor/my', auth, getInstructorCourses);

router.route('/:id')
  .get(getCourse)
  .put(auth, updateCourse)
  .delete(auth, deleteCourse);

router.post('/:id/enroll', auth, enrollCourse);

module.exports = router;