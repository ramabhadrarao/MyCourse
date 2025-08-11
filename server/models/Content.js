const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a content title'],
    trim: true
  },
  type: {
    type: String,
    enum: ['text', 'code', 'video', 'pdf'],
    required: true
  },
  data: {
    text: String,
    code: {
      language: String,
      code: String
    },
    video: {
      url: String,
      duration: Number
    },
    pdf: {
      filename: String,
      originalName: String,
      size: Number
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