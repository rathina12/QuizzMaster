import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import api from '../../utils/api';
import { CATEGORIES, DIFFICULTIES } from '../../utils/helpers';
import './AdminQuizForm.css';

const DEFAULT_FORM = {
  title: '', description: '', category: 'JavaScript', duration: 20, difficulty: 'Medium',
  passingMarks: 0, negativeMarking: false, negativeMarkValue: 0.25,
  randomizeQuestions: true, randomizeOptions: false, isPublished: false, tags: ''
};

export default function AdminQuizForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      api.get(`/quizzes/${id}`).then(res => {
        const q = res.data.quiz;
        setForm({ ...q, tags: q.tags?.join(', ') || '' });
      }).catch(() => navigate('/admin/quizzes'));
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : []
      };

      if (isEdit) {
        await api.put(`/quizzes/${id}`, payload);
        toast.success('Quiz updated successfully');
      } else {
        await api.post('/quizzes', { ...payload, createdBy: user.id });
        toast.success('Quiz created successfully');
      }
      navigate('/admin/quizzes');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save quiz');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-quiz-form-page">
      <div className="container">
        <Link to="/admin/quizzes" className="back-link"><FiArrowLeft /> Back to Quizzes</Link>

        <div className="form-page-header">
          <h1 className="page-title">{isEdit ? 'Edit Quiz' : 'Create New Quiz'}</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Left column */}
            <div className="form-col-main">
              <div className="form-section card">
                <h3 className="form-section-title">Basic Information</h3>

                <div className="form-group">
                  <label className="form-label">Quiz Title *</label>
                  <input name="title" className="form-input" value={form.title} onChange={handleChange} required placeholder="e.g. JavaScript Fundamentals" />
                </div>

                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea name="description" className="form-textarea" value={form.description} onChange={handleChange} required rows={3} placeholder="Describe what this quiz covers..." />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select name="category" className="form-select" value={form.category} onChange={handleChange}>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Difficulty</label>
                    <select name="difficulty" className="form-select" value={form.difficulty} onChange={handleChange}>
                      {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Tags (comma-separated)</label>
                  <input name="tags" className="form-input" value={form.tags} onChange={handleChange} placeholder="e.g. javascript, es6, async" />
                </div>
              </div>

              <div className="form-section card">
                <h3 className="form-section-title">Quiz Settings</h3>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Duration (minutes) *</label>
                    <input type="number" name="duration" className="form-input" value={form.duration} onChange={handleChange} min={1} max={180} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Passing Marks</label>
                    <input type="number" name="passingMarks" className="form-input" value={form.passingMarks} onChange={handleChange} min={0} />
                  </div>
                </div>

                <div className="toggle-group">
                  <label className="toggle-item">
                    <div>
                      <div className="toggle-label">Negative Marking</div>
                      <div className="toggle-desc">Deduct marks for wrong answers</div>
                    </div>
                    <div className="toggle-switch">
                      <input type="checkbox" name="negativeMarking" checked={form.negativeMarking} onChange={handleChange} />
                      <span className="toggle-track" />
                    </div>
                  </label>

                  {form.negativeMarking && (
                    <div className="form-group" style={{ marginLeft: '1rem' }}>
                      <label className="form-label">Deduction per wrong answer</label>
                      <input type="number" name="negativeMarkValue" className="form-input" value={form.negativeMarkValue} onChange={handleChange} min={0.1} max={1} step={0.05} style={{ maxWidth: '120px' }} />
                    </div>
                  )}

                  <label className="toggle-item">
                    <div>
                      <div className="toggle-label">Randomize Questions</div>
                      <div className="toggle-desc">Shuffle question order for each attempt</div>
                    </div>
                    <div className="toggle-switch">
                      <input type="checkbox" name="randomizeQuestions" checked={form.randomizeQuestions} onChange={handleChange} />
                      <span className="toggle-track" />
                    </div>
                  </label>

                  <label className="toggle-item">
                    <div>
                      <div className="toggle-label">Randomize Options</div>
                      <div className="toggle-desc">Shuffle answer options for each question</div>
                    </div>
                    <div className="toggle-switch">
                      <input type="checkbox" name="randomizeOptions" checked={form.randomizeOptions} onChange={handleChange} />
                      <span className="toggle-track" />
                    </div>
                  </label>

                  <label className="toggle-item">
                    <div>
                      <div className="toggle-label">Publish Quiz</div>
                      <div className="toggle-desc">Make quiz visible to students</div>
                    </div>
                    <div className="toggle-switch">
                      <input type="checkbox" name="isPublished" checked={form.isPublished} onChange={handleChange} />
                      <span className="toggle-track" />
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="form-col-sidebar">
              <div className="form-section card">
                <h3 className="form-section-title">Save Quiz</h3>
                <div className="save-info">
                  <div className="save-info-item">
                    <span>Status</span>
                    <span className={`badge ${form.isPublished ? 'badge-success' : 'badge-secondary'}`}>
                      {form.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <div className="save-info-item">
                    <span>Category</span>
                    <span>{form.category}</span>
                  </div>
                  <div className="save-info-item">
                    <span>Duration</span>
                    <span>{form.duration} min</span>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={saving}>
                  {saving ? <><span className="spinner" /> Saving...</> : <><FiSave /> {isEdit ? 'Update Quiz' : 'Create Quiz'}</>}
                </button>
                <Link to="/admin/quizzes" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
