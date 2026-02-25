import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import VoteButtons from '../components/VoteButtons';
import './TopicDetail.css';

const TopicDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [topic, setTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTopicAndQuestions();
  }, [id]);

  const fetchTopicAndQuestions = async () => {
    try {
      const [topicRes, questionsRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/topics/${id}`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/questions/topic/${id}`)
      ]);
      setTopic(topicRes.data);
      setQuestions(questionsRes.data);
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Failed to load topic');
    } finally {
      setLoading(false);
    }
  };

  const handleTopicVoteUpdate = (updatedTopic) => {
    setTopic(updatedTopic);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="topic-detail-page">
      <div className="topic-header">
        <div className="topic-header-row">
          <VoteButtons
            item={topic}
            targetType="Topic"
            onVoteUpdate={handleTopicVoteUpdate}
          />
          <div className="topic-header-content">
            <h1>{topic.name}</h1>
            <p>{topic.description}</p>
            {user && (
              <Link to={`/create-question/${id}`} className="btn btn-primary">Ask Question</Link>
            )}
          </div>
        </div>
      </div>
      <div className="questions-section">
        <h2>Questions</h2>
        {questions.length === 0 ? (
          <div className="empty-state">
            <p>No questions yet. Be the first to ask!</p>
          </div>
        ) : (
          <div className="questions-list">
            {questions.map(question => (
              <Link to={`/questions/${question._id}`} key={question._id} className="question-item">
                <div className="question-content">
                  <h3 className="question-title">{question.title}</h3>
                  <p className="question-description">{question.description}</p>
                  <div className="question-meta">
                    <span>Asked by {question.authorId.name}</span>
                    <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicDetail;
