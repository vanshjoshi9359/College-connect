import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './Search.css';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Debounced search
  useEffect(() => {
    const queryParam = searchParams.get('q');
    if (queryParam) {
      setQuery(queryParam);
      performSearch(queryParam);
    }
  }, [searchParams]);

  // Get suggestions while typing
  useEffect(() => {
    if (query.length >= 2) {
      const timer = setTimeout(() => {
        fetchSuggestions(query);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const fetchSuggestions = async (searchQuery) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`
      );
      setSuggestions(response.data.suggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Suggestions error:', error);
    }
  };

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/search?q=${encodeURIComponent(searchQuery)}`
      );
      setResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query });
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.text);
    setSearchParams({ q: suggestion.text });
    setShowSuggestions(false);
  };

  const highlightText = (text, highlight) => {
    if (!highlight.trim()) return text;
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? <mark key={index}>{part}</mark> : part
    );
  };

  const getResultIcon = (type) => {
    switch(type) {
      case 'topic': return '📁';
      case 'question': return '❓';
      case 'answer': return '💬';
      default: return '📄';
    }
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>Search College Connect</h1>
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-wrapper">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              placeholder="Search topics, questions, or answers..."
              className="search-input"
            />
            <button type="submit" className="search-button">
              Search
            </button>
            
            {showSuggestions && suggestions.length > 0 && (
              <div className="suggestions-dropdown">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <span className="suggestion-icon">
                      {suggestion.type === 'topic' ? '📁' : '❓'}
                    </span>
                    <span className="suggestion-text">{suggestion.text}</span>
                    <span className="suggestion-type">{suggestion.type}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>
      </div>

      {loading && (
        <div className="loading">Searching...</div>
      )}

      {results && !loading && (
        <div className="search-results">
          <div className="results-summary">
            <span>Found </span>
            <strong>{results.totalResults}</strong>
            <span> result{results.totalResults !== 1 ? 's' : ''} for </span>
            <mark>"{results.query}"</mark>
          </div>

          {results.results.topics.length > 0 && (
            <div className="results-section">
              <h2>📁 Topics ({results.results.topics.length})</h2>
              <div className="results-list">
                {results.results.topics.map((topic) => (
                  <Link to={`/topics/${topic._id}`} key={topic._id} className="result-card">
                    <div className="result-header">
                      <h3>{highlightText(topic.name, results.query)}</h3>
                      <div className="result-stats">
                        <span className="stat">
                          💬 {topic.commentCount}
                        </span>
                        <span className="stat rating">
                          ⭐ {topic.avgRating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <p className="result-description">
                      {highlightText(topic.description, results.query)}
                    </p>
                    <div className="result-meta">
                      <span>Created by {topic.createdBy.name}</span>
                      <span>{new Date(topic.createdAt).toLocaleDateString()}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results.results.questions.length > 0 && (
            <div className="results-section">
              <h2>❓ Questions ({results.results.questions.length})</h2>
              <div className="results-list">
                {results.results.questions.map((question) => (
                  <Link to={`/questions/${question._id}`} key={question._id} className="result-card">
                    <div className="result-header">
                      <h3>{highlightText(question.title, results.query)}</h3>
                      <div className="result-stats">
                        <span className="stat">
                          💬 {question.commentCount}
                        </span>
                        <span className="stat rating">
                          ⭐ {question.avgRating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <p className="result-description">
                      {highlightText(question.description, results.query)}
                    </p>
                    <div className="result-meta">
                      <span>In {question.topicId.name}</span>
                      <span>Asked by {question.authorId.name}</span>
                      <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results.results.answers.length > 0 && (
            <div className="results-section">
              <h2>💬 Answers ({results.results.answers.length})</h2>
              <div className="results-list">
                {results.results.answers.map((answer) => (
                  <Link to={`/questions/${answer.questionId._id}`} key={answer._id} className="result-card">
                    <div className="result-header">
                      <h3>Answer to: {answer.questionId.title}</h3>
                      <div className="result-stats">
                        <span className="stat">
                          👍 {answer.score}
                        </span>
                      </div>
                    </div>
                    <p className="result-description">
                      {highlightText(answer.content, results.query)}
                    </p>
                    <div className="result-meta">
                      <span>By {answer.authorId.name}</span>
                      <span>{new Date(answer.createdAt).toLocaleDateString()}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results.totalResults === 0 && (
            <div className="empty-state">
              <h2>No results found</h2>
              <p>Try different keywords or check your spelling</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
