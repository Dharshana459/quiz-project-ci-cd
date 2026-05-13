import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { questionAPI, quizAPI } from '../../services/api';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { FaTrash, FaPlus, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';

const ManageQuestions = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    questionText: '',
    options: [
      { text: '', isCorrect: true },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ]
  });

  const fetchData = async () => {
    try {
      const [quizRes, qRes] = await Promise.all([
        quizAPI.getQuiz(quizId),
        questionAPI.getQuestions(quizId)
      ]);
      setQuiz(quizRes.data);
      setQuestions(qRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [quizId]);

  const handleOptionChange = (idx, text) => {
    const newOptions = [...formData.options];
    newOptions[idx].text = text;
    setFormData({ ...formData, options: newOptions });
  };

  const handleCorrectSelect = (idx) => {
    const newOptions = formData.options.map((opt, i) => ({
      ...opt,
      isCorrect: i === idx
    }));
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.options.some(opt => !opt.text)) {
      toast.error('Please fill all options');
      return;
    }
    try {
      await questionAPI.createQuestion(quizId, formData);
      toast.success('Question added');
      setShowModal(false);
      setFormData({
        questionText: '',
        options: [
          { text: '', isCorrect: true },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ]
      });
      fetchData();
    } catch (error) {
      toast.error('Failed to add question');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this question?')) {
      try {
        await questionAPI.deleteQuestion(id);
        toast.success('Question deleted');
        fetchData();
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  if (loading) return <Loader fullPage />;

  return (
    <div style={{ paddingTop: '2rem' }}>
      <div className="flex" style={{ justifyContent: 'space-between', marginBottom: '3rem' }}>
        <div className="flex" style={{ gap: '1.5rem' }}>
          <Link to="/admin/quizzes" style={{ color: 'var(--text-muted)' }}><FaArrowLeft size={20} /></Link>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Manage <span className="text-gradient">Questions</span></h1>
            <p style={{ color: 'var(--text-muted)' }}>Quiz: {quiz?.title}</p>
          </div>
        </div>
        <button className="btn-primary flex" style={{ gap: '0.5rem' }} onClick={() => setShowModal(true)}>
          <FaPlus /> Add Question
        </button>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {questions.length === 0 ? (
          <div className="glass" style={{ padding: '4rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)' }}>No questions added to this quiz yet.</p>
          </div>
        ) : (
          questions.map((q, qIdx) => (
            <div key={q._id} className="glass" style={{ padding: '2rem' }}>
              <div className="flex" style={{ justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
                <h4 style={{ fontSize: '1.2rem', flex: 1, paddingRight: '2rem' }}>
                  <span style={{ color: 'var(--primary)', marginRight: '0.5rem' }}>Q{qIdx + 1}.</span>
                  {q.questionText}
                </h4>
                <button onClick={() => handleDelete(q._id)} style={{ color: 'var(--accent)', background: 'none' }}>
                  <FaTrash />
                </button>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {q.options.map((opt, oIdx) => (
                  <div key={oIdx} style={{ 
                    padding: '1rem', 
                    background: opt.isCorrect ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${opt.isCorrect ? 'rgba(34, 197, 94, 0.3)' : 'var(--glass-border)'}`,
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    {opt.isCorrect && <FaCheckCircle color="#22c55e" />}
                    <span style={{ fontSize: '0.9rem', color: opt.isCorrect ? '#fff' : 'var(--text-muted)' }}>{opt.text}</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
          <div className="glass" style={{ padding: '3rem', width: '90%', maxWidth: '600px' }}>
            <h2 style={{ marginBottom: '2rem' }}>Add <span className="text-gradient">Question</span></h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Question Text</label>
                <textarea 
                  value={formData.questionText} 
                  onChange={e => setFormData({...formData, questionText: e.target.value})} 
                  required 
                  style={{ width: '100%', minHeight: '80px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', padding: '1rem', borderRadius: '0.5rem' }} 
                />
              </div>
              
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '1rem', color: 'var(--text-muted)' }}>Options (Select the correct one)</label>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {formData.options.map((opt, idx) => (
                    <div key={idx} className="flex" style={{ gap: '1rem' }}>
                      <input 
                        type="radio" 
                        name="correct" 
                        checked={opt.isCorrect} 
                        onChange={() => handleCorrectSelect(idx)} 
                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                      />
                      <input 
                        type="text" 
                        value={opt.text} 
                        onChange={e => handleOptionChange(idx, e.target.value)} 
                        placeholder={`Option ${idx + 1}`} 
                        required 
                        style={{ flex: 1 }} 
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex" style={{ gap: '1rem' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Add Question</button>
                <button type="button" className="btn-outline" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageQuestions;
