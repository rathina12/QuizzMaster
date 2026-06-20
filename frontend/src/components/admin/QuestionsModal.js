import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FiX, FiPlus, FiEdit2, FiTrash2, FiSave } from 'react-icons/fi';
import api from '../../utils/api';
import './QuestionsModal.css';

const BLANK_Q = {
  question: '',
  options: [
    { label: 'A', text: '' },
    { label: 'B', text: '' },
    { label: 'C', text: '' },
    { label: 'D', text: '' }
  ],
  correctAnswer: 'A',
  marks: 5,
  difficulty: 'Medium',
  explanation: ''
};

export default function QuestionsModal({ quiz, onClose }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(BLANK_Q);
  const [saving, setSaving] = useState(false);

  const fetchQuestions = () => {
    setLoading(true);
    api.get(`/questions/quiz/${quiz._id}`).then(res => setQuestions(res.data.questions)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchQuestions(); }, [quiz._id]);

  const handleOptionChange = (i, val) => {
    const opts = [...form.options];
    opts[i] = { ...opts[i], text: val };
    setForm(prev => ({ ...prev, options: opts }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/questions/${editingId}`, form);
        toast.success('Question updated');
      } else {
        await api.post('/questions', { ...form, quizId: quiz._id });
        toast.success('Question added');
      }
      setForm(BLANK_Q);
      setShowForm(false);
      setEditingId(null);
      fetchQuestions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save question');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (q) => {
    setForm({
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      marks: q.marks,
      difficulty: q.difficulty,
      explanation: q.explanation || ''
    });
    setEditingId(q._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this question?')) return;
    try {
      await api.delete(`/questions/${id}`);
      toast.success('Question deleted');
      fetchQuestions();
    } catch { toast.error('Delete failed'); }
  };

  const cancelForm = () => { setShowForm(false); setEditingId(null); setForm(BLANK_Q); };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="questions-modal card" onClick={e => e.stopPropagation()}>
        <div className="qmodal-header">
          <div>
            <h2 className="qmodal-title">{quiz.title}</h2>
            <p className="text-sm text-muted">{questions.length} questions · {quiz.totalMarks} total marks</p>
          </div>
          <button className="icon-btn" onClick={onClose}><FiX /></button>
        </div>

        <div className="qmodal-body">
          {/* Questions list */}
          {loading ? (
            <div>{[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '60px', borderRadius: '8px', marginBottom: '0.5rem' }} />)}</div>
          ) : (
            <div className="questions-list">
              {questions.map((q, i) => (
                <div key={q._id} className="question-row">
                  <div className="question-row-left">
                    <span className="qrow-num">{i + 1}</span>
                    <div>
                      <div className="qrow-text">{q.question}</div>
                      <div className="qrow-meta">
                        <span className={`badge badge-${q.difficulty === 'Easy' ? 'success' : q.difficulty === 'Hard' ? 'danger' : 'warning'}`}>{q.difficulty}</span>
                        <span className="text-xs text-muted">Correct: {q.correctAnswer} · {q.marks} mark{q.marks > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                  <div className="question-row-actions">
                    <button className="action-btn" onClick={() => handleEdit(q)}><FiEdit2 /></button>
                    <button className="action-btn danger" onClick={() => handleDelete(q._id)}><FiTrash2 /></button>
                  </div>
                </div>
              ))}
              {questions.length === 0 && !showForm && (
                <div className="empty-state" style={{ padding: '1.5rem 1rem' }}>
                  <div className="empty-state-icon">❓</div>
                  <div className="empty-state-title">No questions yet</div>
                </div>
              )}
            </div>
          )}

          {/* Add Question button */}
          {!showForm && (
            <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: '0.875rem' }} onClick={() => setShowForm(true)}>
              <FiPlus /> Add Question
            </button>
          )}

          {/* Question form */}
          {showForm && (
            <form onSubmit={handleSubmit} className="question-form">
              <div className="qform-header">
                <h3>{editingId ? 'Edit Question' : 'New Question'}</h3>
                <button type="button" className="icon-btn" onClick={cancelForm}><FiX /></button>
              </div>

              <div className="form-group">
                <label className="form-label">Question *</label>
                <textarea className="form-textarea" rows={2} value={form.question} onChange={e => setForm(p => ({ ...p, question: e.target.value }))} required placeholder="Enter question text..." />
              </div>

              <div className="options-form-grid">
                {form.options.map((opt, i) => (
                  <div key={opt.label} className="option-form-item">
                    <span className="option-label-badge">{opt.label}</span>
                    <input
                      className="form-input"
                      value={opt.text}
                      onChange={e => handleOptionChange(i, e.target.value)}
                      required
                      placeholder={`Option ${opt.label}`}
                    />
                  </div>
                ))}
              </div>

              <div className="form-row-3">
                <div className="form-group">
                  <label className="form-label">Correct Answer</label>
                  <select className="form-select" value={form.correctAnswer} onChange={e => setForm(p => ({ ...p, correctAnswer: e.target.value }))}>
                    {['A', 'B', 'C', 'D'].map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Marks</label>
                  <input type="number" className="form-input" value={form.marks} onChange={e => setForm(p => ({ ...p, marks: Number(e.target.value) }))} min={1} />
                </div>
                <div className="form-group">
                  <label className="form-label">Difficulty</label>
                  <select className="form-select" value={form.difficulty} onChange={e => setForm(p => ({ ...p, difficulty: e.target.value }))}>
                    {['Easy', 'Medium', 'Hard'].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Explanation (optional)</label>
                <textarea className="form-textarea" rows={2} value={form.explanation} onChange={e => setForm(p => ({ ...p, explanation: e.target.value }))} placeholder="Why is this the correct answer?" />
              </div>

              <div className="qform-actions">
                <button type="button" className="btn btn-secondary btn-sm" onClick={cancelForm}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                  {saving ? <><span className="spinner" /> Saving...</> : <><FiSave /> {editingId ? 'Update' : 'Add Question'}</>}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
