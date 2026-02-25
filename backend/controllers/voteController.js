const Vote = require('../models/Vote');
const Topic = require('../models/Topic');
const Answer = require('../models/Answer');
const Question = require('../models/Question');

// @desc    Vote on a topic or answer
// @route   POST /api/votes
// @access  Private
const vote = async (req, res) => {
  try {
    const { targetId, targetType, voteType } = req.body;

    // Validate input
    if (!targetId || !targetType || !voteType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!['Topic', 'Answer', 'Question'].includes(targetType)) {
      return res.status(400).json({ message: 'Invalid target type' });
    }

    if (![1, -1].includes(voteType)) {
      return res.status(400).json({ message: 'Invalid vote type' });
    }

    // Verify target exists
    let Model;
    if (targetType === 'Topic') Model = Topic;
    else if (targetType === 'Answer') Model = Answer;
    else Model = Question;
    
    const target = await Model.findById(targetId);
    if (!target) {
      return res.status(404).json({ message: `${targetType} not found` });
    }

    // Check for existing vote
    const existingVote = await Vote.findOne({
      userId: req.user._id,
      targetId,
      targetType
    });

    let updatedTarget;

    if (existingVote) {
      // User already voted
      if (existingVote.voteType === voteType) {
        // Same vote - remove it (toggle off)
        await Vote.deleteOne({ _id: existingVote._id });

        // Update vote counts
        if (voteType === 1) {
          target.upvotes = Math.max(0, target.upvotes - 1);
        } else {
          target.downvotes = Math.max(0, target.downvotes - 1);
        }
        await target.save();

        const populateField = targetType === 'Topic' ? 'createdBy' : 'authorId';
        updatedTarget = await Model.findById(targetId)
          .populate(populateField, 'name email avatar')
          .lean();
        updatedTarget.userVote = null;
      } else {
        // Different vote - update it
        const oldVoteType = existingVote.voteType;
        existingVote.voteType = voteType;
        await existingVote.save();

        // Update vote counts
        if (oldVoteType === 1) {
          target.upvotes = Math.max(0, target.upvotes - 1);
          target.downvotes += 1;
        } else {
          target.downvotes = Math.max(0, target.downvotes - 1);
          target.upvotes += 1;
        }
        await target.save();

        const populateField = targetType === 'Topic' ? 'createdBy' : 'authorId';
        updatedTarget = await Model.findById(targetId)
          .populate(populateField, 'name email avatar')
          .lean();
        updatedTarget.userVote = voteType;
      }
    } else {
      // New vote
      await Vote.create({
        userId: req.user._id,
        targetId,
        targetType,
        voteType
      });

      // Update vote counts
      if (voteType === 1) {
        target.upvotes += 1;
      } else {
        target.downvotes += 1;
      }
      await target.save();

      const populateField = targetType === 'Topic' ? 'createdBy' : 'authorId';
      updatedTarget = await Model.findById(targetId)
        .populate(populateField, 'name email avatar')
        .lean();
      updatedTarget.userVote = voteType;
    }

    res.json(updatedTarget);
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  vote
};
