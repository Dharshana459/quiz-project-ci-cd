import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlay, FaShieldAlt, FaChartLine, FaRocket } from 'react-icons/fa';

const Home = () => {
  return (
    <div style={{ paddingTop: '4rem' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', marginBottom: '6rem' }}>
        <h1 style={{ fontSize: '4.5rem', marginBottom: '1.5rem', lineHeight: '1.1' }}>
          Master Your Skills with <br />
          <span className="text-gradient">Interactive Quizzes</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto 3rem', lineHeight: '1.6' }}>
          The ultimate platform to test your knowledge, track your progress, and compete with others. 
          From Programming to General Knowledge, we've got it all.
        </p>
        <div className="flex" style={{ justifyContent: 'center', gap: '1.5rem' }}>
          <Link to="/register" className="btn-primary" style={{ textDecoration: 'none', padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
            Get Started Now
          </Link>
          <Link to="/login" className="btn-outline" style={{ textDecoration: 'none', padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
            Existing User? Login
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        <FeatureCard 
          icon={<FaRocket color="var(--primary)" size={30} />}
          title="Instant Feedback"
          description="Get your scores and detailed performance analysis immediately after finishing a quiz."
        />
        <FeatureCard 
          icon={<FaShieldAlt color="var(--secondary)" size={30} />}
          title="Role Based Access"
          description="Secure platform with dedicated dashboards for users and powerful management tools for admins."
        />
        <FeatureCard 
          icon={<FaChartLine color="var(--accent)" size={30} />}
          title="Detailed Tracking"
          description="Monitor your growth over time with our comprehensive score history and analytics."
        />
      </section>

      {/* Stats / Social Proof */}
      <section className="glass" style={{ marginTop: '6rem', padding: '4rem', textAlign: 'center', background: 'linear-gradient(rgba(139, 92, 246, 0.05), rgba(6, 182, 212, 0.05))' }}>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div>
            <h2 style={{ fontSize: '3rem', color: 'var(--primary)' }}>50+</h2>
            <p style={{ color: 'var(--text-muted)' }}>Expert Quizzes</p>
          </div>
          <div>
            <h2 style={{ fontSize: '3rem', color: 'var(--secondary)' }}>10k+</h2>
            <p style={{ color: 'var(--text-muted)' }}>Active Learners</p>
          </div>
          <div>
            <h2 style={{ fontSize: '3rem', color: 'var(--accent)' }}>100k+</h2>
            <p style={{ color: 'var(--text-muted)' }}>Questions Answered</p>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="glass" style={{ padding: '2rem', transition: 'var(--transition)', border: '1px solid rgba(255,255,255,0.05)' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
    <div style={{ marginBottom: '1.5rem' }}>{icon}</div>
    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{title}</h3>
    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{description}</p>
  </div>
);

export default Home;
