import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FiClock, FiChevronLeft, FiChevronRight, FiFlag } from 'react-icons/fi';
import api from '../utils/api';
import { startQuiz, setAnswer, clearAnswer, setCurrentIndex, tickTimer, setResult, resetQuiz } from '../store/slices/quizSlice';
import { formatTime } from '../utils/helpers';
import './QuizAttempt.css';

export default function QuizAttempt() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentQuiz, questions, currentIndex, answers, timeLeft, isSubmitted } = useSelector(s => s.quiz);
  const { user } = useSelector(s => s.auth);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const startTime = useRef(Date.now());
  const timerRef = useRef(null);

  useEffect(() => {
    api.get(`/quizzes/${id}/attempt`).then(res => {
      dispatch(startQuiz({ quiz: res.data.quiz, questions: res.data.questions }));
      startTime.current = Date.now();
    }).catch(() => {
      toast.error('Failed to load quiz');
      navigate('/quizzes');
    }).finally(() => setLoading(false));

    return () => {
      clearInterval(timerRef.current);
      dispatch(resetQuiz());
    };
  }, [id, dispatch, navigate]);

  useEffect(() => {
    if (!currentQuiz) return;
    timerRef.current = setInterval(() => {
      dispatch(tickTimer());
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [currentQuiz, dispatch]);

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    clearInterval(timerRef.current);

    const timeTaken = Math.floor((Date.now() - startTime.current) / 1000);
    const answersArray = questions.map(q => ({
      questionId: q._id,
      selectedAnswer: answers[q._id] || null
    }));

    try {
      const res = await api.post('/results', { quizId: id, answers: answersArray, timeTaken });
      dispatch(setResult(res.data.result));
      navigate(`/results/${res.data.result._id}`);
    } catch {
      toast.error('Failed to submit quiz');
      setSubmitting(false);
    }
  }, [submitting, questions, answers, id, dispatch, navigate]);

  // Auto-submit when timer hits 0
  useEffect(() => {
    if (timeLeft === 0 && currentQuiz && !isSubmitted && !submitting) {
      toast.warning('Time\'s up! Submitting your quiz...');
      handleSubmit();
    }
  }, [timeLeft, currentQuiz, isSubmitted, submitting, handleSubmit]);

  if (loading || !currentQuiz) return (
    <div className="quiz-attempt-loading">
      <div className="spinner spinner-dark" style={{ width: 40, height: 40 }} />
      <p>Loading quiz...</p>
    </div>
  );

  const question = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;
  const timerCritical = timeLeft <= 60;
  const timerWarning = timeLeft <= 300;

  return (
    <div className="quiz-attempt-page">
      {/* Header */}
      <div className="attempt-header">
        <div className="container attempt-header-inner">
          <div className="attempt-quiz-info">
            <h2 className="attempt-quiz-title">{currentQuiz.title}</h2>
            <div className="attempt-progress-text">
              Question {currentIndex + 1} of {questions.length} · {answeredCount} answered
            </div>
          </div>
          <div className={`attempt-timer ${timerCritical ? 'critical' : timerWarning ? 'warning' : ''}`}>
            <FiClock />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Main */}
      <div className="container attempt-body">
        <div className="attempt-grid">
          {/* Question */}
          <div className="question-area card fade-in" key={question._id}>
            <div className="question-number-row">
              <span className="question-number">Q{currentIndex + 1}</span>
              <span className={`badge badge-${question.difficulty === 'Easy' ? 'success' : question.difficulty === 'Hard' ? 'danger' : 'warning'}`}>
                {question.difficulty}
              </span>
              <span className="badge badge-secondary">{question.marks} mark{question.marks > 1 ? 's' : ''}</span>
            </div>

            <p className="question-text">{question.question}</p>

            <div className="options-list">
              {question.options.map((option, optionIndex) => {
                const selected = answers[question._id] === option.label;
                return (
                  <button
                    key={option.label}
                    className={`option-btn ${selected ? 'selected' : ''}`}
                    onClick={() => {
                      if (selected) {
                        dispatch(clearAnswer(question._id));
                      } else {
                        dispatch(setAnswer({ questionId: question._id, selectedAnswer: option.label }));
                      }
                    }}
                  >
                    <span className="option-label">{String.fromCharCode(65 + optionIndex)}</span>
                    <span className="option-text">{option.text}</span>
                    {selected && <span className="option-check">✓</span>}
                  </button>
                );
              })}
            </div>

            <div className="question-nav">
              <button
                className="btn btn-secondary"
                onClick={() => dispatch(setCurrentIndex(currentIndex - 1))}
                disabled={currentIndex === 0}
              >
                <FiChevronLeft /> Previous
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  className="btn btn-primary"
                  onClick={() => dispatch(setCurrentIndex(currentIndex + 1))}
                >
                  Next <FiChevronRight />
                </button>
              ) : (
                <button className="btn btn-success" onClick={() => setShowConfirm(true)}>
                  <FiFlag /> Finish Quiz
                </button>
              )}
            </div>
          </div>

          {/* Question palette */}
          <div className="question-palette card">
            <div className="palette-header">
              <h3>Question Palette</h3>
            </div>
            <div className="palette-grid">
              {questions.map((q, i) => (
                <button
                  key={q._id}
                  className={`palette-btn ${i === currentIndex ? 'current' : ''} ${answers[q._id] ? 'answered' : ''}`}
                  onClick={() => dispatch(setCurrentIndex(i))}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="palette-legend">
              <div className="legend-item"><div className="legend-dot current" /><span>Current</span></div>
              <div className="legend-item"><div className="legend-dot answered" /><span>Answered</span></div>
              <div className="legend-item"><div className="legend-dot unanswered" /><span>Not answered</span></div>
            </div>
            <button className="btn btn-danger submit-early-btn" onClick={() => setShowConfirm(true)}>
              <FiFlag /> Submit Quiz
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
          <div className="modal card" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">Submit Quiz?</h3>
            <div className="modal-stats">
              <div className="modal-stat">
                <span className="modal-stat-val">{answeredCount}</span>
                <span className="modal-stat-label">Answered</span>
              </div>
              <div className="modal-stat">
                <span className="modal-stat-val" style={{ color: 'var(--warning)' }}>{questions.length - answeredCount}</span>
                <span className="modal-stat-label">Unanswered</span>
              </div>
              <div className="modal-stat">
                <span className="modal-stat-val">{formatTime(timeLeft)}</span>
                <span className="modal-stat-label">Time Left</span>
              </div>
            </div>
            {questions.length - answeredCount > 0 && (
              <div className="alert alert-info">
                You have {questions.length - answeredCount} unanswered question(s). They will be marked as skipped.
              </div>
            )}
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowConfirm(false)}>Continue Quiz</button>
              <button className="btn btn-danger" onClick={handleSubmit} disabled={submitting}>
                {submitting ? <><span className="spinner" /> Submitting...</> : 'Yes, Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
