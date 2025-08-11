// server/models/Content.js
const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a content title'],
    trim: true
  },
  type: {
    type: String,
    enum: ['text', 'code', 'video', 'pdf', 'table', 'image', 'link'],
    required: true
  },
  data: {
    // Text content
    text: String,
    
    // Code content
    code: {
      language: String,
      code: String
    },
    
    // Video content
    video: {
      url: String,
      duration: Number,
      videoId: String
    },
    
    // PDF content
    pdf: {
      filename: String,
      originalName: String,
      size: Number,
      url: String
    },
    
    // Table content
    table: {
      headers: [String],
      rows: [[String]],
      style: {
        type: String,
        enum: ['default', 'striped', 'bordered'],
        default: 'default'
      }
    },
    
    // Image content
    image: {
      filename: String,
      originalName: String,
      size: Number,
      url: String,
      alt: String,
      caption: String
    },
    
    // External link content
    link: {
      url: String,
      title: String,
      description: String,
      openInNewTab: {
        type: Boolean,
        default: true
      }
    }
  },
  topic: {
    type: mongoose.Schema.ObjectId,
    ref: 'Topic',
    required: true
  },
  order: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Content', contentSchema);