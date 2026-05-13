const express = require('express');
const Question = require('../models/Question');
const Quiz = require('../models/Quiz');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// @route   GET /api/quizzes/:quizId/questions
// @desc    Get all questions for a quiz
// @access  Private
router.get('/quizzes/:quizId/questions', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    let questions = await Question.find({ quizId: req.params.quizId });

    // For non-admin users, hide which option is correct
    if (req.user.role !== 'admin') {
      questions = questions.map(q => {
        const questionObj = q.toObject();
        questionObj.options = questionObj.options.map(opt => ({
          _id: opt._id,
          text: opt.text
        }));
        return questionObj;
      });
    }

    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/quizzes/:quizId/questions
// @desc    Add a question to a quiz
// @access  Admin
router.post('/quizzes/:quizId/questions', auth, adminAuth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const { questionText, options } = req.body;

    const question = await Question.create({
      quizId: req.params.quizId,
      questionText,
      options
    });

    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/questions/:id
// @desc    Update a question
// @access  Admin
router.put('/questions/:id', auth, adminAuth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const { questionText, options } = req.body;

    question.questionText = questionText || question.questionText;
    question.options = options || question.options;

    const updatedQuestion = await question.save();
    res.json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/questions/:id
// @desc    Delete a question
// @access  Admin
router.delete('/questions/:id', auth, adminAuth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
