import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './CreateQuestion.css';

const CreateQuestion = () => {
  const navigate = useNavigate();
  const { topicId } = useParams();
  const [topics, setTopics] = useState([]);
  const [showCreateTopic, setShowCreateTopic] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    problemDescription: '',
    attemptedSolutions: '',
    failurePoint: '',
    solutionNeeded: '',
    additionalDetails: '',
    topicId: topicId || '',
    newTopicName: '',
    newTopicDescription: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/topics`);
      setTopics(response.data);
    } catch (error) {
      console.error('Fetch topics error:', error);
    }
  };

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
      let selectedTopicId = formData.topicId;

      // Create new topic if needed
      if (showCreateTopic && formData.newTopicName.trim()) {
        const topicResponse = await axios.post(`${process.env.REACT_APP_API_URL}/api/topics`, {
          name: formData.newTopicName.trim(),
          description: formData.newTopicDescription.trim()
        });
        selectedTopicId = topicResponse.data._id;
      }

      if (!selectedTopicId) {
        setError('Please select a topic or create a new one');
        return;
      }

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/questions`, {
        title: formData.title,
        problemDescription: formData.problemDescription,
        attemptedSolutions: formData.attemptedSolutions,
        failurePoint: formData.failurePoint,
        solutionNeeded: formData.solutionNeeded,
        additionalDetails: formData.additionalDetails,
        topicId: selectedTopicId
      });
      navigate(`/questions/${response.data._id}`);
    } catch (error) {
      console.error('Create question error:', error);
      setError(error.response?.data?.message || 'Failed to create question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-question-page">
      <div className="form-container">
        <h1>Ask a Question</h1>
        <form onSubmit={handleSubmit} className="create-form">
          {error && <div className="error-message">{error}</div>}
          
          {/* Topic Selection */}
          {!topicId && (
            <div className="form-group">
              <label>Choose Topic</label>
              <div className="topic-selection">
                <select
                  name="topicId"
                  value={formData.topicId}
                  onChange={handleChange}
                  disabled={showCreateTopic}
                  className="topic-select"
                >
                  <option value="">Select an existing topic...</option>
                  {topics.map(topic => (
                    <option key={topic._id} value={topic._id}>
                      {topic.name}
                    </option>
                  ))}
                </select>
                <div className="topic-actions">
                  <button
                    type="button"
                    onClick={() => setShowCreateTopic(!showCreateTopic)}
                    className="btn btn-secondary btn-sm"
                  >
                    {showCreateTopic ? 'Cancel New Topic' : 'Create New Topic'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* New Topic Creation */}
          {showCreateTopic && (
            <div className="new-topic-section">
              <div className="form-group">
                <label htmlFor="newTopicName">New Topic Name</label>
                <input
                  type="text"
                  id="newTopicName"
                  name="newTopicName"
                  value={formData.newTopicName}
                  onChange={handleChange}
                  placeholder="Enter topic name..."
                  required={showCreateTopic}
                />
              </div>
              <div className="form-group">
                <label htmlFor="newTopicDescription">New Topic Description</label>
                <textarea
                  id="newTopicDescription"
                  name="newTopicDescription"
                  value={formData.newTopicDescription}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Describe the topic..."
                  required={showCreateTopic}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="title">Question Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="What's your question? (Be specific and concise)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="problemDescription">
              1. Problem Description
              <span className="label-hint">What problem are you facing?</span>
            </label>
            <textarea
              id="problemDescription"
              name="problemDescription"
              value={formData.problemDescription}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Describe the problem you're encountering in detail..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="attemptedSolutions">
              2. What Have You Tried?
              <span className="label-hint">List the solutions you've attempted</span>
            </label>
            <textarea
              id="attemptedSolutions"
              name="attemptedSolutions"
              value={formData.attemptedSolutions}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Explain what you've tried so far to solve this problem..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="failurePoint">
              3. Where Did You Fail?
              <span className="label-hint">What went wrong with your attempts?</span>
            </label>
            <textarea
              id="failurePoint"
              name="failurePoint"
              value={formData.failurePoint}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Describe where your attempts failed or what errors you encountered..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="solutionNeeded">
              4. What Solution Do You Need?
              <span className="label-hint">What kind of help are you looking for?</span>
            </label>
            <textarea
              id="solutionNeeded"
              name="solutionNeeded"
              value={formData.solutionNeeded}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Explain what kind of solution or guidance you're seeking..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="additionalDetails">
              5. Additional Details (Optional)
              <span className="label-hint">Any other relevant information</span>
            </label>
            <textarea
              id="additionalDetails"
              name="additionalDetails"
              value={formData.additionalDetails}
              onChange={handleChange}
              rows="4"
              placeholder="Add any other context, code snippets, or relevant information..."
            />
          </div>
          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate(topicId ? `/topics/${topicId}` : '/')} 
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Posting...' : 'Post Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuestion;
