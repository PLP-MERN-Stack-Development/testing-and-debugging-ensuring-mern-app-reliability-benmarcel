import React from 'react';
import BugItem from './BugItem';

const BugList = ({ bugs, onStatusChange, onDelete, loading, error }) => {
  if (loading) {
    return <div className="loading">Loading bugs...</div>;
  }

  if (error) {
    return (
      <div className="error-message" role="alert">
        <h3>Error loading bugs</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (bugs.length === 0) {
    return (
      <div className="empty-state">
        <h3>No bugs reported yet</h3>
        <p>Create your first bug report using the form above.</p>
      </div>
    );
  }

  return (
    <div className="bug-list">
      <h2>Bug Reports ({bugs.length})</h2>
      <div className="bugs-container">
        {bugs.map(bug => (
          <BugItem
            key={bug._id}
            bug={bug}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default BugList;