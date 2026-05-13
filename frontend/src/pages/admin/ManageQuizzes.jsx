import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quizAPI } from '../../services/api';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus, FaQuestion, FaArrowLeft } from 'react-icons/fa';

const ManageQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    timeLimit: 10
  });

  const fetchQuizzes = async () => {
    try {
      const { data } = await quizAPI.getQuizzes();
      setQuizzes(data);
    } catch (error) {
      toast.error('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingQuiz) {
        await quizAPI.updateQuiz(editingQuiz._id, formData);
        toast.success('Quiz updated');
      } else {
        await quizAPI.createQuiz(formData);
        toast.success('Quiz created');
      }
      setShowModal(false);
      setEditingQuiz(null);
      setFormData({ title: '', description: '', category: '', timeLimit: 10 });
      fetchQuizzes();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure? This will delete all questions and scores for this quiz.')) {
      try {
        await quizAPI.deleteQuiz(id);
        toast.success('Quiz deleted');
        fetchQuizzes();
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  const openEdit = (quiz) => {
    setEditingQuiz(quiz);
    setFormData({
      title: quiz.title,
      description: quiz.description,
      category: quiz.category,
      timeLimit: quiz.timeLimit
    });
    setShowModal(true);
  };

  if (loading) return <Loader fullPage />;

  return (
    <div style={{ paddingTop: '2rem' }}>
      <div className="flex" style={{ justifyContent: 'space-between', marginBottom: '3rem' }}>
        <div className="flex" style={{ gap: '1rem' }}>
          <Link to="/admin" style={{ color: 'var(--text-muted)' }}><FaArrowLeft size={20} /></Link>
          <h1 style={{ fontSize: '2.5rem' }}>Manage <span className="text-gradient">Quizzes</span></h1>
        </div>
        <button className="btn-primary flex" style={{ gap: '0.5rem' }} onClick={() => { setEditingQuiz(null); setFormData({ title: '', description: '', category: '', timeLimit: 10 }); setShowModal(true); }}>
          <FaPlus /> New Quiz
        </button>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr', gap: '1rem' }}>
        {quizzes.map((quiz) => (
          <div key={quiz._id} className="glass" style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase' }}>{quiz.category}</span>
              <h3 style={{ fontSize: '1.2rem', margin: '0.25rem 0' }}>{quiz.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{quiz.questionCount || 0} Questions • {quiz.timeLimit} mins</p>
            </div>
            
            <div className="flex" style={{ gap: '1rem' }}>
              <Link to={`/admin/questions/${quiz._id}`} className="btn-outline flex" style={{ gap: '0.4rem', padding: '0.6rem 1rem', fontSize: '0.85rem' }}>
                <FaQuestion /> Questions
              </Link>
              <button className="btn-outline" onClick={() => openEdit(quiz)} style={{ padding: '0.6rem' }}>
                <FaEdit />
              </button>
              <button className="btn-outline" onClick={() => handleDelete(quiz._id)} style={{ padding: '0.6rem', color: 'var(--accent)', borderColor: 'var(--accent)' }}>
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
          <div className="glass" style={{ padding: '3rem', width: '90%', maxWidth: '500px' }}>
            <h2 style={{ marginBottom: '2rem' }}>{editingQuiz ? 'Edit' : 'Create'} <span className="text-gradient">Quiz</span></h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Title</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required style={{ width: '100%' }} />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Category</label>
                <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required style={{ width: '100%' }} />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required style={{ width: '100%', minHeight: '100px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', padding: '1rem', borderRadius: '0.5rem' }} />
              </div>
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Time Limit (minutes)</label>
                <input type="number" value={formData.timeLimit} onChange={e => setFormData({...formData, timeLimit: e.target.value})} required min="1" style={{ width: '100%' }} />
              </div>
              
              <div className="flex" style={{ gap: '1rem' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save Quiz</button>
                <button type="button" className="btn-outline" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageQuizzes;
