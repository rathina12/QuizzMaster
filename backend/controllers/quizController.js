const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const { validationResult } = require('express-validator');

// @desc    Get all quizzes (public)
// @route   GET /api/quizzes
exports.getQuizzes = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 9, difficulty } = req.query;
    const query = { isPublished: true };

    if (category && category !== 'All') query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];

    const total = await Quiz.countDocuments(query);
    const quizzes = await Quiz.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Add question count to each quiz
    const quizzesWithCount = await Promise.all(quizzes.map(async (quiz) => {
      const questionCount = await Question.countDocuments({ quizId: quiz._id });
      return { ...quiz.toObject(), questionCount };
    }));

    res.json({
      success: true,
      quizzes: quizzesWithCount,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit), limit: Number(limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single quiz
// @route   GET /api/quizzes/:id
exports.getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('createdBy', 'name');
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    const questions = await Question.find({ quizId: quiz._id });
    res.json({ success: true, quiz: { ...quiz.toObject(), questionCount: questions.length } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get quiz questions for attempt
// @route   GET /api/quizzes/:id/attempt
exports.getQuizForAttempt = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz || !quiz.isPublished) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    let questions = await Question.find({ quizId: quiz._id });

    if (quiz.randomizeQuestions) {
      questions = questions.sort(() => Math.random() - 0.5);
    }

    // Hide correct answers, randomize options if needed
    const sanitizedQuestions = questions.map(q => {
      let options = [...q.options];
      let correctLabel = q.correctAnswer;

      if (quiz.randomizeOptions) {
        const shuffled = [...options].sort(() => Math.random() - 0.5);
        // Re-map labels
        const remap = {};
        ['A', 'B', 'C', 'D'].forEach((label, i) => {
          const originalIndex = options.findIndex(o => o.label === shuffled[i].label);
          remap[options[originalIndex].label] = label;
        });
        options = shuffled.map((o, i) => ({ ...o, label: ['A', 'B', 'C', 'D'][i] }));
        correctLabel = remap[q.correctAnswer];
      }

      return {
        _id: q._id,
        question: q.question,
        options,
        marks: q.marks,
        difficulty: q.difficulty,
        // Don't send correctAnswer
      };
    });

    res.json({
      success: true,
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        duration: quiz.duration,
        totalMarks: quiz.totalMarks,
        negativeMarking: quiz.negativeMarking,
        negativeMarkValue: quiz.negativeMarkValue,
        category: quiz.category
      },
      questions: sanitizedQuestions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create quiz (Admin)
// @route   POST /api/quizzes
exports.createQuiz = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const quiz = await Quiz.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, message: 'Quiz created successfully', quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update quiz (Admin)
// @route   PUT /api/quizzes/:id
exports.updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    res.json({ success: true, message: 'Quiz updated successfully', quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete quiz (Admin)
// @route   DELETE /api/quizzes/:id
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    // Also delete questions
    await Question.deleteMany({ quizId: req.params.id });
    res.json({ success: true, message: 'Quiz and its questions deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all quizzes for admin
// @route   GET /api/quizzes/admin/all
exports.getAdminQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate('createdBy', 'name').sort({ createdAt: -1 });
    const quizzesWithCount = await Promise.all(quizzes.map(async (quiz) => {
      const questionCount = await Question.countDocuments({ quizId: quiz._id });
      return { ...quiz.toObject(), questionCount };
    }));
    res.json({ success: true, quizzes: quizzesWithCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
