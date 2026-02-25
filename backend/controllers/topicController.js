const Topic = require('../models/Topic');
const Vote = require('../models/Vote');
const { validationResult } = require('express-validator');

// @desc    Create a new topic
// @route   POST /api/topics
// @access  Private
const createTopic = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;

    // Check if topic already exists
    const existingTopic = await Topic.findOne({ name: name.trim() });
    if (existingTopic) {
      return res.status(400).json({ message: 'Topic already exists' });
    }

    const topic = await Topic.create({
      name: name.trim(),
      description: description.trim(),
      createdBy: req.user._id
    });

    const populatedTopic = await Topic.findById(topic._id).populate('createdBy', 'name email avatar');

    res.status(201).json(populatedTopic);
  } catch (error) {
    console.error('Create topic error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all topics
// @route   GET /api/topics
// @access  Public
const getTopics = async (req, res) => {
  try {
    let topics = await Topic.find()
      .populate('createdBy', 'name email avatar')
      .lean();

    // Sort by score (upvotes - downvotes), then by newest
    topics.sort((a, b) => {
      const scoreA = a.upvotes - a.downvotes;
      const scoreB = b.upvotes - b.downvotes;
      if (scoreB !== scoreA) return scoreB - scoreA;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // Add user vote info if authenticated
    if (req.user) {
      const topicIds = topics.map(t => t._id);
      const userVotes = await Vote.find({
        userId: req.user._id,
        targetId: { $in: topicIds },
        targetType: 'Topic'
      });

      const voteMap = {};
      userVotes.forEach(vote => {
        voteMap[vote.targetId.toString()] = vote.voteType;
      });

      topics.forEach(topic => {
        topic.userVote = voteMap[topic._id.toString()] || null;
      });
    }

    res.json(topics);
  } catch (error) {
    console.error('Get topics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single topic
// @route   GET /api/topics/:id
// @access  Public
const getTopic = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id)
      .populate('createdBy', 'name email avatar')
      .lean();

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    // Add user vote info if authenticated
    if (req.user) {
      const userVote = await Vote.findOne({
        userId: req.user._id,
        targetId: topic._id,
        targetType: 'Topic'
      });
      topic.userVote = userVote ? userVote.voteType : null;
    }

    res.json(topic);
  } catch (error) {
    console.error('Get topic error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createTopic,
  getTopics,
  getTopic
};
