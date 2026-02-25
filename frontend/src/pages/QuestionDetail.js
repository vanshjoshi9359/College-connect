import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import VoteButtons from '../components/VoteButtons';
import './QuestionDetail.css';

const QuestionDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuestionAndAnswers();
  }, [id]);

  const fetchQuestionAndAnswers = async () => {
    try {
      const [questionRes, answersRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/questions/${id}`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/answers/question/${id}`)
      ]);
      setQuestion(questionRes.data);
      setAnswers(answersRes.data);
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Failed to load question');
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionVoteUpdate = (updatedQuestion) => {
    setQuestion(updatedQuestion);
  };

  const handleAnswerVoteUpdate = (updatedAnswer) => {
    setAnswers(prevAnswers => {
      const updated = prevAnswers.map(a =>
        a._id === updatedAnswer._id ? updatedAnswer : a
      );
      return updated.sort((a, b) => {
        const scoreA = a.upvotes - a.downvotes;
        const scoreB = b.upvotes - b.downvotes;
        if (scoreB !== scoreA) return scoreB - scoreA;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    });
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="question-detail-page">
      <div className="question-section">
        <div className="question-card">
          <VoteButtons
            item={question}
            targetType="Question"
            onVoteUpdate={handleQuestionVoteUpdate}
          />
          <div className="question-content">
            <h1>{question.title}</h1>
            
            {question.problemDescription && (
              <div className="question-section-block">
                <h3 className="section-title">📋 Problem Description</h3>
                <p className="section-content">{question.problemDescription}</p>
              </div>
            )}

            {question.attemptedSolutions && (
              <div className="question-section-block">
                <h3 className="section-title">🔧 What I've Tried</h3>
                <p className="section-content">{question.attemptedSolutions}</p>
              </div>
            )}

            {question.failurePoint && (
              <div className="question-section-block">
                <h3 className="section-title">❌ Where I Failed</h3>
                <p className="section-content">{question.failurePoint}</p>
              </div>
            )}

            {question.solutionNeeded && (
              <div className="question-section-block">
                <h3 className="section-title">💡 Solution Needed</h3>
                <p className="section-content">{question.solutionNeeded}</p>
              </div>
            )}

            {question.additionalDetails && (
              <div className="question-section-block">
                <h3 className="section-title">📝 Additional Details</h3>
                <p className="section-content">{question.additionalDetails}</p>
              </div>
            )}

            {/* Fallback for old questions with only description */}
            {!question.problemDescription && question.description && (
              <p className="question-description">{question.description}</p>
            )}

            <div className="question-meta">
              <Link to={`/topics/${question.topicId._id}`} className="topic-badge">
                {question.topicId.name}
              </Link>
              <span className="meta-item">
                <span className="meta-icon">👤</span>
                {question.authorId.name}
              </span>
              <span className="meta-item">
                <span className="meta-icon">📅</span>
                {new Date(question.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="answers-section">
        <div className="answers-header">
          <h2>{answers.length} Answer{answers.length !== 1 ? 's' : ''}</h2>
          {user && (
            <Link to={`/create-answer/${id}`} className="btn btn-primary">Post Answer</Link>
          )}
        </div>
        {answers.length === 0 ? (
          <div className="empty-state">
            <p>No answers yet. Be the first to answer!</p>
          </div>
        ) : (
          <div className="answers-list">
            {answers.map(answer => (
              <div key={answer._id} className="answer-item">
                <VoteButtons
                  item={answer}
                  targetType="Answer"
                  onVoteUpdate={handleAnswerVoteUpdate}
                />
                <div className="answer-content">
                  <p className="answer-text">{answer.content}</p>
                  <div className="answer-meta">
                    <span>Answered by {answer.authorId.name}</span>
                    <span>{new Date(answer.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionDetail;
