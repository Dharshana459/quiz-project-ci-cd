import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizAPI, questionAPI, scoreAPI } from '../services/api';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { FaClock, FaChevronLeft, FaChevronRight, FaCheckCircle } from 'react-icons/fa';

const QuizAttempt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const submitQuiz = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const formattedAnswers = Object.entries(answers).map(([qId, optIdx]) => ({
        questionId: qId,
        selectedOption: optIdx
      }));
      
      const { data } = await scoreAPI.submitQuiz({
        quizId: id,
        answers: formattedAnswers,
        timeTaken: (quiz.timeLimit * 60) - timeLeft
      });
      
      toast.success('Quiz submitted successfully!');
      navigate('/results', { state: { latestScore: data } });
    } catch (error) {
      toast.error('Failed to submit quiz');
      setSubmitting(false);
    }
  }, [answers, id, navigate, quiz, timeLeft, submitting]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizRes, qRes] = await Promise.all([
          quizAPI.getQuiz(id),
          questionAPI.getQuestions(id)
        ]);
        setQuiz(quizRes.data);
        setQuestions(qRes.data);
        setTimeLeft(quizRes.data.timeLimit * 60);
      } catch (error) {
        toast.error('Error loading quiz');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  useEffect(() => {
    if (timeLeft <= 0 && !loading && quiz) {
      submitQuiz();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, loading, quiz, submitQuiz]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (optIdx) => {
    setAnswers({ ...answers, [questions[currentIdx]._id]: optIdx });
  };

  if (loading) return <Loader fullPage />;

  const currentQuestion = questions[currentIdx];
  const progress = ((currentIdx + 1) / questions.length) * 100;

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <div className="flex" style={{ justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem' }}>{quiz?.title}</h2>
          <p style={{ color: 'var(--text-muted)' }}>Question {currentIdx + 1} of {questions.length}</p>
        </div>
        <div className="glass flex" style={{ padding: '0.75rem 1.5rem', gap: '0.75rem', color: timeLeft < 60 ? 'var(--accent)' : 'var(--secondary)' }}>
          <FaClock />
          <span style={{ fontSize: '1.2rem', fontWeight: '700', fontFamily: 'monospace' }}>{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginBottom: '3rem' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: 'var(--gradient-main)', borderRadius: '3px', transition: 'width 0.3s ease' }}></div>
      </div>

      <div className="glass" style={{ padding: '3rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.4rem', marginBottom: '2rem', lineHeight: '1.5' }}>{currentQuestion?.questionText}</h3>
        
        <div style={{ display: 'grid', gap: '1rem' }}>
          {currentQuestion?.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionSelect(idx)}
              style={{
                textAlign: 'left',
                padding: '1.25rem',
                borderRadius: '0.75rem',
                background: answers[currentQuestion._id] === idx ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${answers[currentQuestion._id] === idx ? 'var(--primary)' : 'var(--glass-border)'}`,
                color: 'white',
                fontSize: '1rem',
                transition: 'var(--transition)'
              }}
            >
              <span style={{ 
                display: 'inline-block', 
                width: '30px', 
                height: '30px', 
                borderRadius: '50%', 
                background: answers[currentQuestion._id] === idx ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                textAlign: 'center',
                lineHeight: '30px',
                marginRight: '1rem',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}>
                {String.fromCharCode(65 + idx)}
              </span>
              {opt.text}
            </button>
          ))}
        </div>
      </div>

      <div className="flex" style={{ justifyContent: 'space-between' }}>
        <button 
          className="btn-outline flex" 
          style={{ gap: '0.5rem', opacity: currentIdx === 0 ? 0.5 : 1, pointerEvents: currentIdx === 0 ? 'none' : 'auto' }}
          onClick={() => setCurrentIdx(prev => prev - 1)}
        >
          <FaChevronLeft /> Previous
        </button>

        {currentIdx === questions.length - 1 ? (
          <button className="btn-primary flex" style={{ gap: '0.5rem' }} onClick={submitQuiz} disabled={submitting}>
            {submitting ? 'Submitting...' : <><FaCheckCircle /> Finish Quiz</>}
          </button>
        ) : (
          <button className="btn-primary flex" style={{ gap: '0.5rem' }} onClick={() => setCurrentIdx(prev => prev + 1)}>
            Next <FaChevronRight />
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizAttempt;
