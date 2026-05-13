import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { scoreAPI } from '../../services/api';
import Loader from '../../components/Loader';
import { FaUsers, FaBook, FaHistory, FaPercentage, FaArrowRight, FaPlus } from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await scoreAPI.getAdminStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching admin stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader fullPage />;

  return (
    <div style={{ paddingTop: '2rem' }}>
      <div className="flex" style={{ justifyContent: 'space-between', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Admin <span className="text-gradient">Dashboard</span></h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your platform and track user performance</p>
        </div>
        <Link to="/admin/quizzes" className="btn-primary flex" style={{ gap: '0.5rem', textDecoration: 'none' }}>
          <FaPlus /> Manage Quizzes
        </Link>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
        <StatCard icon={<FaUsers size={24} color="var(--primary)" />} label="Total Users" value={stats.totalUsers} />
        <StatCard icon={<FaBook size={24} color="var(--secondary)" />} label="Total Quizzes" value={stats.totalQuizzes} />
        <StatCard icon={<FaHistory size={24} color="var(--accent)" />} label="Quiz Attempts" value={stats.totalAttempts} />
        <StatCard icon={<FaPercentage size={24} color="#22c55e" />} label="Avg. Score" value={`${stats.avgScore}%`} />
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr', gap: '2rem' }}>
        <div className="glass" style={{ padding: '2rem' }}>
          <div className="flex" style={{ justifyContent: 'space-between', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.4rem' }}>Recent <span className="text-gradient">Activity</span></h3>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Last 10 submissions</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem' }}>User</th>
                  <th style={{ padding: '1rem' }}>Quiz</th>
                  <th style={{ padding: '1rem' }}>Score</th>
                  <th style={{ padding: '1rem' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentScores.map((score) => (
                  <tr key={score._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '1.25rem' }}>
                      <div style={{ fontWeight: '600' }}>{score.userId?.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{score.userId?.email}</div>
                    </td>
                    <td style={{ padding: '1.25rem' }}>{score.quizId?.title}</td>
                    <td style={{ padding: '1.25rem' }}>
                      <span style={{ 
                        color: score.percentage >= 70 ? '#22c55e' : 'var(--accent)',
                        fontWeight: '700'
                      }}>
                        {score.percentage}%
                      </span>
                    </td>
                    <td style={{ padding: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      {new Date(score.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="glass" style={{ padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
    <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem' }}>
      {icon}
    </div>
    <div>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>{value}</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{label}</p>
    </div>
  </div>
);

export default AdminDashboard;
