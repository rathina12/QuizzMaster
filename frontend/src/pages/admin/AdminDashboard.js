import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiFileText, FiBarChart2, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import { MdQuiz } from 'react-icons/md';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import api from '../../utils/api';
import './AdminDashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler);

const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
    y: { grid: { color: 'rgba(148,163,184,0.1)' }, ticks: { color: '#94a3b8' } }
  }
};

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/analytics').then(res => setAnalytics(res.data.analytics)).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div className="admin-skeleton-grid">
        {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: '120px', borderRadius: '12px' }} />)}
      </div>
      <div className="skeleton" style={{ height: '300px', borderRadius: '12px', marginTop: '1rem' }} />
    </div>
  );

  const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const categoryChartData = {
    labels: analytics?.categoryData?.map(c => c._id) || [],
    datasets: [{
      data: analytics?.categoryData?.map(c => c.count) || [],
      backgroundColor: COLORS,
      borderWidth: 0,
    }]
  };

  const dailyChartData = {
    labels: analytics?.dailyAttempts?.map(d => d._id) || [],
    datasets: [{
      label: 'Attempts',
      data: analytics?.dailyAttempts?.map(d => d.count) || [],
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99,102,241,0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#6366f1',
      pointRadius: 4,
    }]
  };

  const scoreDistData = {
    labels: analytics?.scoreDistribution?.map(s => s.range) || [],
    datasets: [{
      label: 'Students',
      data: analytics?.scoreDistribution?.map(s => s.count) || [],
      backgroundColor: COLORS,
      borderRadius: 6,
      borderSkipped: false,
    }]
  };

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="page-subtitle">Platform overview and analytics</p>
          </div>
          <div className="admin-quick-actions">
            <Link to="/admin/quizzes/new" className="btn btn-primary btn-sm">+ New Quiz</Link>
            <Link to="/admin/users" className="btn btn-secondary btn-sm">Manage Users</Link>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="kpi-grid">
          <div className="kpi-card card">
            <div className="kpi-icon" style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--primary)' }}><FiUsers /></div>
            <div>
              <div className="kpi-val">{analytics?.totalUsers}</div>
              <div className="kpi-label">Total Users</div>
            </div>
          </div>
          <div className="kpi-card card">
            <div className="kpi-icon" style={{ background: 'rgba(6,182,212,0.1)', color: 'var(--secondary)' }}><MdQuiz /></div>
            <div>
              <div className="kpi-val">{analytics?.totalQuizzes}</div>
              <div className="kpi-label">Total Quizzes</div>
            </div>
          </div>
          <div className="kpi-card card">
            <div className="kpi-icon" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--success)' }}><FiFileText /></div>
            <div>
              <div className="kpi-val">{analytics?.totalAttempts}</div>
              <div className="kpi-label">Total Attempts</div>
            </div>
          </div>
          <div className="kpi-card card">
            <div className="kpi-icon" style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--accent)' }}><FiBarChart2 /></div>
            <div>
              <div className="kpi-val">{analytics?.avgScore}%</div>
              <div className="kpi-label">Avg. Score</div>
            </div>
          </div>
        </div>

        {/* Charts row 1 */}
        <div className="charts-grid-2">
          <div className="chart-card card">
            <h3 className="chart-title">Attempts (Last 7 Days)</h3>
            <div className="chart-wrap">
              <Line data={dailyChartData} options={{ ...chartDefaults, plugins: { legend: { display: false } } }} />
            </div>
          </div>
          <div className="chart-card card">
            <h3 className="chart-title">Quizzes by Category</h3>
            <div className="chart-wrap doughnut-wrap">
              <Doughnut data={categoryChartData} options={{
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { position: 'right', labels: { color: '#94a3b8', padding: 12, font: { size: 11 } } } },
                cutout: '60%'
              }} />
            </div>
          </div>
        </div>

        {/* Charts row 2 */}
        <div className="charts-grid-2">
          <div className="chart-card card">
            <h3 className="chart-title">Score Distribution</h3>
            <div className="chart-wrap">
              <Bar data={scoreDistData} options={chartDefaults} />
            </div>
          </div>

          <div className="chart-card card">
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
              <h3 className="chart-title" style={{ margin: 0 }}>Top Quizzes</h3>
              <Link to="/admin/quizzes" className="text-sm text-primary">View All <FiArrowRight style={{ display: 'inline' }} /></Link>
            </div>
            <div className="top-quizzes-list">
              {analytics?.topQuizzes?.map((quiz, i) => (
                <div key={quiz._id} className="top-quiz-item">
                  <div className="top-quiz-rank">#{i + 1}</div>
                  <div className="top-quiz-info">
                    <div className="top-quiz-name">{quiz.title}</div>
                    <div className="top-quiz-meta">{quiz.category} · {quiz.attemptCount} attempts</div>
                  </div>
                  <div className="top-quiz-bar-wrap">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${Math.min((quiz.attemptCount / (analytics?.topQuizzes?.[0]?.attemptCount || 1)) * 100, 100)}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
