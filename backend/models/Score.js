const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0
  },
  totalQuestions: {
    type: Number,
    required: true,
    min: 1
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  answers: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
      },
      selectedOption: {
        type: Number
      },
      isCorrect: {
        type: Boolean
      }
    }
  ],
  timeTaken: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Prevent duplicate submissions for same quiz by same user
scoreSchema.index({ userId: 1, quizId: 1 });

module.exports = mongoose.model('Score', scoreSchema);
