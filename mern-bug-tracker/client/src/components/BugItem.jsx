import React from 'react';

const BugItem = ({ bug, onStatusChange, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return '#ff6b6b';
      case 'in-progress':
        return '#ffa500';
      case 'resolved':
        return '#51cf66';
      default:
        return '#ccc';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#ff4444';
      case 'medium':
        return '#ffaa00';
      case 'low':
        return '#4CAF50';
      default:
        return '#ccc';
    }
  };

  const handleStatusChange = (e) => {
    onStatusChange(bug._id, e.target.value);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this bug?')) {
      onDelete(bug._id);
    }
  };

  return (
    <div className="bug-item" data-testid="bug-item">
      <div className="bug-header">
        <h3>{bug.title}</h3>
        <span 
          className="priority-badge" 
          style={{ backgroundColor: getPriorityColor(bug.priority) }}
        >
          {bug.priority}
        </span>
      </div>
      
      <p className="bug-description">{bug.description}</p>
      
      <div className="bug-meta">
        <span>Reported by: <strong>{bug.reportedBy}</strong></span>
        <span>Created: {new Date(bug.createdAt).toLocaleDateString()}</span>
      </div>
      
      <div className="bug-actions">
        <select
          value={bug.status}
          onChange={handleStatusChange}
          className="status-select"
          style={{ borderColor: getStatusColor(bug.status) }}
          aria-label="Change bug status"
        >
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
        
        <button 
          onClick={handleDelete} 
          className="btn-delete"
          aria-label="Delete bug"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default BugItem;