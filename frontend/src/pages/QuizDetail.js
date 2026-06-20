import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiClock, FiAward, FiBarChart2, FiUsers, FiCheckCircle, FiAlertTriangle, FiArrowLeft } from 'react-icons/fi';
import { MdQuiz } from 'react-icons/md';
import api from '../utils/api';
import { getCategoryIcon, getDifficultyColor, formatDate } from '../utils/helpers';
import './QuizDetail.css';

export default function QuizDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/quizzes/${id}`).then(res => setQuiz(res.data.quiz)).catch(() => navigate('/quizzes')).finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div className="skeleton" style={{ height: '300px', borderRadius: '16px' }} />
    </div>
  );

  if (!quiz) return null;

  return (
    <div className="quiz-detail-page">
      <div className="container">
        <Link to="/quizzes" className="back-link"><FiArrowLeft /> Back to Quizzes</Link>

        <div className="quiz-detail-grid">
          {/* Main content */}
          <div className="quiz-detail-main">
            <div className="quiz-detail-card card">
              <div className="quiz-detail-header">
                <span className="category-emoji">{getCategoryIcon(quiz.category)}</span>
                <div className="quiz-detail-badges">
                  <span className={`badge badge-${getDifficultyColor(quiz.difficulty)}`}>{quiz.difficulty}</span>
                  <span className="badge badge-secondary">{quiz.category}</span>
                </div>
              </div>
              <h1 className="quiz-detail-title">{quiz.title}</h1>
              <p className="quiz-detail-desc">{quiz.description}</p>

              {quiz.tags?.length > 0 && (
                <div className="tags-row">
                  {quiz.tags.map(tag => <span key={tag} className="tag">#{tag}</span>)}
                </div>
              )}

              <div className="divider" />

              <div className="quiz-info-grid">
                <div className="info-item">
                  <FiClock className="info-icon" />
                  <div>
                    <div className="info-value">{quiz.duration} min</div>
                    <div className="info-label">Duration</div>
                  </div>
                </div>
                <div className="info-item">
                  <FiBarChart2 className="info-icon" />
                  <div>
                    <div className="info-value">{quiz.questionCount}</div>
                    <div className="info-label">Questions</div>
                  </div>
                </div>
                <div className="info-item">
                  <FiAward className="info-icon" />
                  <div>
                    <div className="info-value">{quiz.totalMarks}</div>
                    <div className="info-label">Total Marks</div>
                  </div>
                </div>
                <div className="info-item">
                  <FiUsers className="info-icon" />
                  <div>
                    <div className="info-value">{quiz.attemptCount}</div>
                    <div className="info-label">Attempts</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rules */}
            <div className="rules-card card">
              <h3 className="rules-title"><MdQuiz /> Quiz Rules</h3>
              <ul className="rules-list">
                <li><FiCheckCircle className="rule-icon success" /> {quiz.questionCount} multiple choice questions</li>
                <li><FiCheckCircle className="rule-icon success" /> Timer: {quiz.duration} minutes total</li>
                <li><FiCheckCircle className="rule-icon success" /> Each correct answer: +{quiz.totalMarks / (quiz.questionCount || 1)} marks</li>
                {quiz.negativeMarking && (
                  <li><FiAlertTriangle className="rule-icon warning" /> Negative marking: -{quiz.negativeMarkValue} per wrong answer</li>
                )}
                {quiz.randomizeQuestions && <li><FiCheckCircle className="rule-icon success" /> Questions are randomized</li>}
                <li><FiCheckCircle className="rule-icon success" /> Navigate between questions freely</li>
                <li><FiCheckCircle className="rule-icon success" /> Auto-submit when time expires</li>
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="quiz-detail-sidebar">
            <div className="start-card card">
              <div className="start-card-top">
                <div className="start-card-score">
                  <span className="score-big">{quiz.totalMarks}</span>
                  <span className="score-label">Total Marks</span>
                </div>
                <div className="start-card-score">
                  <span className="score-big">{quiz.passingMarks || Math.round(quiz.totalMarks * 0.4)}</span>
                  <span className="score-label">Passing Marks</span>
                </div>
              </div>

              <div className="divider" />

              {user ? (
                <Link to={`/quiz/${quiz._id}/attempt`} className="btn btn-primary start-btn">
                  Start Quiz <FiArrowLeft style={{ transform: 'rotate(180deg)' }} />
                </Link>
              ) : (
                <div>
                  <Link to="/login" className="btn btn-primary start-btn">Login to Start</Link>
                  <p className="start-card-note">Free account required</p>
                </div>
              )}

              <div className="start-card-meta">
                <span>Created by {quiz.createdBy?.name}</span>
                <span>{formatDate(quiz.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
