import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { scoreAPI } from '../services/api';
import Loader from '../components/Loader';
import { FaTrophy, FaHistory, FaChevronRight, FaTimesCircle, FaCheckCircle } from 'react-icons/fa';

const Results = () => {
  const location = useLocation();
  const latestScore = location.state?.latestScore;
  
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await scoreAPI.getMyScores();
        setHistory(data);
      } catch (error) {
        console.error('Error fetching scores');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <Loader fullPage />;

  return (
    <div style={{ paddingTop: '2rem' }}>
      {latestScore && (
        <section style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <div className="glass" style={{ padding: '4rem', maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
            <div style={{ 
              position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)',
              width: '80px', height: '80px', borderRadius: '50%', background: 'var(--gradient-main)',
              display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 10px 20px rgba(139,92,246,0.4)'
            }}>
              <FaTrophy size={40} color="white" />
            </div>
            
            <h1 style={{ marginTop: '1rem', fontSize: '2.5rem' }}>Quiz <span className="text-gradient">Completed!</span></h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{latestScore.quizId?.title}</p>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginBottom: '3rem' }}>
              <div>
                <p style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--primary)' }}>{latestScore.score}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Correct</p>
              </div>
              <div style={{ width: '1px', background: 'var(--glass-border)' }}></div>
              <div>
                <p style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--secondary)' }}>{latestScore.percentage}%</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Score</p>
              </div>
            </div>

            <Link to="/dashboard" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
              Take More Quizzes
            </Link>
          </div>
        </section>
      )}

      <section>
        <div className="flex" style={{ gap: '1rem', marginBottom: '2rem' }}>
          <FaHistory size={24} color="var(--primary)" />
          <h2 style={{ fontSize: '1.8rem' }}>Your Score <span className="text-gradient">History</span></h2>
        </div>

        {history.length === 0 ? (
          <div className="glass" style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)' }}>You haven't taken any quizzes yet.</p>
          </div>
        ) : (
          <div className="grid" style={{ gridTemplateColumns: '1fr' }}>
            {history.map((item) => (
              <div key={item._id} className="glass" style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="flex" style={{ gap: '2rem' }}>
                  <div style={{ 
                    width: '60px', height: '60px', borderRadius: '12px', 
                    background: item.percentage >= 70 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    border: `1px solid ${item.percentage >= 70 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(244, 63, 94, 0.2)'}`
                  }}>
                    {item.percentage >= 70 ? <FaCheckCircle color="#22c55e" size={24} /> : <FaTimesCircle color="#f43f5e" size={24} />}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{item.quizId?.title}</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {new Date(item.createdAt).toLocaleDateString()} • {item.quizId?.category}
                    </p>
                  </div>
                </div>
                
                <div className="flex" style={{ gap: '3rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: '700', fontSize: '1.2rem' }}>{item.score}/{item.totalQuestions}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Questions</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: '800', fontSize: '1.4rem', color: item.percentage >= 70 ? '#22c55e' : 'var(--accent)' }}>
                      {item.percentage}%
                    </p>
                  </div>
                  <FaChevronRight color="var(--glass-border)" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Results;
