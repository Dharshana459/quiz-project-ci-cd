const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: [true, 'Question must belong to a quiz']
  },
  questionText: {
    type: String,
    required: [true, 'Please provide the question text'],
    trim: true
  },
  options: [
    {
      text: {
        type: String,
        required: [true, 'Option text is required']
      },
      isCorrect: {
        type: Boolean,
        default: false
      }
    }
  ]
}, {
  timestamps: true
});

// Validate that each question has exactly 4 options
questionSchema.pre('validate', function(next) {
  if (this.options && this.options.length !== 4) {
    this.invalidate('options', 'Each question must have exactly 4 options');
  }
  // Ensure at least one option is correct
  if (this.options && !this.options.some(opt => opt.isCorrect)) {
    this.invalidate('options', 'At least one option must be marked as correct');
  }
  next();
});

module.exports = mongoose.model('Question', questionSchema);
