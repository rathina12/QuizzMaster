const Question = require('../models/Question');
const Quiz = require('../models/Quiz');

// @desc    Get questions for a quiz (admin)
// @route   GET /api/questions/quiz/:quizId
exports.getQuizQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ quizId: req.params.quizId }).sort({ order: 1 });
    res.json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create question
// @route   POST /api/questions
exports.createQuestion = async (req, res) => {
  try {
    const { quizId, question, options, correctAnswer, marks, difficulty, explanation } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    const newQuestion = await Question.create({
      quizId, question, options, correctAnswer, marks, difficulty, explanation
    });

    // Update quiz total marks
    const allQuestions = await Question.find({ quizId });
    const totalMarks = allQuestions.reduce((sum, q) => sum + q.marks, 0);
    await Quiz.findByIdAndUpdate(quizId, { totalMarks });

    res.status(201).json({ success: true, message: 'Question created successfully', question: newQuestion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update question
// @route   PUT /api/questions/:id
exports.updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });

    // Recalculate total marks
    const allQuestions = await Question.find({ quizId: question.quizId });
    const totalMarks = allQuestions.reduce((sum, q) => sum + q.marks, 0);
    await Quiz.findByIdAndUpdate(question.quizId, { totalMarks });

    res.json({ success: true, message: 'Question updated', question });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete question
// @route   DELETE /api/questions/:id
exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });

    // Recalculate total marks
    const allQuestions = await Question.find({ quizId: question.quizId });
    const totalMarks = allQuestions.reduce((sum, q) => sum + q.marks, 0);
    await Quiz.findByIdAndUpdate(question.quizId, { totalMarks });

    res.json({ success: true, message: 'Question deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
