import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import VoteButtons from '../components/VoteButtons';
import './TopicList.css';

const TopicList = () => {
  const { user } = useContext(AuthContext);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
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
      setError('Failed to load topics');
    } finally {
      setLoading(false);
    }
  };

  const handleVoteUpdate = (updatedTopic) => {
    setTopics(prevTopics => {
      const updated = prevTopics.map(t =>
        t._id === updatedTopic._id ? updatedTopic : t
      );
      // Sort by score
      return updated.sort((a, b) => {
        const scoreA = a.upvotes - a.downvotes;
        const scoreB = b.upvotes - b.downvotes;
        if (scoreB !== scoreA) return scoreB - scoreA;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    });
  };

  if (loading) return <div className="loading">Loading topics...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="topic-list-page">
      <div className="page-header">
        <h1>Topics</h1>
        {user && <Link to="/create-topic" className="btn btn-primary">Create Topic</Link>}
      </div>
      {topics.length === 0 ? (
        <div className="empty-state">
          <p>No topics yet. Be the first to create one!</p>
        </div>
      ) : (
        <div className="topic-grid">
          {topics.map(topic => (
            <div key={topic._id} className="topic-card-wrapper">
              <VoteButtons
                item={topic}
                targetType="Topic"
                onVoteUpdate={handleVoteUpdate}
              />
              <Link to={`/topics/${topic._id}`} className="topic-card">
                <h3>{topic.name}</h3>
                <p>{topic.description}</p>
                <div className="topic-meta">
                  <span>By {topic.createdBy.name}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopicList;
