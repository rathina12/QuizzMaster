import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiArrowRight, FiZap, FiShield, FiTrendingUp, FiUsers } from 'react-icons/fi';
import { MdQuiz, MdLeaderboard, MdTimer } from 'react-icons/md';
import api from '../utils/api';
import QuizCard from '../components/quiz/QuizCard';
import '../components/quiz/QuizCard.css';
import './Home.css';

const STATS = [
  { icon: <MdQuiz />, label: 'Quizzes Available', value: '50+' },
  { icon: <FiUsers />, label: 'Active Learners', value: '1,200+' },
  { icon: <MdLeaderboard />, label: 'Questions', value: '500+' },
  { icon: <FiTrendingUp />, label: 'Categories', value: '7' },
];

const FEATURES = [
  { icon: <MdTimer />, title: 'Timed Challenges', desc: 'Race against the clock with adaptive quiz timers that keep you sharp and focused.' },
  { icon: <FiZap />, title: 'Instant Feedback', desc: 'See your results immediately — right answers, wrong answers, and detailed explanations.' },
  { icon: <MdLeaderboard />, title: 'Track Progress', desc: 'Monitor your performance over time with detailed analytics and history.' },
  { icon: <FiShield />, title: 'Secure & Fair', desc: 'Randomized questions and options ensure every attempt is a fresh, fair challenge.' },
];

export default function Home() {
  const { user } = useSelector(s => s.auth);
  const [featuredQuizzes, setFeaturedQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/quizzes?limit=3').then(res => {
      setFeaturedQuizzes(res.data.quizzes);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-blob blob-1" />
          <div className="hero-blob blob-2" />
          <div className="hero-blob blob-3" />
        </div>
        <div className="container hero-content">
          <div className="hero-badge">
            <FiZap /> New quizzes added weekly
          </div>
          <h1 className="hero-title">
            Test Your Knowledge,<br />
            <span className="gradient-text">Level Up Your Skills</span>
          </h1>
          <p className="hero-subtitle">
            Challenge yourself with expertly crafted quizzes across programming, aptitude, and more. 
            Get instant feedback and track your growth over time.
          </p>
          <div className="hero-actions">
            {user ? (
              <Link to="/quizzes" className="btn btn-primary btn-lg">
                Browse Quizzes <FiArrowRight />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Get Started Free <FiArrowRight />
                </Link>
                <Link to="/quizzes" className="btn btn-secondary btn-lg">
                  Browse Quizzes
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {STATS.map((stat, i) => (
              <div key={i} className="stat-card card fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured quizzes */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Featured Quizzes</h2>
              <p className="section-subtitle">Jump into one of our most popular challenges</p>
            </div>
            <Link to="/quizzes" className="btn btn-outline">
              View All <FiArrowRight />
            </Link>
          </div>
          <div className="grid grid-3">
            {loading
              ? [1, 2, 3].map(i => <QuizCard key={i} skeleton />)
              : featuredQuizzes.map(quiz => <QuizCard key={quiz._id} quiz={quiz} />)
            }
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section features-section">
        <div className="container">
          <div className="section-header" style={{ marginBottom: '2rem' }}>
            <div>
              <h2 className="section-title">Why QuizMaster?</h2>
              <p className="section-subtitle">Everything you need to learn effectively</p>
            </div>
          </div>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="cta-section">
          <div className="container">
            <div className="cta-card card">
              <div className="cta-content">
                <h2>Ready to test your knowledge?</h2>
                <p>Join thousands of learners sharpening their skills on QuizMaster.</p>
                <div className="hero-actions">
                  <Link to="/register" className="btn btn-primary btn-lg">
                    Create Free Account <FiArrowRight />
                  </Link>
                </div>
              </div>
              <div className="cta-decoration">
                <MdQuiz />
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
