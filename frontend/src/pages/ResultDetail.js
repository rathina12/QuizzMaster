import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle, FiXCircle, FiMinus, FiClock, FiAward } from 'react-icons/fi';
import api from '../utils/api';
import { getScoreColor, getGrade, formatDate, formatTime, getCategoryIcon } from '../utils/helpers';
import './ResultDetail.css';

export default function ResultDetail() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAnswers, setShowAnswers] = useState(true);

  useEffect(() => {
    api.get(`/results/${id}`).then(res => setResult(res.data.result)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div className="skeleton" style={{ height: '250px', borderRadius: '16px', marginBottom: '1rem' }} />
      <div className="skeleton" style={{ height: '400px', borderRadius: '16px' }} />
    </div>
  );

  if (!result) return <div className="container"><div className="empty-state"><div className="empty-state-title">Result not found</div></div></div>;

  const correct = result.answers.filter(a => a.isCorrect).length;
  const wrong = result.answers.filter(a => !a.isCorrect && a.selectedAnswer).length;
  const skipped = result.answers.filter(a => !a.selectedAnswer).length;
  const grade = getGrade(result.percentage);
  const scoreColor = getScoreColor(result.percentage);

  return (
    <div className="result-detail-page">
      <div className="container">
        <Link to="/results" className="back-link"><FiArrowLeft /> Back to Results</Link>

        {/* Score card */}
        <div className="result-hero card">
          <div className="result-hero-left">
            <div className="result-quiz-category">
              {result.quizId && (
                <span>{getCategoryIcon(result.quizId.category)} {result.quizId.category}</span>
              )}
            </div>
            <h1 className="result-quiz-title">{result.quizId?.title}</h1>
            <div className="result-meta">
              <span><FiClock /> {formatTime(result.timeTaken)} taken</span>
              <span>Submitted {formatDate(result.submittedAt)}</span>
            </div>
            <div className={`result-pass-badge ${result.passed ? 'pass' : 'fail'}`}>
              {result.passed ? <><FiCheckCircle /> Passed</> : <><FiXCircle /> Failed</>}
            </div>
          </div>

          <div className="result-score-circle-wrap">
            <div className="result-grade" style={{ color: scoreColor }}>{grade}</div>
            <div className="score-circle" style={{ '--score-color': scoreColor, '--score-pct': result.percentage }}>
              <svg viewBox="0 0 100 100" className="score-svg">
                <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border)" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke={scoreColor} strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - result.percentage / 100)}`}
                  transform="rotate(-90 50 50)"
                  style={{ transition: 'stroke-dashoffset 1s ease' }}
                />
              </svg>
              <div className="score-text">
                <span className="score-pct" style={{ color: scoreColor }}>{result.percentage}%</span>
                <span className="score-marks">{result.score}/{result.totalMarks}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="result-stats-row">
          <div className="result-stat card">
            <FiCheckCircle className="stat-icon-lg" style={{ color: 'var(--success)' }} />
            <div className="result-stat-val" style={{ color: 'var(--success)' }}>{correct}</div>
            <div className="result-stat-label">Correct</div>
          </div>
          <div className="result-stat card">
            <FiXCircle className="stat-icon-lg" style={{ color: 'var(--danger)' }} />
            <div className="result-stat-val" style={{ color: 'var(--danger)' }}>{wrong}</div>
            <div className="result-stat-label">Wrong</div>
          </div>
          <div className="result-stat card">
            <FiMinus className="stat-icon-lg" style={{ color: 'var(--text-muted)' }} />
            <div className="result-stat-val" style={{ color: 'var(--text-muted)' }}>{skipped}</div>
            <div className="result-stat-label">Skipped</div>
          </div>
          <div className="result-stat card">
            <FiAward className="stat-icon-lg" style={{ color: 'var(--primary)' }} />
            <div className="result-stat-val" style={{ color: 'var(--primary)' }}>{result.score}</div>
            <div className="result-stat-label">Score</div>
          </div>
        </div>

        {/* Answer Review */}
        <div className="answers-section card">
          <div className="answers-header">
            <h2>Answer Review</h2>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowAnswers(!showAnswers)}>
              {showAnswers ? 'Hide Answers' : 'Show Answers'}
            </button>
          </div>

          {showAnswers && (
            <div className="answers-list">
              {result.answers.map((ans, i) => (
                <div key={i} className={`answer-item ${ans.isCorrect ? 'correct' : ans.selectedAnswer ? 'wrong' : 'skipped'}`}>
                  <div className="answer-header">
                    <span className="answer-num">Q{i + 1}</span>
                    <div className="answer-status">
                      {ans.isCorrect
                        ? <span className="status-badge correct"><FiCheckCircle /> Correct (+{ans.marksObtained})</span>
                        : ans.selectedAnswer
                          ? <span className="status-badge wrong"><FiXCircle /> Wrong ({ans.marksObtained})</span>
                          : <span className="status-badge skipped"><FiMinus /> Skipped (0)</span>
                      }
                    </div>
                  </div>

                  <p className="answer-question">{ans.questionText}</p>

                  <div className="answer-options">
                    {ans.options?.map(opt => (
                      <div
                        key={opt.label}
                        className={`answer-option
                          ${opt.label === ans.correctAnswer ? 'is-correct' : ''}
                          ${opt.label === ans.selectedAnswer && !ans.isCorrect ? 'is-wrong' : ''}
                        `}
                      >
                        <span className="answer-option-label">{opt.label}</span>
                        <span>{opt.text}</span>
                        {opt.label === ans.correctAnswer && <FiCheckCircle className="answer-option-icon correct" />}
                        {opt.label === ans.selectedAnswer && !ans.isCorrect && <FiXCircle className="answer-option-icon wrong" />}
                      </div>
                    ))}
                  </div>

                  {ans.explanation && (
                    <div className="answer-explanation">
                      <strong>💡 Explanation:</strong> {ans.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="result-actions">
          <Link to="/quizzes" className="btn btn-secondary">Browse More Quizzes</Link>
          <Link to={`/quizzes/${result.quizId?._id}`} className="btn btn-primary">Retake Quiz</Link>
        </div>
      </div>
    </div>
  );
}
