import React, { useState, useEffect, useCallback } from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';
import api from '../utils/api';
import QuizCard from '../components/quiz/QuizCard';
import '../components/quiz/QuizCard.css';
import { CATEGORIES, DIFFICULTIES } from '../utils/helpers';
import './QuizList.css';

export default function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('');
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  const fetchQuizzes = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 9 });
      if (search) params.append('search', search);
      if (category !== 'All') params.append('category', category);
      if (difficulty) params.append('difficulty', difficulty);
      const res = await api.get(`/quizzes?${params}`);
      setQuizzes(res.data.quizzes);
      setPagination(res.data.pagination);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [search, category, difficulty]);

  useEffect(() => {
    const t = setTimeout(() => fetchQuizzes(1), 350);
    return () => clearTimeout(t);
  }, [fetchQuizzes]);

  return (
    <div className="quiz-list-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Browse Quizzes</h1>
          <p className="page-subtitle">{pagination.total} quizzes available</p>
        </div>

        {/* Filters */}
        <div className="filters-bar card">
          <div className="search-wrap">
            <FiSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search quizzes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="filter-chips">
            <FiFilter style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            {['All', ...CATEGORIES].map(c => (
              <button
                key={c}
                className={`chip ${category === c ? 'active' : ''}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="filter-row">
            <select className="form-select" style={{ width: 'auto' }} value={difficulty} onChange={e => setDifficulty(e.target.value)}>
              <option value="">All Difficulties</option>
              {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
            </select>
            {(search || category !== 'All' || difficulty) && (
              <button className="btn btn-secondary btn-sm" onClick={() => { setSearch(''); setCategory('All'); setDifficulty(''); }}>
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Quiz Grid */}
        {loading ? (
          <div className="grid grid-3" style={{ marginTop: '1.5rem' }}>
            {Array(9).fill(0).map((_, i) => <QuizCard key={i} skeleton />)}
          </div>
        ) : quizzes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <div className="empty-state-title">No quizzes found</div>
            <div className="empty-state-desc">Try adjusting your search or filters</div>
          </div>
        ) : (
          <>
            <div className="grid grid-3" style={{ marginTop: '1.5rem' }}>
              {quizzes.map(quiz => <QuizCard key={quiz._id} quiz={quiz} />)}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="pagination">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    className={`page-btn ${pagination.page === p ? 'active' : ''}`}
                    onClick={() => fetchQuizzes(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
