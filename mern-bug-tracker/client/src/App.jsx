import React, { useState, useEffect } from 'react';
import './App.css';
import BugForm from './components/BugForm';
import BugList from './components/BugList';
import ErrorBoundary from './components/ErrorBoundary';
import bugService from './services/bugService';

function App() {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch bugs on component mount
  useEffect(() => {
    fetchBugs();
  }, []);

  const fetchBugs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bugService.getAllBugs();
      setBugs(data);
    } catch (err) {
      console.error('Error fetching bugs:', err);
      setError(err.response?.data?.error || 'Failed to load bugs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBug = async (bugData) => {
    try {
      const newBug = await bugService.createBug(bugData);
      setBugs(prevBugs => [newBug, ...prevBugs]);
      alert('Bug reported successfully!');
    } catch (err) {
      console.error('Error creating bug:', err);
      alert(err.response?.data?.error || 'Failed to create bug');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updatedBug = await bugService.updateBug(id, { status: newStatus });
      setBugs(prevBugs =>
        prevBugs.map(bug => (bug._id === id ? updatedBug : bug))
      );
    } catch (err) {
      console.error('Error updating bug:', err);
      alert(err.response?.data?.error || 'Failed to update bug');
    }
  };

  const handleDeleteBug = async (id) => {
    try {
      await bugService.deleteBug(id);
      setBugs(prevBugs => prevBugs.filter(bug => bug._id !== id));
    } catch (err) {
      console.error('Error deleting bug:', err);
      alert(err.response?.data?.error || 'Failed to delete bug');
    }
  };

  return (
    <ErrorBoundary>
      <div className="App">
        <header className="App-header">
          <h1> Bug Tracker</h1>
          <p>Track and manage your application bugs</p>
        </header>
        
        <main className="App-main">
          <div className="container">
            <BugForm onSubmit={handleCreateBug} />
            
            <BugList
              bugs={bugs}
              loading={loading}
              error={error}
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteBug}
            />
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;