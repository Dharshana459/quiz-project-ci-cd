const express = require('express');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Score = require('../models/Score');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// @route   GET /api/quizzes
// @desc    Get all active quizzes (for users) or all quizzes (for admin)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') {
      query.isActive = true;
    }

    const quizzes = await Quiz.find(query)
      .populate('createdBy', 'name')
      .populate('questionCount')
      .sort({ createdAt: -1 });

    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/quizzes/:id
// @desc    Get single quiz details
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('questionCount');

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/quizzes
// @desc    Create a new quiz
// @access  Admin
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const { title, description, category, timeLimit, isActive } = req.body;

    const quiz = await Quiz.create({
      title,
      description,
      category,
      timeLimit,
      isActive: isActive !== undefined ? isActive : true,
      createdBy: req.user._id
    });

    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/quizzes/:id
// @desc    Update a quiz
// @access  Admin
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const { title, description, category, timeLimit, isActive } = req.body;

    quiz.title = title || quiz.title;
    quiz.description = description || quiz.description;
    quiz.category = category || quiz.category;
    quiz.timeLimit = timeLimit || quiz.timeLimit;
    quiz.isActive = isActive !== undefined ? isActive : quiz.isActive;

    const updatedQuiz = await quiz.save();
    res.json(updatedQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/quizzes/:id
// @desc    Delete a quiz and its questions and scores
// @access  Admin
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Delete all related questions and scores
    await Question.deleteMany({ quizId: req.params.id });
    await Score.deleteMany({ quizId: req.params.id });
    await Quiz.findByIdAndDelete(req.params.id);

    res.json({ message: 'Quiz and related data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
