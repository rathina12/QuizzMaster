import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiCalendar, FiEdit2, FiSave, FiX } from 'react-icons/fi';
import { getProfile } from '../store/slices/authSlice';
import api from '../utils/api';
import { formatDate, getScoreColor } from '../utils/helpers';
import './Profile.css';

export default function Profile() {
  const dispatch = useDispatch();
  const { user, profileData } = useSelector(s => s.auth);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => { dispatch(getProfile()); }, [dispatch]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/auth/profile', { name });
      dispatch(getProfile());
      toast.success('Profile updated!');
      setEditing(false);
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const stats = profileData?.stats || { totalAttempts: 0, avgScore: 0, highestScore: 0 };
  const displayUser = profileData || user;

  return (
    <div className="profile-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">My Profile</h1>
        </div>

        <div className="profile-grid">
          {/* Profile card */}
          <div className="profile-card card">
            <div className="profile-avatar-large">
              {displayUser?.name[0]?.toUpperCase()}
            </div>
            <div className="profile-name-row">
              {editing ? (
                <div style={{ width: '100%' }}>
                  <input
                    className="form-input"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    autoFocus
                    style={{ textAlign: 'center', marginBottom: '0.5rem' }}
                  />
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
                      <FiSave /> {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => { setEditing(false); setName(user?.name); }}>
                      <FiX /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="profile-name">{displayUser?.name}</h2>
                  <button className="icon-btn" onClick={() => setEditing(true)} title="Edit name">
                    <FiEdit2 />
                  </button>
                </>
              )}
            </div>

            <span className={`badge ${displayUser?.role === 'admin' ? 'badge-primary' : 'badge-secondary'}`} style={{ marginBottom: '1.25rem' }}>
              {displayUser?.role}
            </span>

            <div className="profile-info-list">
              <div className="profile-info-item">
                <FiMail className="info-icon" />
                <div>
                  <div className="info-key">Email</div>
                  <div className="info-val">{displayUser?.email}</div>
                </div>
              </div>
              <div className="profile-info-item">
                <FiCalendar className="info-icon" />
                <div>
                  <div className="info-key">Member Since</div>
                  <div className="info-val">{formatDate(displayUser?.createdAt)}</div>
                </div>
              </div>
              <div className="profile-info-item">
                <FiUser className="info-icon" />
                <div>
                  <div className="info-key">Account Type</div>
                  <div className="info-val" style={{ textTransform: 'capitalize' }}>{displayUser?.role}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div>
            <div className="profile-stats-grid">
              <div className="profile-stat card">
                <div className="profile-stat-val">{stats.totalAttempts}</div>
                <div className="profile-stat-label">Quizzes Attempted</div>
                <div className="profile-stat-bar">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${Math.min(stats.totalAttempts * 5, 100)}%` }} />
                  </div>
                </div>
              </div>
              <div className="profile-stat card">
                <div className="profile-stat-val" style={{ color: getScoreColor(stats.avgScore) }}>{stats.avgScore}%</div>
                <div className="profile-stat-label">Average Score</div>
                <div className="profile-stat-bar">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${stats.avgScore}%` }} />
                  </div>
                </div>
              </div>
              <div className="profile-stat card">
                <div className="profile-stat-val" style={{ color: getScoreColor(stats.highestScore) }}>{stats.highestScore}%</div>
                <div className="profile-stat-label">Best Score</div>
                <div className="profile-stat-bar">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${stats.highestScore}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Performance summary */}
            <div className="perf-card card">
              <h3 className="perf-title">Performance Overview</h3>
              <div className="perf-body">
                {stats.totalAttempts === 0 ? (
                  <div className="empty-state" style={{ padding: '2rem 1rem' }}>
                    <div className="empty-state-icon">📈</div>
                    <div className="empty-state-title">No data yet</div>
                    <div className="empty-state-desc">Take some quizzes to see your performance here</div>
                  </div>
                ) : (
                  <div className="perf-grid">
                    <div className="perf-item">
                      <span className="perf-label">Total attempts</span>
                      <span className="perf-value">{stats.totalAttempts}</span>
                    </div>
                    <div className="perf-item">
                      <span className="perf-label">Average score</span>
                      <span className="perf-value" style={{ color: getScoreColor(stats.avgScore) }}>{stats.avgScore}%</span>
                    </div>
                    <div className="perf-item">
                      <span className="perf-label">Best performance</span>
                      <span className="perf-value" style={{ color: getScoreColor(stats.highestScore) }}>{stats.highestScore}%</span>
                    </div>
                    <div className="perf-item">
                      <span className="perf-label">Performance level</span>
                      <span className="perf-value">
                        {stats.avgScore >= 80 ? '🌟 Excellent' : stats.avgScore >= 60 ? '👍 Good' : stats.avgScore >= 40 ? '📚 Average' : '💪 Needs Work'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
