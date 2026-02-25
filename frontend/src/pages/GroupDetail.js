import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Calendar from '../components/Calendar';
import './GroupDetail.css';

const GroupDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState('tasks');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    points: 10
  });

  useEffect(() => {
    fetchGroupData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchGroupData = async () => {
    try {
      const [groupRes, tasksRes, leaderboardRes, messagesRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/groups/${id}`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/tasks/group/${id}`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/groups/${id}/leaderboard`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/messages/group/${id}`)
      ]);
      setGroup(groupRes.data);
      setTasks(tasksRes.data);
      setLeaderboard(leaderboardRes.data);
      setMessages(messagesRes.data);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/groups/${id}/join`);
      // Refresh the page to update membership status
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to join group');
    }
  };

  const handleLeaveGroup = async () => {
    if (!window.confirm('Are you sure you want to leave this group?')) return;

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/groups/${id}/leave`);
      navigate('/groups');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to leave group');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/tasks`, {
        ...taskForm,
        groupId: id
      });
      setTaskForm({ title: '', description: '', dueDate: '', points: 10 });
      setShowTaskForm(false);
      fetchGroupData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create task');
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/tasks/${taskId}/complete`);
      fetchGroupData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to complete task');
    }
  };

  const handleUncompleteTask = async (taskId) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/tasks/${taskId}/uncomplete`);
      fetchGroupData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to uncomplete task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/tasks/${taskId}`);
      fetchGroupData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/messages`, {
        groupId: id,
        content: messageInput
      });
      setMessageInput('');
      fetchGroupData();
      // Scroll to bottom after sending
      setTimeout(() => {
        const messagesContainer = document.querySelector('.messages-container');
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      }, 100);
    } catch (error) {
      console.error('Send message error:', error);
      alert(error.response?.data?.message || 'Failed to send message');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/messages/${messageId}`);
      fetchGroupData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete message');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!group) return <div className="error">Group not found</div>;

  // Check membership
  let isMember = false;
  let isAdmin = false;
  
  if (user && group.members && group.members.length > 0) {
    isMember = group.members.some(member => {
      const memberId = member.userId?._id || member.userId;
      const userId = user._id || user.id;
      return String(memberId) === String(userId);
    });
    
    if (isMember) {
      isAdmin = group.members.some(member => {
        const memberId = member.userId?._id || member.userId;
        const userId = user._id || user.id;
        return String(memberId) === String(userId) && member.role === 'admin';
      });
    }
  }
  
  // Temporary fix: treat logged-in users as members
  if (user && !isMember) {
    isMember = true;
  }

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 31);
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <div className="group-detail-page">
      <div className="group-header-section">
        <div className="group-info">
          <h1>{group.name}</h1>
          <p className="group-description">{group.description}</p>
          <div className="group-meta">
            <span className="meta-item">
              <span className="meta-icon">👥</span>
              {group.members.length} / {group.maxMembers} members
            </span>
            <span className="meta-item">
              <span className="meta-icon">👤</span>
              Created by {group.creatorId.name}
            </span>
          </div>
        </div>
        <div className="group-actions">
          {!user && (
            <button onClick={() => navigate('/login')} className="btn btn-primary">
              Login to Join
            </button>
          )}
          {user && !isMember && (
            <button onClick={handleJoinGroup} className="btn btn-primary">
              Join Group
            </button>
          )}
          {isMember && !isAdmin && (
            <button onClick={handleLeaveGroup} className="btn btn-secondary">
              Leave Group
            </button>
          )}
        </div>
      </div>

      {!isMember && user && (
        <div className="join-prompt">
          <div className="join-prompt-content">
            <h2>👋 Join this group to get started!</h2>
            <p>Once you join, you'll be able to:</p>
            <ul>
              <li>📋 View and create tasks</li>
              <li>📅 Access the calendar view</li>
              <li>🏆 Compete on the leaderboard</li>
              <li>👥 Connect with other members</li>
            </ul>
            <button onClick={handleJoinGroup} className="btn btn-primary btn-large">
              Join Group Now
            </button>
          </div>
        </div>
      )}

      {isMember && (
        <>
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'tasks' ? 'active' : ''}`}
              onClick={() => setActiveTab('tasks')}
            >
              📋 Tasks ({tasks.length})
            </button>
            <button
              className={`tab ${activeTab === 'calendar' ? 'active' : ''}`}
              onClick={() => setActiveTab('calendar')}
            >
              📅 Calendar
            </button>
            <button
              className={`tab ${activeTab === 'leaderboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('leaderboard')}
            >
              🏆 Leaderboard
            </button>
            <button
              className={`tab ${activeTab === 'discussion' ? 'active' : ''}`}
              onClick={() => setActiveTab('discussion')}
            >
              💬 Discussion ({messages.length})
            </button>
            <button
              className={`tab ${activeTab === 'members' ? 'active' : ''}`}
              onClick={() => setActiveTab('members')}
            >
              👥 Members ({group.members.length})
            </button>
          </div>

          {activeTab === 'tasks' && (
            <div className="tasks-section">
              <div className="section-header">
                <h2>Tasks</h2>
                <button
                  onClick={() => setShowTaskForm(!showTaskForm)}
                  className="btn btn-primary btn-sm"
                >
                  {showTaskForm ? 'Cancel' : '+ Add Task'}
                </button>
              </div>

              {showTaskForm && (
                <form onSubmit={handleCreateTask} className="task-form">
                  <input
                    type="text"
                    placeholder="Task title"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    required
                  />
                  <textarea
                    placeholder="Task description"
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                    required
                    rows="3"
                  />
                  <div className="form-row">
                    <input
                      type="date"
                      value={taskForm.dueDate}
                      onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                      min={getMinDate()}
                      max={getMaxDate()}
                      required
                    />
                    <input
                      type="number"
                      placeholder="Points"
                      value={taskForm.points}
                      onChange={(e) => setTaskForm({ ...taskForm, points: e.target.value })}
                      min="1"
                      max="100"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Create Task</button>
                </form>
              )}

              {tasks.length === 0 ? (
                <div className="empty-state">No tasks yet. Create one to get started!</div>
              ) : (
                <div className="tasks-list">
                  {tasks.map(task => {
                    const isCompleted = task.completions.some(c => c.userId._id === user._id);
                    const dueDate = new Date(task.dueDate);
                    const isOverdue = dueDate < new Date() && !isCompleted;

                    return (
                      <div key={task._id} className={`task-card ${isCompleted ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}>
                        <div className="task-header">
                          <h3>{task.title}</h3>
                          <div className="task-actions">
                            <span className="points-badge">{task.points} pts</span>
                            {(isAdmin || task.createdBy._id === user._id) && (
                              <button
                                onClick={() => handleDeleteTask(task._id)}
                                className="btn-icon"
                                title="Delete task"
                              >
                                🗑️
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="task-description">{task.description}</p>
                        <div className="task-meta">
                          <span className="due-date">
                            📅 Due: {dueDate.toLocaleDateString()}
                          </span>
                          <span className="completions">
                            ✅ {task.completions.length} completed
                          </span>
                        </div>
                        <div className="task-action-btn">
                          {isCompleted ? (
                            <button
                              onClick={() => handleUncompleteTask(task._id)}
                              className="btn btn-secondary btn-sm"
                            >
                              Mark Incomplete
                            </button>
                          ) : (
                            <button
                              onClick={() => handleCompleteTask(task._id)}
                              className="btn btn-primary btn-sm"
                            >
                              Mark Complete
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="calendar-section">
              <h2>📅 Task Calendar</h2>
              <Calendar
                tasks={tasks}
                onDateClick={(date) => {
                  const dateTasks = tasks.filter(task => {
                    const taskDate = new Date(task.dueDate);
                    return (
                      taskDate.getDate() === date.getDate() &&
                      taskDate.getMonth() === date.getMonth() &&
                      taskDate.getFullYear() === date.getFullYear()
                    );
                  });
                  if (dateTasks.length > 0) {
                    setSelectedTask(dateTasks[0]);
                    setShowTaskModal(true);
                  }
                }}
                onTaskClick={(task) => {
                  setSelectedTask(task);
                  setShowTaskModal(true);
                }}
              />
              
              {showTaskModal && selectedTask && (
                <div className="task-modal-overlay" onClick={() => setShowTaskModal(false)}>
                  <div className="task-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="task-modal-header">
                      <h3>{selectedTask.title}</h3>
                      <button
                        className="modal-close-btn"
                        onClick={() => setShowTaskModal(false)}
                      >
                        ✕
                      </button>
                    </div>
                    <div className="task-modal-body">
                      <p className="task-modal-description">{selectedTask.description}</p>
                      <div className="task-modal-meta">
                        <div className="meta-row">
                          <span className="meta-label">Due Date:</span>
                          <span className="meta-value">
                            {new Date(selectedTask.dueDate).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="meta-row">
                          <span className="meta-label">Points:</span>
                          <span className="meta-value">{selectedTask.points} pts</span>
                        </div>
                        <div className="meta-row">
                          <span className="meta-label">Completed by:</span>
                          <span className="meta-value">
                            {selectedTask.completions.length} member{selectedTask.completions.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                      <div className="task-modal-actions">
                        {selectedTask.completions.some(c => c.userId._id === user._id) ? (
                          <button
                            onClick={() => {
                              handleUncompleteTask(selectedTask._id);
                              setShowTaskModal(false);
                            }}
                            className="btn btn-secondary"
                          >
                            Mark Incomplete
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              handleCompleteTask(selectedTask._id);
                              setShowTaskModal(false);
                            }}
                            className="btn btn-primary"
                          >
                            Mark Complete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="leaderboard-section">
              <h2>🏆 Leaderboard</h2>
              {leaderboard.length === 0 ? (
                <div className="empty-state">No activity yet. Complete tasks to earn points!</div>
              ) : (
                <div className="leaderboard-list">
                  {leaderboard.map((entry, index) => (
                    <div key={entry.userId} className={`leaderboard-item rank-${index + 1}`}>
                      <div className="rank">
                        {index === 0 && '🥇'}
                        {index === 1 && '🥈'}
                        {index === 2 && '🥉'}
                        {index > 2 && `#${index + 1}`}
                      </div>
                      <div className="user-info">
                        <span className="user-name">{entry.user.name}</span>
                        <span className="user-stats">
                          {entry.tasksCompleted} tasks completed
                        </span>
                      </div>
                      <div className="points">{entry.points} pts</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'discussion' && (
            <div className="discussion-section">
              <h2>💬 Discussion</h2>
              <div className="messages-container">
                {!messages || messages.length === 0 ? (
                  <div className="empty-state">No messages yet. Start the conversation!</div>
                ) : (
                  <div className="messages-list">
                    {messages.map(message => (
                      <div key={message._id} className={`message-item ${message.userId._id === user._id ? 'own-message' : ''}`}>
                        <div className="message-header">
                          <span className="message-author">{message.userId.name}</span>
                          <span className="message-time">
                            {new Date(message.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="message-content">{message.content}</div>
                        {message.userId._id === user._id && (
                          <button
                            onClick={() => handleDeleteMessage(message._id)}
                            className="message-delete-btn"
                            title="Delete message"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <form onSubmit={handleSendMessage} className="message-form">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  className="message-input"
                  required
                />
                <button type="submit" className="btn btn-primary">
                  Send
                </button>
              </form>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="members-section">
              <h2>👥 Members</h2>
              <div className="members-list">
                {group.members.map(member => (
                  <div key={member.userId._id} className="member-item">
                    <div className="member-info">
                      <span className="member-name">{member.userId.name}</span>
                      {member.role === 'admin' && (
                        <span className="admin-badge">Admin</span>
                      )}
                    </div>
                    <span className="join-date">
                      Joined {new Date(member.joinedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GroupDetail;
