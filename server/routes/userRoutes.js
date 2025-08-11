// server/routes/userRoutes.js
const express = require('express');
const {
  getUsers,
  updateUserStatus,
  resetUserPassword,
  deleteUser
} = require('../controllers/userController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// All routes require authentication and admin privileges
router.use(auth);
router.use(adminAuth);

router.get('/', getUsers);
router.put('/:id/status', updateUserStatus);
router.put('/:id/reset-password', resetUserPassword);
router.delete('/:id', deleteUser);

module.exports = router;
