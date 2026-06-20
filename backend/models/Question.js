const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  question: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  options: {
    type: [{
      text: { type: String, required: true },
      label: { type: String, required: true } // A, B, C, D
    }],
    validate: {
      validator: function (v) { return v.length === 4; },
      message: 'Exactly 4 options are required'
    }
  },
  correctAnswer: {
    type: String,
    required: [true, 'Correct answer is required'],
    enum: ['A', 'B', 'C', 'D']
  },
  marks: {
    type: Number,
    required: [true, 'Marks are required'],
    min: [1, 'Marks must be at least 1'],
    default: 1
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  category: {
    type: String,
    default: ''
  },
  explanation: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
