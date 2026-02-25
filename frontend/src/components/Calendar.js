import React, { useState } from 'react';
import './Calendar.css';

const Calendar = ({ tasks, onDateClick, onTaskClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const today = new Date();
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const days = [];
  
  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dayTasks = getTasksForDate(date);
    const isToday = 
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
    const isPast = date < today && !isToday;

    days.push(
      <div
        key={day}
        className={`calendar-day ${isToday ? 'today' : ''} ${isPast ? 'past' : ''} ${dayTasks.length > 0 ? 'has-tasks' : ''}`}
        onClick={() => onDateClick && onDateClick(date)}
      >
        <div className="day-number">{day}</div>
        {dayTasks.length > 0 && (
          <div className="day-tasks">
            {dayTasks.slice(0, 3).map(task => (
              <div
                key={task._id}
                className={`task-dot ${task.completions?.length > 0 ? 'completed' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onTaskClick && onTaskClick(task);
                }}
                title={task.title}
              >
                <span className="task-title">{task.title}</span>
              </div>
            ))}
            {dayTasks.length > 3 && (
              <div className="more-tasks">+{dayTasks.length - 3} more</div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={previousMonth} className="calendar-nav-btn">
          ← Previous
        </button>
        <h2 className="calendar-title">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button onClick={nextMonth} className="calendar-nav-btn">
          Next →
        </button>
      </div>
      
      <div className="calendar-weekdays">
        <div className="weekday">Sun</div>
        <div className="weekday">Mon</div>
        <div className="weekday">Tue</div>
        <div className="weekday">Wed</div>
        <div className="weekday">Thu</div>
        <div className="weekday">Fri</div>
        <div className="weekday">Sat</div>
      </div>
      
      <div className="calendar-grid">
        {days}
      </div>

      <div className="calendar-legend">
        <div className="legend-item">
          <div className="legend-dot today-dot"></div>
          <span>Today</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot task-dot"></div>
          <span>Has Tasks</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot completed-dot"></div>
          <span>Completed</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
