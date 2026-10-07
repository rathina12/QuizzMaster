import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiArrowRight, FiArrowUpRight, FiCheckCircle, FiClock, FiCompass, FiTarget, FiTrendingUp, FiZap } from 'react-icons/fi';
import api from '../utils/api';
import QuizCard from '../components/quiz/QuizCard';
import '../components/quiz/QuizCard.css';
import './Home.css';

const BENEFITS = [
  { icon: <FiTarget />, number: '01', title: 'Practice with purpose', text: 'Build confidence one question at a time with topic-focused challenges.' },
  { icon: <FiClock />, number: '02', title: 'Get into exam mode', text: 'Train your focus with timed attempts and a clear question navigator.' },
  { icon: <FiTrendingUp />, number: '03', title: 'Understand your progress', text: 'Review scores, revisit mistakes, and track improvement across attempts.' }
];

export default function Home() {
  const { user } = useSelector(s => s.auth);
  const [quizzes, setQuizzes] = useState([]);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    api.get('/quizzes?limit=3')
      .then(({ data }) => {
        if (!alive) return;
        setQuizzes(data.quizzes || []);
        setTotal(data.pagination?.total ?? null);
      })
      .catch(() => { if (alive) setError(true); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  return (
    <div className="home home-v2">
      <section className="hero hero-v2">
        <div className="container hero-v2-grid">
          <div className="hero-v2-copy">
            <div className="hero-kicker"><span className="kicker-dot" /> YOUR DAILY LEARNING WORKSPACE</div>
            <h1>Make your next <span>answer</span> your best one.</h1>
            <p>Focused quizzes, meaningful feedback, and measurable progress. Less scrolling, more learning.</p>
            <div className="hero-actions">
              <Link to="/quizzes" className="btn btn-primary btn-lg">Explore quizzes <FiArrowRight /></Link>
              <Link to={user ? '/dashboard' : '/register'} className="btn btn-secondary btn-lg">{user ? 'My dashboard' : 'Create free account'} <FiArrowUpRight /></Link>
            </div>
            <div className="hero-proof"><FiCheckCircle /> Free to get started <span>•</span> Instant results <span>•</span> Learn at your pace</div>
          </div>
          <div className="hero-v2-visual" aria-label="QuizMaster learning preview">
            <div className="visual-top"><span className="visual-live"><span /> PRACTICE SESSION</span><span className="visual-step">01 / 04</span></div>
            <div className="visual-eyebrow">QUICK CHALLENGE · PROGRAMMING</div>
            <h2>Every great skill starts with one good question.</h2>
            <div className="visual-answer"><span>A</span> Show up consistently <FiCheckCircle /></div>
            <div className="visual-answer visual-answer-muted"><span>B</span> Wait until you feel ready</div>
            <div className="visual-answer visual-answer-muted"><span>C</span> Memorize everything at once</div>
            <div className="visual-bottom"><span><FiZap /> Keep your momentum</span><span>Learning is a process <FiArrowRight /></span></div>
            <div className="visual-orb" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className="home-signal">
        <div className="container home-signal-inner">
          <div><FiCompass /><span>Explore skills, not just scores.</span></div>
          <div>{total === null ? 'Browse the question library' : `${total} available ${total === 1 ? 'quiz' : 'quizzes'}`} <FiArrowUpRight /></div>
        </div>
      </section>

      <section className="section home-featured">
        <div className="container">
          <div className="section-header">
            <div><div className="home-section-kicker">CURATED FOR YOU</div><h2 className="section-title">Find your next challenge<span>.</span></h2><p className="section-subtitle">Choose a topic. Test what you know. See what to learn next.</p></div>
            <Link to="/quizzes" className="btn btn-outline">Browse all quizzes <FiArrowRight /></Link>
          </div>
          {error ? <div className="home-feedback" role="alert">Quizzes couldn't be loaded right now. <button type="button" onClick={() => window.location.reload()}>Try again</button></div> :
          !loading && quizzes.length === 0 ? <div className="home-feedback">No published quizzes yet. Check back when new challenges are added.</div> :
          <div className="grid grid-3">{loading ? [1, 2, 3].map(i => <QuizCard key={i} skeleton />) : quizzes.map(quiz => <QuizCard key={quiz._id} quiz={quiz} />)}</div>}
        </div>
      </section>

      <section className="section home-benefits">
        <div className="container">
          <div className="home-section-kicker">THE BETTER WAY TO PRACTICE</div>
          <h2 className="section-title">Small sessions. Real progress<span>.</span></h2>
          <div className="home-benefit-grid">{BENEFITS.map(item => <article className="home-benefit" key={item.number}><div className="home-benefit-head"><span>{item.number} / 03</span><span className="home-benefit-icon">{item.icon}</span></div><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
        </div>
      </section>

      <section className="container home-bottom-wrap">
        <div className="home-bottom-cta">
          <div><div className="home-section-kicker">YOUR NEXT STEP</div><h2>Ready when you are.</h2><p>Your next breakthrough could be one question away.</p></div>
          <Link to={user ? '/quizzes' : '/register'} className="btn btn-primary btn-lg">{user ? 'Start practicing' : 'Start learning free'} <FiArrowRight /></Link>
        </div>
      </section>
    </div>
  );
}
