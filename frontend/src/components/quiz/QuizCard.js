import React from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiAward, FiUsers, FiBarChart2 } from 'react-icons/fi';
import { getCategoryIcon, getDifficultyColor } from '../../utils/helpers';

export default function QuizCard({ quiz, skeleton }) {
  if (skeleton) {
    return (
      <div className="quiz-card card">
        <div className="skeleton" style={{ height: '48px', borderRadius: '8px', marginBottom: '12px' }} />
        <div className="skeleton" style={{ height: '16px', marginBottom: '8px' }} />
        <div className="skeleton" style={{ height: '16px', width: '70%', marginBottom: '16px' }} />
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <div className="skeleton" style={{ height: '24px', width: '60px', borderRadius: '100px' }} />
          <div className="skeleton" style={{ height: '24px', width: '60px', borderRadius: '100px' }} />
        </div>
        <div className="skeleton" style={{ height: '36px', borderRadius: '8px' }} />
      </div>
    );
  }

  return (
    <div className="quiz-card card fade-in">
      <div className="quiz-card-header">
        <span className="category-icon">{getCategoryIcon(quiz.category)}</span>
        <div className="quiz-card-meta">
          <span className={`badge badge-${getDifficultyColor(quiz.difficulty)}`}>{quiz.difficulty}</span>
          <span className="badge badge-secondary">{quiz.category}</span>
        </div>
      </div>

      <h3 className="quiz-card-title">{quiz.title}</h3>
      <p className="quiz-card-desc">{quiz.description}</p>

      <div className="quiz-card-stats">
        <div className="stat-item">
          <FiClock />
          <span>{quiz.duration} min</span>
        </div>
        <div className="stat-item">
          <FiAward />
          <span>{quiz.totalMarks} marks</span>
        </div>
        <div className="stat-item">
          <FiBarChart2 />
          <span>{quiz.questionCount || 0} questions</span>
        </div>
        <div className="stat-item">
          <FiUsers />
          <span>{quiz.attemptCount} attempts</span>
        </div>
      </div>

      {quiz.negativeMarking && (
        <div className="negative-mark-badge">
          ⚠️ Negative marking applies
        </div>
      )}

      <Link to={`/quizzes/${quiz._id}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}>
        View Quiz
      </Link>
    </div>
  );
}
