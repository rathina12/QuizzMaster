const Result = require('../models/Result');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

// @desc    Submit quiz result
// @route   POST /api/results
exports.submitResult = async (req, res) => {
  try {
    const { quizId, answers, timeTaken } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    const questions = await Question.find({ quizId });

    let score = 0;
    const processedAnswers = questions.map(q => {
      const userAnswer = answers.find(a => a.questionId === q._id.toString());
      const selectedAnswer = userAnswer ? userAnswer.selectedAnswer : null;
      const isCorrect = selectedAnswer === q.correctAnswer;

      let marksObtained = 0;
      if (isCorrect) {
        marksObtained = q.marks;
        score += q.marks;
      } else if (selectedAnswer && quiz.negativeMarking) {
        marksObtained = -(q.marks * quiz.negativeMarkValue);
        score += marksObtained;
      }

      return {
        questionId: q._id,
        selectedAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
        marksObtained,
        questionText: q.question,
        options: q.options,
        explanation: q.explanation
      };
    });

    score = Math.max(0, score); // No negative total
    const percentage = quiz.totalMarks > 0 ? Math.round((score / quiz.totalMarks) * 100) : 0;
    const passed = score >= (quiz.passingMarks || quiz.totalMarks * 0.4);

    const result = await Result.create({
      userId: req.user._id,
      quizId,
      score,
      totalMarks: quiz.totalMarks,
      percentage,
      passed,
      timeTaken,
      answers: processedAnswers
    });

    // Increment attempt count
    await Quiz.findByIdAndUpdate(quizId, { $inc: { attemptCount: 1 } });

    res.status(201).json({
      success: true,
      result: {
        ...result.toObject(),
        answers: processedAnswers
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user results
// @route   GET /api/results/user/:userId
exports.getUserResults = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.params.userId;

    // Only allow users to see their own results unless admin
    if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const total = await Result.countDocuments({ userId });
    const results = await Result.find({ userId })
      .populate('quizId', 'title category difficulty duration')
      .sort({ submittedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select('-answers');

    res.json({
      success: true,
      results,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single result
// @route   GET /api/results/:id
exports.getResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('quizId', 'title category difficulty negativeMarking negativeMarkValue')
      .populate('userId', 'name email');

    if (!result) return res.status(404).json({ success: false, message: 'Result not found' });

    if (result.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get quiz results (admin)
// @route   GET /api/results/quiz/:quizId
exports.getQuizResults = async (req, res) => {
  try {
    const results = await Result.find({ quizId: req.params.quizId })
      .populate('userId', 'name email')
      .sort({ submittedAt: -1 })
      .select('-answers');
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
