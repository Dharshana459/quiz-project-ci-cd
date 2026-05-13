const mongoose = require('mongoose');
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

const seedDatabase = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@quiz.com' });
    if (adminExists) {
      console.log('📦 Database already seeded');
      return;
    }

    console.log('🌱 Seeding database...');

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@quiz.com',
      password: 'admin123',
      role: 'admin'
    });

    // Create sample user
    await User.create({
      name: 'John Doe',
      email: 'john@quiz.com',
      password: 'user123',
      role: 'user'
    });

    // ─── Quiz 1: JavaScript ───
    const jsQuiz = await Quiz.create({
      title: 'JavaScript Fundamentals',
      description: 'Test your knowledge of JavaScript basics including variables, functions, loops, and ES6+ features.',
      category: 'Programming',
      timeLimit: 10,
      isActive: true,
      createdBy: admin._id
    });

    await Question.insertMany([
      {
        quizId: jsQuiz._id,
        questionText: 'Which keyword is used to declare a constant in JavaScript?',
        options: [
          { text: 'var', isCorrect: false },
          { text: 'let', isCorrect: false },
          { text: 'const', isCorrect: true },
          { text: 'define', isCorrect: false }
        ]
      },
      {
        quizId: jsQuiz._id,
        questionText: 'What does "===" operator check in JavaScript?',
        options: [
          { text: 'Only value', isCorrect: false },
          { text: 'Only type', isCorrect: false },
          { text: 'Both value and type', isCorrect: true },
          { text: 'Neither value nor type', isCorrect: false }
        ]
      },
      {
        quizId: jsQuiz._id,
        questionText: 'Which method is used to add an element at the end of an array?',
        options: [
          { text: 'push()', isCorrect: true },
          { text: 'pop()', isCorrect: false },
          { text: 'shift()', isCorrect: false },
          { text: 'unshift()', isCorrect: false }
        ]
      },
      {
        quizId: jsQuiz._id,
        questionText: 'What is the output of typeof null?',
        options: [
          { text: '"null"', isCorrect: false },
          { text: '"undefined"', isCorrect: false },
          { text: '"object"', isCorrect: true },
          { text: '"boolean"', isCorrect: false }
        ]
      },
      {
        quizId: jsQuiz._id,
        questionText: 'Which ES6 feature is used for asynchronous programming?',
        options: [
          { text: 'Classes', isCorrect: false },
          { text: 'Promises', isCorrect: true },
          { text: 'Template literals', isCorrect: false },
          { text: 'Destructuring', isCorrect: false }
        ]
      }
    ]);

    // ─── Quiz 2: Python ───
    const pyQuiz = await Quiz.create({
      title: 'Python Basics',
      description: 'A comprehensive quiz on Python programming fundamentals including data types, control flow, and functions.',
      category: 'Programming',
      timeLimit: 10,
      isActive: true,
      createdBy: admin._id
    });

    await Question.insertMany([
      {
        quizId: pyQuiz._id,
        questionText: 'What is the correct way to create a list in Python?',
        options: [
          { text: 'list = (1, 2, 3)', isCorrect: false },
          { text: 'list = [1, 2, 3]', isCorrect: true },
          { text: 'list = {1, 2, 3}', isCorrect: false },
          { text: 'list = <1, 2, 3>', isCorrect: false }
        ]
      },
      {
        quizId: pyQuiz._id,
        questionText: 'Which keyword is used to define a function in Python?',
        options: [
          { text: 'function', isCorrect: false },
          { text: 'func', isCorrect: false },
          { text: 'def', isCorrect: true },
          { text: 'define', isCorrect: false }
        ]
      },
      {
        quizId: pyQuiz._id,
        questionText: 'What does len() function do in Python?',
        options: [
          { text: 'Returns the type of an object', isCorrect: false },
          { text: 'Returns the length of an object', isCorrect: true },
          { text: 'Returns the last element', isCorrect: false },
          { text: 'Returns the first element', isCorrect: false }
        ]
      },
      {
        quizId: pyQuiz._id,
        questionText: 'Which of the following is immutable in Python?',
        options: [
          { text: 'List', isCorrect: false },
          { text: 'Dictionary', isCorrect: false },
          { text: 'Set', isCorrect: false },
          { text: 'Tuple', isCorrect: true }
        ]
      },
      {
        quizId: pyQuiz._id,
        questionText: 'How do you start a comment in Python?',
        options: [
          { text: '//', isCorrect: false },
          { text: '/*', isCorrect: false },
          { text: '#', isCorrect: true },
          { text: '--', isCorrect: false }
        ]
      }
    ]);

    // ─── Quiz 3: General Knowledge ───
    const gkQuiz = await Quiz.create({
      title: 'General Knowledge',
      description: 'Challenge yourself with questions about science, geography, history, and more!',
      category: 'General',
      timeLimit: 8,
      isActive: true,
      createdBy: admin._id
    });

    await Question.insertMany([
      {
        quizId: gkQuiz._id,
        questionText: 'What is the chemical symbol for gold?',
        options: [
          { text: 'Go', isCorrect: false },
          { text: 'Gd', isCorrect: false },
          { text: 'Au', isCorrect: true },
          { text: 'Ag', isCorrect: false }
        ]
      },
      {
        quizId: gkQuiz._id,
        questionText: 'Which planet is known as the Red Planet?',
        options: [
          { text: 'Venus', isCorrect: false },
          { text: 'Mars', isCorrect: true },
          { text: 'Jupiter', isCorrect: false },
          { text: 'Saturn', isCorrect: false }
        ]
      },
      {
        quizId: gkQuiz._id,
        questionText: 'What is the largest ocean on Earth?',
        options: [
          { text: 'Atlantic Ocean', isCorrect: false },
          { text: 'Indian Ocean', isCorrect: false },
          { text: 'Arctic Ocean', isCorrect: false },
          { text: 'Pacific Ocean', isCorrect: true }
        ]
      },
      {
        quizId: gkQuiz._id,
        questionText: 'Who painted the Mona Lisa?',
        options: [
          { text: 'Vincent van Gogh', isCorrect: false },
          { text: 'Pablo Picasso', isCorrect: false },
          { text: 'Leonardo da Vinci', isCorrect: true },
          { text: 'Michelangelo', isCorrect: false }
        ]
      },
      {
        quizId: gkQuiz._id,
        questionText: 'What is the speed of light approximately?',
        options: [
          { text: '300,000 km/s', isCorrect: true },
          { text: '150,000 km/s', isCorrect: false },
          { text: '500,000 km/s', isCorrect: false },
          { text: '1,000,000 km/s', isCorrect: false }
        ]
      }
    ]);

    console.log('✅ Database seeded successfully!');
    console.log('   Admin: admin@quiz.com / admin123');
    console.log('   User:  john@quiz.com / user123');
  } catch (error) {
    console.error('❌ Seed Error:', error.message);
  }
};

module.exports = seedDatabase;
