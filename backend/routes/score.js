const express = require('express');
const Score = require('../models/Score');
const Question = require('../models/Question');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// @route   POST /api/scores/submit
// @desc    Submit quiz answers and get instant score
// @access  Private
router.post('/submit', auth, async (req, res) => {
  try {
    const { quizId, answers, timeTaken } = req.body;

    // Verify quiz exists
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Get all questions for this quiz
    const questions = await Question.find({ quizId });

    if (questions.length === 0) {
      return res.status(400).json({ message: 'This quiz has no questions' });
    }

    // Calculate score
    let correctCount = 0;
    const processedAnswers = questions.map((question, index) => {
      const userAnswer = answers.find(a => a.questionId === question._id.toString());
      const selectedOption = userAnswer ? userAnswer.selectedOption : -1;
      const isCorrect = selectedOption >= 0 && question.options[selectedOption] && question.options[selectedOption].isCorrect;

      if (isCorrect) correctCount++;

      return {
        questionId: question._id,
        selectedOption,
        isCorrect: !!isCorrect
      };
    });

    const percentage = Math.round((correctCount / questions.length) * 100);

    // Save score
    const score = await Score.create({
      userId: req.user._id,
      quizId,
      score: correctCount,
      totalQuestions: questions.length,
      percentage,
      answers: processedAnswers,
      timeTaken: timeTaken || 0
    });

    // Populate and return
    const populatedScore = await Score.findById(score._id)
      .populate('quizId', 'title category')
      .populate('userId', 'name email');

    res.status(201).json(populatedScore);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/scores/my
// @desc    Get current user's score history
// @access  Private
router.get('/my', auth, async (req, res) => {
  try {
    const scores = await Score.find({ userId: req.user._id })
      .populate('quizId', 'title category')
      .sort({ createdAt: -1 });

    res.json(scores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/scores/quiz/:quizId
// @desc    Get all scores for a specific quiz
// @access  Admin
router.get('/quiz/:quizId', auth, adminAuth, async (req, res) => {
  try {
    const scores = await Score.find({ quizId: req.params.quizId })
      .populate('userId', 'name email')
      .populate('quizId', 'title category')
      .sort({ percentage: -1 });

    res.json(scores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/scores/all
// @desc    Get all scores (admin overview)
// @access  Admin
router.get('/all', auth, adminAuth, async (req, res) => {
  try {
    const scores = await Score.find()
      .populate('userId', 'name email')
      .populate('quizId', 'title category')
      .sort({ createdAt: -1 });

    res.json(scores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/scores/stats
// @desc    Get admin dashboard stats
// @access  Admin
router.get('/stats', auth, adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalQuizzes = await Quiz.countDocuments();
    const totalAttempts = await Score.countDocuments();
    const avgScore = await Score.aggregate([
      { $group: { _id: null, avgPercentage: { $avg: '$percentage' } } }
    ]);

    const recentScores = await Score.find()
      .populate('userId', 'name email')
      .populate('quizId', 'title')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      totalUsers,
      totalQuizzes,
      totalAttempts,
      avgScore: avgScore.length > 0 ? Math.round(avgScore[0].avgPercentage) : 0,
      recentScores
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
