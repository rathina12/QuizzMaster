import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiEdit2, FiTrash2, FiPlus, FiEye, FiEyeOff, FiList } from 'react-icons/fi';
import api from '../../utils/api';
import { formatDate, getCategoryIcon, getDifficultyColor } from '../../utils/helpers';
import QuestionsModal from '../../components/admin/QuestionsModal';
import './AdminQuizzes.css';

export default function AdminQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showQModal, setShowQModal] = useState(false);

  const fetchQuizzes = () => {
    setLoading(true);
    api.get('/quizzes/admin/all').then(res => setQuizzes(res.data.quizzes)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchQuizzes(); }, []);

  const togglePublish = async (quiz) => {
    try {
      await api.put(`/quizzes/${quiz._id}`, { isPublished: !quiz.isPublished });
      toast.success(`Quiz ${!quiz.isPublished ? 'published' : 'unpublished'}`);
      fetchQuizzes();
    } catch { toast.error('Action failed'); }
  };

  const deleteQuiz = async (id) => {
    if (!window.confirm('Delete this quiz and all its questions?')) return;
    try {
      await api.delete(`/quizzes/${id}`);
      toast.success('Quiz deleted');
      fetchQuizzes();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div className="admin-quizzes-page">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1 className="page-title">Manage Quizzes</h1>
            <p className="page-subtitle">{quizzes.length} quizzes total</p>
          </div>
          <Link to="/admin/quizzes/new" className="btn btn-primary">
            <FiPlus /> Create Quiz
          </Link>
        </div>

        {loading ? (
          <div>{[1,2,3,4,5].map(i => <div key={i} className="skeleton" style={{ height: '72px', borderRadius: '12px', marginBottom: '0.625rem' }} />)}</div>
        ) : (
          <div className="quiz-table-wrap card">
            <table className="quiz-table">
              <thead>
                <tr>
                  <th>Quiz</th>
                  <th>Category</th>
                  <th>Difficulty</th>
                  <th>Questions</th>
                  <th>Marks</th>
                  <th>Attempts</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map(quiz => (
                  <tr key={quiz._id}>
                    <td>
                      <div className="quiz-table-name">
                        <span>{getCategoryIcon(quiz.category)}</span>
                        <div>
                          <div className="quiz-name-text">{quiz.title}</div>
                          <div className="quiz-name-sub">{quiz.duration} min</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-secondary">{quiz.category}</span></td>
                    <td><span className={`badge badge-${getDifficultyColor(quiz.difficulty)}`}>{quiz.difficulty}</span></td>
                    <td className="text-center">{quiz.questionCount}</td>
                    <td className="text-center">{quiz.totalMarks}</td>
                    <td className="text-center">{quiz.attemptCount}</td>
                    <td>
                      <span className={`badge ${quiz.isPublished ? 'badge-success' : 'badge-secondary'}`}>
                        {quiz.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="text-muted text-sm">{formatDate(quiz.createdAt)}</td>
                    <td>
                      <div className="action-btns">
                        <button
                          className="action-btn"
                          title={quiz.isPublished ? 'Unpublish' : 'Publish'}
                          onClick={() => togglePublish(quiz)}
                        >
                          {quiz.isPublished ? <FiEyeOff /> : <FiEye />}
                        </button>
                        <button
                          className="action-btn"
                          title="Manage Questions"
                          onClick={() => { setSelectedQuiz(quiz); setShowQModal(true); }}
                        >
                          <FiList />
                        </button>
                        <Link to={`/admin/quizzes/${quiz._id}/edit`} className="action-btn" title="Edit">
                          <FiEdit2 />
                        </Link>
                        <button className="action-btn danger" title="Delete" onClick={() => deleteQuiz(quiz._id)}>
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {quizzes.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">📝</div>
                <div className="empty-state-title">No quizzes yet</div>
                <Link to="/admin/quizzes/new" className="btn btn-primary" style={{ marginTop: '1rem' }}>Create First Quiz</Link>
              </div>
            )}
          </div>
        )}
      </div>

      {showQModal && selectedQuiz && (
        <QuestionsModal quiz={selectedQuiz} onClose={() => { setShowQModal(false); setSelectedQuiz(null); fetchQuizzes(); }} />
      )}
    </div>
  );
}
