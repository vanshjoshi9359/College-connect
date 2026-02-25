const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getGroupMessages,
  createMessage,
  deleteMessage
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.get('/group/:groupId', getGroupMessages);
router.post(
  '/',
  protect,
  [
    body('groupId').notEmpty().withMessage('Group ID is required'),
    body('content').trim().notEmpty().withMessage('Message content is required')
  ],
  createMessage
);
router.delete('/:id', protect, deleteMessage);

module.exports = router;
