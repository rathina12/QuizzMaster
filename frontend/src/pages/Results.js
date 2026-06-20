import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiClock, FiAward, FiTrendingUp, FiEye } from 'react-icons/fi';
import api from '../utils/api';
import { formatDate, formatTime, getScoreColor, getCategoryIcon } from '../utils/helpers';
import './Results.css';

export default function Results() {
  const { user } = useSelector(s => s.auth);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, page: 1 });

  const fetchResults = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/results/user/${user.id}?page=${page}&limit=10`);
      setResults(res.data.results);
      setPagination(res.data.pagination);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchResults(); }, []);

  const totalAttempts = pagination.total;
  const avgScore = results.length > 0
    ? Math.round(results.reduce((acc, r) => acc + r.percentage, 0) / results.length)
    : 0;
  const best = results.length > 0
    ? Math.max(...results.map(r => r.percentage))
    : 0;

  return (
    <div className="results-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">My Results</h1>
          <p className="page-subtitle">Track your quiz performance over time</p>
        </div>

        {/* Summary cards */}
        <div className="results-summary">
          <div className="summary-card card">
            <div className="summary-icon" style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--primary)' }}>
              <FiAward />
            </div>
            <div className="summary-val">{totalAttempts}</div>
            <div className="summary-label">Total Attempts</div>
          </div>
          <div className="summary-card card">
            <div className="summary-icon" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--success)' }}>
              <FiTrendingUp />
            </div>
            <div className="summary-val">{avgScore}%</div>
            <div className="summary-label">Average Score</div>
          </div>
          <div className="summary-card card">
            <div className="summary-icon" style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--accent)' }}>
              <FiAward />
            </div>
            <div className="summary-val">{best}%</div>
            <div className="summary-label">Best Score</div>
          </div>
        </div>

        {/* Results list */}
        {loading ? (
          <div>
            {[1,2,3].map(i => (
              <div key={i} className="skeleton" style={{ height: '80px', borderRadius: '12px', marginBottom: '0.75rem' }} />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="empty-state card">
            <div className="empty-state-icon">📊</div>
            <div className="empty-state-title">No attempts yet</div>
            <div className="empty-state-desc">Take a quiz to see your results here</div>
            <Link to="/quizzes" className="btn btn-primary" style={{ marginTop: '1rem' }}>Browse Quizzes</Link>
          </div>
        ) : (
          <div className="results-list">
            {results.map(result => (
              <div key={result._id} className="result-row card">
                <div className="result-row-left">
                  <span className="result-emoji">{getCategoryIcon(result.quizId?.category)}</span>
                  <div>
                    <div className="result-quiz-name">{result.quizId?.title || 'Quiz Deleted'}</div>
                    <div className="result-row-meta">
                      <span><FiClock /> {formatTime(result.timeTaken)}</span>
                      <span>{formatDate(result.submittedAt)}</span>
                      <span className={`badge ${result.passed ? 'badge-success' : 'badge-danger'}`}>
                        {result.passed ? 'Passed' : 'Failed'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="result-row-right">
                  <div className="result-row-score" style={{ color: getScoreColor(result.percentage) }}>
                    {result.percentage}%
                  </div>
                  <div className="result-marks-text">{result.score}/{result.totalMarks} marks</div>
                  <Link to={`/results/${result._id}`} className="btn btn-secondary btn-sm">
                    <FiEye /> Review
                  </Link>
                </div>
              </div>
            ))}

            {pagination.pages > 1 && (
              <div className="pagination" style={{ marginTop: '1.5rem' }}>
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    className={`page-btn ${pagination.page === p ? 'active' : ''}`}
                    onClick={() => fetchResults(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
