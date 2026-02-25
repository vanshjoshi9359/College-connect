const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { createQuestion, getQuestionsByTopic, getQuestion } = require('../controllers/questionController');
const { protect } = require('../middleware/auth');
const { optionalAuth } = require('../middleware/optionalAuth');

router.post(
  '/',
  protect,
  [
    body('topicId').notEmpty().withMessage('Topic ID is required'),
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('problemDescription').trim().notEmpty().withMessage('Problem description is required'),
    body('attemptedSolutions').trim().notEmpty().withMessage('Attempted solutions is required'),
    body('failurePoint').trim().notEmpty().withMessage('Failure point is required'),
    body('solutionNeeded').trim().notEmpty().withMessage('Solution needed is required')
  ],
  createQuestion
);

router.get('/topic/:topicId', optionalAuth, getQuestionsByTopic);
router.get('/:id', optionalAuth, getQuestion);

module.exports = router;
