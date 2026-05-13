import React from 'react';

const Loader = ({ fullPage = false }) => {
  const style = fullPage ? {
    height: '100vh',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  } : {
    padding: '2rem',
    display: 'flex',
    justifyContent: 'center'
  };

  return (
    <div style={style}>
      <div className="loader-spinner"></div>
      <style>{`
        .loader-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(139, 92, 246, 0.1);
          border-left-color: var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loader;
