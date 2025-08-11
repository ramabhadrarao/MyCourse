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
  order: {
    type: Number,
    required: true
  },
  contents: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Content'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Topic', topicSchema);