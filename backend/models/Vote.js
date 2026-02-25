const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  targetType: {
    type: String,
    enum: ['Topic', 'Answer', 'Question'],
    required: true
  },
  voteType: {
    type: Number,
    enum: [1, -1],
    required: true
  }
}, {
  timestamps: true
});

// Ensure one vote per user per target per type
voteSchema.index({ userId: 1, targetId: 1, targetType: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);
