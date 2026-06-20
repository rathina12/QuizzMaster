import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FiSearch, FiUserCheck, FiUserX } from 'react-icons/fi';
import api from '../../utils/api';
import { formatDate } from '../../utils/helpers';
import './AdminUsers.css';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ total: 0, pages: 1, page: 1 });

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (search) params.append('search', search);
      const res = await api.get(`/admin/users?${params}`);
      setUsers(res.data.users);
      setPagination(res.data.pagination);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => {
    const t = setTimeout(() => fetchUsers(1), 350);
    return () => clearTimeout(t);
  }, [search]);

  const toggleUser = async (user) => {
    try {
      await api.put(`/admin/users/${user._id}/toggle`);
      toast.success(`User ${user.isActive ? 'deactivated' : 'activated'}`);
      fetchUsers(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  return (
    <div className="admin-users-page">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1 className="page-title">Manage Users</h1>
            <p className="page-subtitle">{pagination.total} registered users</p>
          </div>
        </div>

        {/* Search */}
        <div className="users-search card">
          <div style={{ position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.25rem' }}
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="card" style={{ padding: '1rem' }}>
            {[1,2,3,4,5].map(i => <div key={i} className="skeleton" style={{ height: '52px', borderRadius: '8px', marginBottom: '0.5rem' }} />)}
          </div>
        ) : (
          <div className="users-table-wrap card">
            <table className="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Attempts</th>
                  <th>Avg Score</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-cell-avatar">{user.name[0].toUpperCase()}</div>
                        <div>
                          <div className="user-cell-name">{user.name}</div>
                          <div className="user-cell-email">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-secondary'}`}>{user.role}</span>
                    </td>
                    <td className="text-center">{user.attempts}</td>
                    <td className="text-center">
                      <span style={{ color: user.avgScore >= 60 ? 'var(--success)' : user.avgScore >= 40 ? 'var(--warning)' : 'var(--danger)', fontWeight: 600 }}>
                        {user.avgScore}%
                      </span>
                    </td>
                    <td className="text-sm text-muted">{formatDate(user.createdAt)}</td>
                    <td>
                      <span className={`badge ${user.isActive ? 'badge-success' : 'badge-danger'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      {user.role !== 'admin' && (
                        <button
                          className={`action-btn ${user.isActive ? 'danger' : ''}`}
                          title={user.isActive ? 'Deactivate' : 'Activate'}
                          onClick={() => toggleUser(user)}
                        >
                          {user.isActive ? <FiUserX /> : <FiUserCheck />}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {users.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">👥</div>
                <div className="empty-state-title">No users found</div>
              </div>
            )}

            {pagination.pages > 1 && (
              <div className="pagination" style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border)', justifyContent: 'flex-end' }}>
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                  <button key={p} className={`page-btn ${pagination.page === p ? 'active' : ''}`} onClick={() => fetchUsers(p)}>
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
