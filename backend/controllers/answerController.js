const Answer = require('../models/Answer');
const Question = require('../models/Question');
const Vote = require('../models/Vote');
const { validationResult } = require('express-validator');

// @desc    Create a new answer
// @route   POST /api/answers
// @access  Private
const createAnswer = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { questionId, content } = req.body;

    // Verify question exists
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const answer = await Answer.create({
      questionId,
      content: content.trim(),
      authorId: req.user._id
    });

    const populatedAnswer = await Answer.findById(answer._id)
      .populate('authorId', 'name email avatar');

    res.status(201).json(populatedAnswer);
  } catch (error) {
    console.error('Create answer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get answers by question
// @route   GET /api/answers/question/:questionId
// @access  Public
const getAnswersByQuestion = async (req, res) => {
  try {
    const answers = await Answer.find({ questionId: req.params.questionId })
      .populate('authorId', 'name email avatar')
      .lean();

    // Sort by score (upvotes - downvotes), then by newest
    answers.sort((a, b) => {
      const scoreA = a.upvotes - a.downvotes;
      const scoreB = b.upvotes - b.downvotes;
      if (scoreB !== scoreA) return scoreB - scoreA;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // Add user vote info if authenticated
    if (req.user) {
      const answerIds = answers.map(a => a._id);
      const userVotes = await Vote.find({
        userId: req.user._id,
        targetId: { $in: answerIds },
        targetType: 'Answer'
      });

      const voteMap = {};
      userVotes.forEach(vote => {
        voteMap[vote.targetId.toString()] = vote.voteType;
      });

      answers.forEach(answer => {
        answer.userVote = voteMap[answer._id.toString()] || null;
      });
    }

    res.json(answers);
  } catch (error) {
    console.error('Get answers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createAnswer,
  getAnswersByQuestion
};
