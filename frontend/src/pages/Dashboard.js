import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiArrowRight, FiClock, FiAward, FiTrendingUp, FiUser } from 'react-icons/fi';
import { MdQuiz } from 'react-icons/md';
import api from '../utils/api';
import { getProfile } from '../store/slices/authSlice';
import { formatDate, formatTime, getScoreColor, getCategoryIcon } from '../utils/helpers';
import './Dashboard.css';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user, profileData } = useSelector(s => s.auth);
  const [recentResults, setRecentResults] = useState([]);
  const [featuredQuizzes, setFeaturedQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(getProfile());
    Promise.all([
      api.get(`/results/user/${user.id}?limit=5`),
      api.get('/quizzes?limit=4')
    ]).then(([resultsRes, quizzesRes]) => {
      setRecentResults(resultsRes.data.results);
      setFeaturedQuizzes(quizzesRes.data.quizzes);
    }).finally(() => setLoading(false));
  }, [dispatch, user.id]);

  const stats = profileData?.stats || { totalAttempts: 0, avgScore: 0, highestScore: 0 };

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Welcome */}
        <div className="dashboard-welcome">
          <div className="welcome-left">
            <div className="welcome-avatar">{user.name[0].toUpperCase()}</div>
            <div>
              <h1 className="welcome-title">Welcome back, {user.name.split(' ')[0]}! 👋</h1>
              <p className="welcome-sub">Ready to test your knowledge today?</p>
            </div>
          </div>
          <Link to="/quizzes" className="btn btn-primary">
            Find a Quiz <FiArrowRight />
          </Link>
        </div>

        {/* Stats */}
        <div className="dashboard-stats">
          <div className="dash-stat card">
            <div className="dash-stat-icon" style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--primary)' }}><MdQuiz /></div>
            <div className="dash-stat-val">{stats.totalAttempts}</div>
            <div className="dash-stat-label">Quizzes Taken</div>
          </div>
          <div className="dash-stat card">
            <div className="dash-stat-icon" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--success)' }}><FiTrendingUp /></div>
            <div className="dash-stat-val">{stats.avgScore}%</div>
            <div className="dash-stat-label">Average Score</div>
          </div>
          <div className="dash-stat card">
            <div className="dash-stat-icon" style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--accent)' }}><FiAward /></div>
            <div className="dash-stat-val">{stats.highestScore}%</div>
            <div className="dash-stat-label">Highest Score</div>
          </div>
          <div className="dash-stat card">
            <div className="dash-stat-icon" style={{ background: 'rgba(6,182,212,0.1)', color: 'var(--secondary)' }}><FiUser /></div>
            <div className="dash-stat-val">{user.role}</div>
            <div className="dash-stat-label">Account Type</div>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* Recent Results */}
          <div className="dash-section card">
            <div className="dash-section-header">
              <h2>Recent Activity</h2>
              <Link to="/results" className="text-sm text-primary">View All <FiArrowRight style={{ display: 'inline' }} /></Link>
            </div>

            {loading ? (
              <div>{[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '56px', borderRadius: '8px', marginBottom: '0.5rem' }} />)}</div>
            ) : recentResults.length === 0 ? (
              <div className="empty-state" style={{ padding: '2rem 1rem' }}>
                <div className="empty-state-icon">📋</div>
                <div className="empty-state-title">No attempts yet</div>
                <div className="empty-state-desc">Take your first quiz!</div>
              </div>
            ) : (
              <div className="activity-list">
                {recentResults.map(result => (
                  <Link to={`/results/${result._id}`} key={result._id} className="activity-item">
                    <span className="activity-emoji">{getCategoryIcon(result.quizId?.category)}</span>
                    <div className="activity-info">
                      <div className="activity-name">{result.quizId?.title || 'Unknown Quiz'}</div>
                      <div className="activity-meta">
                        <FiClock size={11} /> {formatTime(result.timeTaken)} · {formatDate(result.submittedAt)}
                      </div>
                    </div>
                    <div className="activity-score" style={{ color: getScoreColor(result.percentage) }}>
                      {result.percentage}%
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Suggested Quizzes */}
          <div className="dash-section card">
            <div className="dash-section-header">
              <h2>Suggested Quizzes</h2>
              <Link to="/quizzes" className="text-sm text-primary">Browse All <FiArrowRight style={{ display: 'inline' }} /></Link>
            </div>
            <div className="suggested-list">
              {featuredQuizzes.map(quiz => (
                <Link to={`/quizzes/${quiz._id}`} key={quiz._id} className="suggested-item">
                  <span className="activity-emoji">{getCategoryIcon(quiz.category)}</span>
                  <div className="activity-info">
                    <div className="activity-name">{quiz.title}</div>
                    <div className="activity-meta">
                      <FiClock size={11} /> {quiz.duration} min · {quiz.questionCount || 0} questions
                    </div>
                  </div>
                  <FiArrowRight className="text-muted" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
