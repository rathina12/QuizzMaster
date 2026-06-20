const express = require('express');
const router = express.Router();
const {
  getQuizzes, getQuiz, getQuizForAttempt, createQuiz,
  updateQuiz, deleteQuiz, getAdminQuizzes
} = require('../controllers/quizController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getQuizzes);
router.get('/admin/all', protect, adminOnly, getAdminQuizzes);
router.get('/:id', getQuiz);
router.get('/:id/attempt', protect, getQuizForAttempt);
router.post('/', protect, adminOnly, createQuiz);
router.put('/:id', protect, adminOnly, updateQuiz);
router.delete('/:id', protect, adminOnly, deleteQuiz);

module.exports = router;
