import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Sidebar.css';

const Sidebar = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/topics`);
      // Get question counts for all topics
      const topicsWithQuestions = await Promise.all(
        response.data.map(async (topic) => {
          try {
            const questionsRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/questions/topic/${topic._id}`);
            return {
              ...topic,
              questionCount: questionsRes.data.length
            };
          } catch (error) {
            return {
              ...topic,
              questionCount: 0
            };
          }
        })
      );
      
      // Show all topics, sorted by question count
      const sortedTopics = topicsWithQuestions.sort((a, b) => b.questionCount - a.questionCount);
      
      setTopics(sortedTopics);
    } catch (error) {
      console.error('Fetch topics error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Topic icons mapping
  const getTopicIcon = (topicName) => {
    const name = topicName.toLowerCase();
    if (name.includes('computer') || name.includes('programming') || name.includes('code')) return '💻';
    if (name.includes('math') || name.includes('calculus') || name.includes('algebra')) return '📐';
    if (name.includes('science') || name.includes('physics') || name.includes('chemistry')) return '🔬';
    if (name.includes('art') || name.includes('design') || name.includes('creative')) return '🎨';
    if (name.includes('music')) return '🎵';
    if (name.includes('business') || name.includes('finance') || name.includes('economics')) return '💼';
    if (name.includes('history')) return '📚';
    if (name.includes('language') || name.includes('english') || name.includes('literature')) return '📖';
    if (name.includes('health') || name.includes('medical') || name.includes('biology')) return '🏥';
    if (name.includes('engineering')) return '⚙️';
    if (name.includes('law') || name.includes('legal')) return '⚖️';
    if (name.includes('psychology')) return '🧠';
    if (name.includes('sports') || name.includes('fitness')) return '⚽';
    if (name.includes('food') || name.includes('cooking')) return '🍳';
    return '📌';
  };

  // Don't show sidebar on login page
  if (location.pathname === '/login') {
    return null;
  }

  return (
    <div className="sidebar">
      <h3>Topics</h3>
      {loading ? (
        <div className="sidebar-loading">Loading topics...</div>
      ) : topics.length === 0 ? (
        <div className="sidebar-error">
          No topics with questions yet
        </div>
      ) : (
        <div className="sidebar-topics">
          {topics.map(topic => (
            <Link 
              key={topic._id} 
              to={`/topics/${topic._id}`} 
              className={`sidebar-topic ${location.pathname === `/topics/${topic._id}` ? 'active' : ''}`}
            >
              <span className="sidebar-topic-icon">{getTopicIcon(topic.name)}</span>
              <div className="sidebar-topic-content">
                <div className="sidebar-topic-name">{topic.name}</div>
                <div className="sidebar-topic-meta">
                  <span>{topic.questionCount}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sidebar;