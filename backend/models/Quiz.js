const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a quiz title'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    trim: true
  },
  timeLimit: {
    type: Number,
    required: [true, 'Please provide a time limit'],
    min: [1, 'Time limit must be at least 1 minute'],
    default: 10
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual to get question count
quizSchema.virtual('questionCount', {
  ref: 'Question',
  localField: '_id',
  foreignField: 'quizId',
  count: true
});

module.exports = mongoose.model('Quiz', quizSchema);
