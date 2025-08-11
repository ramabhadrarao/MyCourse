// server/controllers/contentController.js
const Content = require('../models/Content');
const Topic = require('../models/Topic');
const Course = require('../models/Course');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Allow PDFs and images
  const allowedMimes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and image files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: fileFilter
});

// @desc    Create topic (with support for subtopics)
// @route   POST /api/content/topics
// @access  Private
const createTopic = async (req, res) => {
  try {
    const { title, courseId, parentTopicId, order } = req.body;

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

    const topicData = {
      title,
      course: courseId,
      order: order || 1
    };

    // If parentTopicId is provided, this is a subtopic
    if (parentTopicId) {
      const parentTopic = await Topic.findById(parentTopicId);
      if (!parentTopic) {
        return res.status(404).json({
          success: false,
          message: 'Parent topic not found'
        });
      }
      topicData.parentTopic = parentTopicId;
    }

    const topic = await Topic.create(topicData);

    // Add topic to course or parent topic
    if (parentTopicId) {
      await Topic.findByIdAndUpdate(
        parentTopicId,
        { $push: { subTopics: topic._id } }
      );
    } else {
      course.topics.push(topic._id);
      await course.save();
    }

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

    // Structure data based on content type
    let contentData = {};
    switch (type) {
      case 'text':
        contentData.text = data.text || '';
        break;
      
      case 'code':
        contentData.code = {
          language: data.language || 'javascript',
          code: data.code || ''
        };
        break;
      
      case 'video':
        contentData.video = {
          url: data.url || '',
          duration: data.duration || 0,
          videoId: data.videoId || ''
        };
        break;
      
      case 'pdf':
        contentData.pdf = {
          filename: data.filename || '',
          originalName: data.originalName || '',
          size: data.size || 0,
          url: data.url || ''
        };
        break;
      
      case 'table':
        contentData.table = {
          headers: data.headers || ['Column 1', 'Column 2'],
          rows: data.rows || [['', '']],
          style: data.style || 'default'
        };
        break;
      
      case 'image':
        contentData.image = {
          filename: data.filename || '',
          originalName: data.originalName || '',
          size: data.size || 0,
          url: data.url || '',
          alt: data.alt || '',
          caption: data.caption || ''
        };
        break;
      
      case 'link':
        contentData.link = {
          url: data.url || '',
          title: data.title || '',
          description: data.description || '',
          openInNewTab: data.openInNewTab !== false
        };
        break;
      
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid content type'
        });
    }

    const content = await Content.create({
      title,
      type,
      data: contentData,
      topic: topicId,
      order: order || 1
    });

    // Add content to topic
    topic.contents.push(content._id);
    await topic.save();

    // Populate the content before sending response
    const populatedContent = await Content.findById(content._id);

    res.status(201).json({
      success: true,
      content: populatedContent
    });
  } catch (error) {
    console.error('Create content error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
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

    // Structure data based on content type
    if (req.body.data && req.body.type) {
      let contentData = {};
      
      switch (req.body.type) {
        case 'text':
          contentData.text = req.body.data.text || '';
          break;
        
        case 'code':
          contentData.code = {
            language: req.body.data.language || 'javascript',
            code: req.body.data.code || ''
          };
          break;
        
        case 'video':
          contentData.video = {
            url: req.body.data.url || '',
            duration: req.body.data.duration || 0,
            videoId: req.body.data.videoId || ''
          };
          break;
        
        case 'pdf':
          contentData.pdf = {
            filename: req.body.data.filename || content.data.pdf?.filename || '',
            originalName: req.body.data.originalName || content.data.pdf?.originalName || '',
            size: req.body.data.size || content.data.pdf?.size || 0,
            url: req.body.data.url || content.data.pdf?.url || ''
          };
          break;
        
        case 'table':
          contentData.table = {
            headers: req.body.data.headers || ['Column 1', 'Column 2'],
            rows: req.body.data.rows || [['', '']],
            style: req.body.data.style || 'default'
          };
          break;
        
        case 'image':
          contentData.image = {
            filename: req.body.data.filename || content.data.image?.filename || '',
            originalName: req.body.data.originalName || content.data.image?.originalName || '',
            size: req.body.data.size || content.data.image?.size || 0,
            url: req.body.data.url || content.data.image?.url || '',
            alt: req.body.data.alt || '',
            caption: req.body.data.caption || ''
          };
          break;
        
        case 'link':
          contentData.link = {
            url: req.body.data.url || '',
            title: req.body.data.title || '',
            description: req.body.data.description || '',
            openInNewTab: req.body.data.openInNewTab !== false
          };
          break;
      }
      
      req.body.data = contentData;
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
    console.error('Update content error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Upload file (PDF or Image)
// @route   POST /api/content/upload
// @access  Private
const uploadFile = (req, res) => {
  upload.single('file')(req, res, (err) => {
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

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    res.json({
      success: true,
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        url: fileUrl,
        mimetype: req.file.mimetype
      }
    });
  });
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

    // Delete associated files if any
    if (content.type === 'pdf' && content.data.pdf?.filename) {
      const filePath = path.join('uploads', content.data.pdf.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    if (content.type === 'image' && content.data.image?.filename) {
      const filePath = path.join('uploads', content.data.image.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

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
    const contents = await Content.find({ topic: req.params.id });
    for (const content of contents) {
      // Delete associated files
      if (content.type === 'pdf' && content.data.pdf?.filename) {
        const filePath = path.join('uploads', content.data.pdf.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      if (content.type === 'image' && content.data.image?.filename) {
        const filePath = path.join('uploads', content.data.image.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }
    await Content.deleteMany({ topic: req.params.id });

    // Delete all subtopics recursively
    const deleteSubtopicsRecursively = async (topicId) => {
      const subtopics = await Topic.find({ parentTopic: topicId });
      for (const subtopic of subtopics) {
        await deleteSubtopicsRecursively(subtopic._id);
        await Topic.findByIdAndDelete(subtopic._id);
      }
    };
    
    await deleteSubtopicsRecursively(req.params.id);

    // Remove topic from course or parent topic
    if (topic.parentTopic) {
      await Topic.findByIdAndUpdate(
        topic.parentTopic,
        { $pull: { subTopics: topic._id } }
      );
    } else {
      await Course.findByIdAndUpdate(
        topic.course._id,
        { $pull: { topics: topic._id } }
      );
    }

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

// @desc    Get topic with subtopics
// @route   GET /api/content/topics/:id
// @access  Private
const getTopic = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id)
      .populate('contents')
      .populate('subTopics');

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

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

module.exports = {
  createTopic,
  createContent,
  uploadFile,
  updateContent,
  deleteContent,
  updateTopic,
  deleteTopic,
  getTopic
};