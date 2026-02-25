const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  completions: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    notes: {
      type: String,
      trim: true
    }
  }],
  points: {
    type: Number,
    default: 10
  }
}, {
  timestamps: true
});

taskSchema.index({ groupId: 1, dueDate: 1 });
taskSchema.index({ 'completions.userId': 1 });

module.exports = mongoose.model('Task', taskSchema);
