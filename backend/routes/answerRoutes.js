const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { createAnswer, getAnswersByQuestion } = require('../controllers/answerController');
const { protect } = require('../middleware/auth');
const { optionalAuth } = require('../middleware/optionalAuth');

router.post(
  '/',
  protect,
  [
    body('questionId').notEmpty().withMessage('Question ID is required'),
    body('content').trim().notEmpty().withMessage('Content is required')
  ],
  createAnswer
);

router.get('/question/:questionId', optionalAuth, getAnswersByQuestion);

module.exports = router;
