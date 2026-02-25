const Topic = require('../models/Topic');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const Vote = require('../models/Vote');

// @desc    Search across topics, questions, and answers
// @route   GET /api/search?q=keyword
// @access  Public
const searchContent = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Sanitize search input
    const searchQuery = q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const searchRegex = new RegExp(searchQuery, 'i');

    // Search topics by name and description
    let topics = await Topic.find({
      $or: [
        { name: searchRegex },
        { description: searchRegex }
      ]
    })
      .populate('createdBy', 'name email avatar')
      .lean();

    // Search questions by title and description
    const questions = await Question.find({
      $or: [
        { title: searchRegex },
        { description: searchRegex }
      ]
    })
      .populate('topicId', 'name')
      .populate('authorId', 'name email avatar')
      .lean();

    // Search answers by content
    const answers = await Answer.find({
      content: searchRegex
    })
      .populate('questionId', 'title')
      .populate('authorId', 'name email avatar')
      .lean();

    // Add user vote info for topics if authenticated
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

    // Get comment counts and ratings for topics
    const topicsWithStats = await Promise.all(
      topics.map(async (topic) => {
        // Get all questions for this topic
        const topicQuestions = await Question.find({ topicId: topic._id });
        const questionIds = topicQuestions.map(q => q._id);

        // Get all answers (comments) for these questions
        const comments = await Answer.find({ questionId: { $in: questionIds } });
        
        // Calculate average rating (score)
        const totalScore = comments.reduce((sum, comment) => {
          return sum + (comment.upvotes - comment.downvotes);
        }, 0);
        const avgRating = comments.length > 0 ? totalScore / comments.length : 0;

        return {
          ...topic,
          commentCount: comments.length,
          avgRating: Math.round(avgRating * 10) / 10,
          score: topic.upvotes - topic.downvotes,
          relevanceScore: calculateRelevance(topic.name, topic.description, searchQuery)
        };
      })
    );

    // Get comment counts for questions
    const questionsWithStats = await Promise.all(
      questions.map(async (question) => {
        const comments = await Answer.find({ questionId: question._id });
        const totalScore = comments.reduce((sum, comment) => {
          return sum + (comment.upvotes - comment.downvotes);
        }, 0);
        const avgRating = comments.length > 0 ? totalScore / comments.length : 0;

        return {
          ...question,
          commentCount: comments.length,
          avgRating: Math.round(avgRating * 10) / 10,
          relevanceScore: calculateRelevance(question.title, question.description, searchQuery)
        };
      })
    );

    // Sort topics by score (votes), then relevance, then rating
    topicsWithStats.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.relevanceScore !== a.relevanceScore) return b.relevanceScore - a.relevanceScore;
      return b.avgRating - a.avgRating;
    });

    // Sort questions by relevance and rating
    questionsWithStats.sort((a, b) => {
      if (b.relevanceScore !== a.relevanceScore) {
        return b.relevanceScore - a.relevanceScore;
      }
      return b.avgRating - a.avgRating;
    });

    // Sort answers by score
    const answersWithScore = answers.map(answer => ({
      ...answer,
      score: answer.upvotes - answer.downvotes
    })).sort((a, b) => b.score - a.score);

    res.json({
      query: q,
      results: {
        topics: topicsWithStats,
        questions: questionsWithStats,
        answers: answersWithScore
      },
      totalResults: topicsWithStats.length + questionsWithStats.length + answersWithScore.length
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get top-rated comments for a topic
// @route   GET /api/search/top-comments/:topicId
// @access  Public
const getTopComments = async (req, res) => {
  try {
    const { topicId } = req.params;
    const limit = parseInt(req.query.limit) || 3;

    // Get all questions for this topic
    const questions = await Question.find({ topicId });
    const questionIds = questions.map(q => q._id);

    // Get all answers (comments) for these questions
    let comments = await Answer.find({ questionId: { $in: questionIds } })
      .populate('authorId', 'name email avatar')
      .populate('questionId', 'title')
      .lean();

    // Calculate score and add user vote if authenticated
    comments = comments.map(comment => ({
      ...comment,
      score: comment.upvotes - comment.downvotes
    }));

    // Sort by score (descending), then by date (newest first) for ties
    comments.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // Add user vote info if authenticated
    if (req.user) {
      const commentIds = comments.map(c => c._id);
      const userVotes = await Vote.find({
        userId: req.user._id,
        targetId: { $in: commentIds },
        targetType: 'Answer'
      });

      const voteMap = {};
      userVotes.forEach(vote => {
        voteMap[vote.targetId.toString()] = vote.voteType;
      });

      comments.forEach(comment => {
        comment.userVote = voteMap[comment._id.toString()] || null;
      });
    }

    // Return top N comments and total count
    res.json({
      topComments: comments.slice(0, limit),
      totalComments: comments.length,
      allComments: comments
    });
  } catch (error) {
    console.error('Get top comments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get search suggestions (autocomplete)
// @route   GET /api/search/suggestions?q=keyword
// @access  Public
const getSearchSuggestions = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json({ suggestions: [] });
    }

    const searchQuery = q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const searchRegex = new RegExp('^' + searchQuery, 'i');

    // Get topic suggestions
    const topics = await Topic.find({
      name: searchRegex
    })
      .select('name')
      .limit(5)
      .lean();

    // Get question suggestions
    const questions = await Question.find({
      title: searchRegex
    })
      .select('title')
      .limit(5)
      .lean();

    const suggestions = [
      ...topics.map(t => ({ text: t.name, type: 'topic' })),
      ...questions.map(q => ({ text: q.title, type: 'question' }))
    ].slice(0, 8);

    res.json({ suggestions });
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function to calculate relevance score
function calculateRelevance(title, description, searchQuery) {
  let score = 0;
  const query = searchQuery.toLowerCase();
  const titleLower = title.toLowerCase();
  const descLower = description.toLowerCase();

  // Exact match in title = highest score
  if (titleLower === query) {
    score += 100;
  } else if (titleLower.includes(query)) {
    // Partial match in title
    score += 50;
    // Bonus for match at start
    if (titleLower.startsWith(query)) {
      score += 25;
    }
  }

  // Match in description
  if (descLower.includes(query)) {
    score += 20;
  }

  return score;
}

module.exports = {
  searchContent,
  getTopComments,
  getSearchSuggestions
};
