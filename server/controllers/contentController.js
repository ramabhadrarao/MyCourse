const Content = require('../models/Content');
const Topic = require('../models/Topic');
const Course = require('../models/Course');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// @desc    Create topic
// @route   POST /api/content/topics
// @access  Private
const createTopic = async (req, res) => {
  try {
    const { title, courseId, order } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is instructor
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'User not authorized'
      });
    }

    const topic = await Topic.create({
      title,
      course: courseId,
      order
    });

    // Add topic to course
    course.topics.push(topic._id);
    await course.save();

    res.status(201).json({
      success: true,
      topic
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create content
// @route   POST /api/content
// @access  Private
const createContent = async (req, res) => {
  try {
    const { title, type, data, topicId, order } = req.body;

    const topic = await Topic.findById(topicId).populate('course');
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    // Check if user is instructor
    if (topic.course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'User not authorized'
      });
    }

    const content = await Content.create({
      title,
      type,
      data,
      topic: topicId,
      order
    });

    // Add content to topic
    topic.contents.push(content._id);
    await topic.save();

    res.status(201).json({
      success: true,
      content
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Upload PDF
// @route   POST /api/content/upload-pdf
// @access  Private
const uploadPdf = (req, res) => {
  upload.single('pdf')(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    res.json({
      success: true,
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        url: `/uploads/${req.file.filename}`
      }
    });
  });
};

// @desc    Update content
// @route   PUT /api/content/:id
// @access  Private
const updateContent = async (req, res) => {
  try {
    let content = await Content.findById(req.params.id).populate({
      path: 'topic',
      populate: {
        path: 'course'
      }
    });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    // Check if user is instructor
    if (content.topic.course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'User not authorized'
      });
    }

    content = await Content.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      content
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete content
// @route   DELETE /api/content/:id
// @access  Private
const deleteContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id).populate({
      path: 'topic',
      populate: {
        path: 'course'
      }
    });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    // Check if user is instructor
    if (content.topic.course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'User not authorized'
      });
    }

    // Remove content from topic
    await Topic.findByIdAndUpdate(
      content.topic._id,
      { $pull: { contents: content._id } }
    );

    await Content.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Content removed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update topic
// @route   PUT /api/content/topics/:id
// @access  Private
const updateTopic = async (req, res) => {
  try {
    let topic = await Topic.findById(req.params.id).populate('course');

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    // Check if user is instructor
    if (topic.course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'User not authorized'
      });
    }

    topic = await Topic.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      topic
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete topic
// @route   DELETE /api/content/topics/:id
// @access  Private
const deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id).populate('course');

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    // Check if user is instructor
    if (topic.course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'User not authorized'
      });
    }

    // Delete all contents in this topic
    await Content.deleteMany({ topic: req.params.id });

    // Remove topic from course
    await Course.findByIdAndUpdate(
      topic.course._id,
      { $pull: { topics: topic._id } }
    );

    await Topic.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Topic and all its contents removed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createTopic,
  createContent,
  uploadPdf,
  updateContent,
  deleteContent,
  updateTopic,
  deleteTopic
};