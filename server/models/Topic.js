// server/models/Topic.js
const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a topic title'],
    trim: true
  },
  course: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
    required: true
  },
  parentTopic: {
    type: mongoose.Schema.ObjectId,
    ref: 'Topic',
    default: null
  },
  order: {
    type: Number,
    required: true
  },
  contents: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Content'
  }],
  subTopics: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Topic'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Topic', topicSchema);