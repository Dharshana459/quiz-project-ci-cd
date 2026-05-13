import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaGraduationCap, FaUserCircle, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass" style={{ margin: '1rem', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: '1rem', zIndex: 1000 }}>
      <Link to="/" className="flex" style={{ textDecoration: 'none', gap: '0.5rem' }}>
        <FaGraduationCap size={32} color="var(--primary)" />
        <span className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: '800' }}>QuizMaster</span>
      </Link>

      <div className="flex" style={{ gap: '1.5rem' }}>
        {user ? (
          <>
            <Link to="/dashboard" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: '500' }}>Dashboard</Link>
            {isAdmin && (
              <Link to="/admin" style={{ color: 'var(--secondary)', textDecoration: 'none', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FaTachometerAlt /> Admin
              </Link>
            )}
            <div className="flex" style={{ gap: '1rem', marginLeft: '1rem', borderLeft: '1px solid var(--glass-border)', paddingLeft: '1.5rem' }}>
              <div className="flex" style={{ gap: '0.5rem' }}>
                <FaUserCircle size={20} color="var(--text-muted)" />
                <span style={{ fontSize: '0.9rem' }}>{user.name}</span>
              </div>
              <button onClick={handleLogout} className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'var(--text-main)', textDecoration: 'none' }}>Login</Link>
            <Link to="/register" className="btn-primary" style={{ textDecoration: 'none' }}>Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
