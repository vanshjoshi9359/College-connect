import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './CreateAnswer.css';

const CreateAnswer = () => {
  const navigate = useNavigate();
  const { questionId } = useParams();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/answers`, {
        questionId,
        content
      });
      navigate(`/questions/${questionId}`);
    } catch (error) {
      console.error('Create answer error:', error);
      setError(error.response?.data?.message || 'Failed to post answer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-answer-page">
      <div className="form-container">
        <h1>Post Your Answer</h1>
        <form onSubmit={handleSubmit} className="create-form">
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label htmlFor="content">Your Answer</label>
            <textarea
              id="content"
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows="10"
              placeholder="Share your knowledge..."
            />
          </div>
          <div className="form-actions">
            <button type="button" onClick={() => navigate(`/questions/${questionId}`)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Posting...' : 'Post Answer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAnswer;
