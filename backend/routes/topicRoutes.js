const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { createTopic, getTopics, getTopic } = require('../controllers/topicController');
const { protect } = require('../middleware/auth');
const { optionalAuth } = require('../middleware/optionalAuth');

router.post(
  '/',
  protect,
  [
    body('name').trim().notEmpty().withMessage('Topic name is required'),
    body('description').trim().notEmpty().withMessage('Description is required')
  ],
  createTopic
);

router.get('/', optionalAuth, getTopics);
router.get('/:id', optionalAuth, getTopic);

module.exports = router;
