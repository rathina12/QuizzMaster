import { createSlice } from '@reduxjs/toolkit';

const quizSlice = createSlice({
  name: 'quiz',
  initialState: {
    currentQuiz: null,
    questions: [],
    currentIndex: 0,
    answers: {},
    timeLeft: 0,
    isSubmitted: false,
    result: null,
  },
  reducers: {
    startQuiz: (state, action) => {
      state.currentQuiz = action.payload.quiz;
      state.questions = action.payload.questions;
      state.currentIndex = 0;
      state.answers = {};
      state.timeLeft = action.payload.quiz.duration * 60;
      state.isSubmitted = false;
      state.result = null;
    },
    setAnswer: (state, action) => {
      const { questionId, selectedAnswer } = action.payload;
      state.answers[questionId] = selectedAnswer;
    },
    clearAnswer: (state, action) => {
      delete state.answers[action.payload];
    },
    setCurrentIndex: (state, action) => {
      state.currentIndex = action.payload;
    },
    tickTimer: (state) => {
      if (state.timeLeft > 0) state.timeLeft -= 1;
    },
    setResult: (state, action) => {
      state.result = action.payload;
      state.isSubmitted = true;
    },
    resetQuiz: (state) => {
      state.currentQuiz = null;
      state.questions = [];
      state.currentIndex = 0;
      state.answers = {};
      state.timeLeft = 0;
      state.isSubmitted = false;
      state.result = null;
    }
  }
});

export const { startQuiz, setAnswer, clearAnswer, setCurrentIndex, tickTimer, setResult, resetQuiz } = quizSlice.actions;
export default quizSlice.reducer;
