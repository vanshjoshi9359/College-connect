import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './VoteButtons.css';

const VoteButtons = ({ item, targetType, onVoteUpdate }) => {
  const { user } = useContext(AuthContext);
  const [voting, setVoting] = useState(false);

  const score = item.upvotes - item.downvotes;

  const handleVote = async (voteType) => {
    if (!user) {
      alert('Please login to vote');
      return;
    }

    if (voting) return;

    setVoting(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/votes`, {
        targetId: item._id,
        targetType,
        voteType
      });
      onVoteUpdate(response.data);
    } catch (error) {
      console.error('Vote error:', error);
      alert('Failed to vote');
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className="vote-buttons">
      <button
        className={`vote-btn upvote ${item.userVote === 1 ? 'active' : ''}`}
        onClick={() => handleVote(1)}
        disabled={voting}
      >
        ▲
      </button>
      <span className={`vote-score ${score > 0 ? 'positive' : score < 0 ? 'negative' : ''}`}>
        {score}
      </span>
      <button
        className={`vote-btn downvote ${item.userVote === -1 ? 'active' : ''}`}
        onClick={() => handleVote(-1)}
        disabled={voting}
      >
        ▼
      </button>
    </div>
  );
};

export default VoteButtons;
