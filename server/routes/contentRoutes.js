const express = require('express');
const {
  createTopic,
  createContent,
  uploadPdf,
  updateContent,
  deleteContent,
  updateTopic,
  deleteTopic
} = require('../controllers/contentController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/topics', auth, createTopic);
router.put('/topics/:id', auth, updateTopic);
router.delete('/topics/:id', auth, deleteTopic);

router.post('/', auth, createContent);
router.put('/:id', auth, updateContent);
router.delete('/:id', auth, deleteContent);

router.post('/upload-pdf', auth, uploadPdf);

module.exports = router;