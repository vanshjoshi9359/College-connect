const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  createdBy: {
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

topicSchema.virtual('score').get(function() {
  return this.upvotes - this.downvotes;
});

topicSchema.set('toJSON', { virtuals: true });
topicSchema.set('toObject', { virtuals: true });

// Create text index for search
topicSchema.index({ name: 'text', description: 'text' });

// Create regular indexes for common queries
topicSchema.index({ name: 1 });
topicSchema.index({ createdAt: -1 });
topicSchema.index({ upvotes: -1, downvotes: 1 });

module.exports = mongoose.model('Topic', topicSchema);
