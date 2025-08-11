// server/routes/contentRoutes.js
const express = require('express');
const {
  createTopic,
  createContent,
  uploadFile,
  updateContent,
  deleteContent,
  updateTopic,
  deleteTopic,
  getTopic
} = require('../controllers/contentController');
const auth = require('../middleware/auth');

const router = express.Router();

// Topic routes
router.post('/topics', auth, createTopic);
router.get('/topics/:id', auth, getTopic);
router.put('/topics/:id', auth, updateTopic);
router.delete('/topics/:id', auth, deleteTopic);

// Content routes
router.post('/', auth, createContent);
router.put('/:id', auth, updateContent);
router.delete('/:id', auth, deleteContent);

// File upload route
router.post('/upload', auth, uploadFile);

module.exports = router;