const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  problemDescription: {
    type: String,
    required: true,
    trim: true
  },
  attemptedSolutions: {
    type: String,
    required: true,
    trim: true
  },
  failurePoint: {
    type: String,
    required: true,
    trim: true
  },
  solutionNeeded: {
    type: String,
    required: true,
    trim: true
  },
  additionalDetails: {
    type: String,
    default: '',
    trim: true
  },
  // Keep description for backward compatibility and search
  description: {
    type: String,
    trim: true
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  upvotes: {
    type: Number,
    default: 0
  },
  downvotes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create text index for search
questionSchema.index({ 
  title: 'text', 
  problemDescription: 'text', 
  attemptedSolutions: 'text',
  failurePoint: 'text',
  solutionNeeded: 'text',
  additionalDetails: 'text'
});

// Create regular indexes for common queries
questionSchema.index({ topicId: 1, createdAt: -1 });
questionSchema.index({ title: 1 });

module.exports = mongoose.model('Question', questionSchema);
