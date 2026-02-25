const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  content: {
    type: String,
    required: true,
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

answerSchema.virtual('score').get(function() {
  return this.upvotes - this.downvotes;
});

answerSchema.set('toJSON', { virtuals: true });
answerSchema.set('toObject', { virtuals: true });

// Create text index for search
answerSchema.index({ content: 'text' });

// Create regular indexes for common queries
answerSchema.index({ questionId: 1, upvotes: -1, downvotes: 1 });
answerSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Answer', answerSchema);
