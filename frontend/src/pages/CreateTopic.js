import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreateTopic.css';

const CreateTopic = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/topics`, formData);
      navigate(`/topics/${response.data._id}`);
    } catch (error) {
      console.error('Create topic error:', error);
      setError(error.response?.data?.message || 'Failed to create topic');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-topic-page">
      <div className="form-container">
        <h1>Create New Topic</h1>
        <form onSubmit={handleSubmit} className="create-form">
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label htmlFor="name">Topic Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., Web Development, Communication Skills"
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Describe what this topic is about..."
            />
          </div>
          <div className="form-actions">
            <button type="button" onClick={() => navigate('/')} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Creating...' : 'Create Topic'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTopic;
