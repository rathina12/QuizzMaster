const express = require('express');
const router = express.Router();
const { getQuizQuestions, createQuestion, updateQuestion, deleteQuestion } = require('../controllers/questionController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/quiz/:quizId', protect, adminOnly, getQuizQuestions);
router.post('/', protect, adminOnly, createQuestion);
router.put('/:id', protect, adminOnly, updateQuestion);
router.delete('/:id', protect, adminOnly, deleteQuestion);

module.exports = router;
