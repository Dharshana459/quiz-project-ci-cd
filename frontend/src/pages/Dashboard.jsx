import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quizAPI } from '../services/api';
import Loader from '../components/Loader';
import { FaPlay, FaClock, FaQuestionCircle, FaLayerGroup } from 'react-icons/fa';

const Dashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const { data } = await quizAPI.getQuizzes();
        setQuizzes(data);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  if (loading) return <Loader fullPage />;

  return (
    <div style={{ paddingTop: '2rem' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          Available <span className="text-gradient">Quizzes</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Choose a quiz and test your knowledge</p>
      </div>
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/results" className="btn-outline" style={{ textDecoration: 'none', padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>
          📊 View My Scores
        </Link>
      </div>
      {quizzes.length === 0 ? (
        <div className="glass" style={{ padding: '4rem', textAlign: 'center' }}>
          <FaQuestionCircle size={48} color="var(--text-muted)" />
          <h3 style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>No quizzes available yet</h3>
        </div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
          {quizzes.map((quiz) => (
            <QuizCard key={quiz._id} quiz={quiz} />
          ))}
        </div>
      )}
    </div>
  );
};

const QuizCard = ({ quiz }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="glass" style={{
      padding: '2rem', transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden',
      transform: hovered ? 'translateY(-8px)' : 'none',
      boxShadow: hovered ? '0 20px 40px rgba(139,92,246,0.2)' : 'none'
    }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--gradient-main)' }} />
      <span style={{ background: 'rgba(139,92,246,0.2)', color: 'var(--primary)', padding: '0.3rem 0.8rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 600 }}>
        <FaLayerGroup style={{ marginRight: '0.3rem' }} />{quiz.category}
      </span>
      <h3 style={{ fontSize: '1.4rem', margin: '1rem 0 0.75rem' }}>{quiz.title}</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>{quiz.description}</p>
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        <span className="flex" style={{ gap: '0.4rem' }}><FaQuestionCircle color="var(--secondary)" /> {quiz.questionCount || 0} Qs</span>
        <span className="flex" style={{ gap: '0.4rem' }}><FaClock color="var(--accent)" /> {quiz.timeLimit} min</span>
      </div>
      <Link to={`/quiz/${quiz._id}`} className="btn-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.75rem' }}>
        <FaPlay /> Start Quiz
      </Link>
    </div>
  );
};

export default Dashboard;
