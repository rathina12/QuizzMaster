const express = require('express');
const router = express.Router();
const { submitResult, getUserResults, getResult, getQuizResults } = require('../controllers/resultController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', protect, submitResult);
router.get('/user/:userId', protect, getUserResults);
router.get('/quiz/:quizId', protect, adminOnly, getQuizResults);
router.get('/:id', protect, getResult);

module.exports = router;
