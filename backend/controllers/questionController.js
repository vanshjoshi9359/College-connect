const Question = require('../models/Question');
const Topic = require('../models/Topic');
const Vote = require('../models/Vote');
const { validationResult } = require('express-validator');

// @desc    Create a new question
// @route   POST /api/questions
// @access  Private
const createQuestion = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      topicId, 
      title, 
      problemDescription,
      attemptedSolutions,
      failurePoint,
      solutionNeeded,
      additionalDetails 
    } = req.body;

    // Verify topic exists
    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    // Create combined description for backward compatibility and search
    const combinedDescription = `
Problem: ${problemDescription}

What I've Tried: ${attemptedSolutions}

Where I Failed: ${failurePoint}

Solution Needed: ${solutionNeeded}

${additionalDetails ? `Additional Details: ${additionalDetails}` : ''}
    `.trim();

    const question = await Question.create({
      topicId,
      title: title.trim(),
      problemDescription: problemDescription.trim(),
      attemptedSolutions: attemptedSolutions.trim(),
      failurePoint: failurePoint.trim(),
      solutionNeeded: solutionNeeded.trim(),
      additionalDetails: additionalDetails?.trim() || '',
      description: combinedDescription,
      authorId: req.user._id
    });

    const populatedQuestion = await Question.findById(question._id)
      .populate('authorId', 'name email avatar')
      .populate('topicId', 'name');

    res.status(201).json(populatedQuestion);
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get questions by topic
// @route   GET /api/questions/topic/:topicId
// @access  Public
const getQuestionsByTopic = async (req, res) => {
  try {
    const questions = await Question.find({ topicId: req.params.topicId })
      .populate('authorId', 'name email avatar')
      .populate('topicId', 'name')
      .lean();

    // Sort by score (upvotes - downvotes), then by newest
    questions.sort((a, b) => {
      const scoreA = a.upvotes - a.downvotes;
      const scoreB = b.upvotes - b.downvotes;
      if (scoreB !== scoreA) return scoreB - scoreA;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // Add user vote info if authenticated
    if (req.user) {
      const questionIds = questions.map(q => q._id);
      const userVotes = await Vote.find({
        userId: req.user._id,
        targetId: { $in: questionIds },
        targetType: 'Question'
      });

      const voteMap = {};
      userVotes.forEach(vote => {
        voteMap[vote.targetId.toString()] = vote.voteType;
      });

      questions.forEach(question => {
        question.userVote = voteMap[question._id.toString()] || null;
      });
    }

    res.json(questions);
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single question
// @route   GET /api/questions/:id
// @access  Public
const getQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('authorId', 'name email avatar')
      .populate('topicId', 'name')
      .lean();

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Add user vote info if authenticated
    if (req.user) {
      const userVote = await Vote.findOne({
        userId: req.user._id,
        targetId: question._id,
        targetType: 'Question'
      });
      question.userVote = userVote ? userVote.voteType : null;
    }

    res.json(question);
  } catch (error) {
    console.error('Get question error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createQuestion,
  getQuestionsByTopic,
  getQuestion
};
