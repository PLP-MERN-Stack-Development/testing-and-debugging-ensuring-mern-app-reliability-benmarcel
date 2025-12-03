import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import bugService from './services/bugService';

// Mock the bugService
jest.mock('./services/bugService.js', () => ({
  getAllBugs: jest.fn(),
  createBug: jest.fn(),
  updateBug: jest.fn(),
  deleteBug: jest.fn()
}));

const mockBugs = [
  {
    _id: '1',
    title: 'Login Issue',
    description: 'Cannot login',
    status: 'open',
    priority: 'high',
    reportedBy: 'John',
    createdAt: '2024-01-01T00:00:00.000Z'
  }
];

describe('App Integration Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders app header', async () => {
    bugService.getAllBugs.mockResolvedValue([]);
    render(<App />);
    
     // Wait for useEffect to finish updating state
  await waitFor(() => {
    expect(screen.getByText(/bug tracker/i)).toBeInTheDocument();
  });
  });

  test('fetches and displays bugs on mount', async () => {
    bugService.getAllBugs.mockResolvedValue(mockBugs);
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Login Issue')).toBeInTheDocument();
    });
    
    expect(bugService.getAllBugs).toHaveBeenCalledTimes(1);
  });

  test('creates new bug and adds to list', async () => {
    bugService.getAllBugs.mockResolvedValue([]);
    const newBug = {
      _id: '2',
      title: 'New Bug',
      description: 'New Description',
      status: 'open',
      priority: 'medium',
      reportedBy: 'Jane',
      createdAt: '2024-01-02T00:00:00.000Z'
    };
    bugService.createBug.mockResolvedValue(newBug);
    
    render(<App />);
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText(/no bugs reported yet/i)).toBeInTheDocument();
    });
    
    // Fill out form
    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const reportedByInput = screen.getByLabelText(/reported by/i);
    
    await userEvent.type(titleInput, 'New Bug');
    await userEvent.type(descriptionInput, 'New Description');
    await userEvent.type(reportedByInput, 'Jane');
    
    // Mock window.alert
    window.alert = jest.fn();
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(bugService.createBug).toHaveBeenCalledWith({
        title: 'New Bug',
        description: 'New Description',
        priority: 'medium',
        reportedBy: 'Jane'
      });
      expect(screen.getByText('New Bug')).toBeInTheDocument();
    });
  });

  test('handles API error when fetching bugs', async () => {
    bugService.getAllBugs.mockRejectedValue({
      response: { data: { error: 'Network error' } }
    });
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/error loading bugs/i)).toBeInTheDocument();
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });

  test('updates bug status', async () => {
    bugService.getAllBugs.mockResolvedValue(mockBugs);
    const updatedBug = { ...mockBugs[0], status: 'resolved' };
    bugService.updateBug.mockResolvedValue(updatedBug);
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Login Issue')).toBeInTheDocument();
    });
    
    const statusSelect = screen.getByLabelText(/change bug status/i);
    fireEvent.change(statusSelect, { target: { value: 'resolved' } });
    
    await waitFor(() => {
      expect(bugService.updateBug).toHaveBeenCalledWith('1', { status: 'resolved' });
    });
  });

  test('deletes bug after confirmation', async () => {
    bugService.getAllBugs.mockResolvedValue(mockBugs);
    bugService.deleteBug.mockResolvedValue({});
    window.confirm = jest.fn(() => true);
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Login Issue')).toBeInTheDocument();
    });
    
    const deleteButton = screen.getByLabelText(/delete bug/i);
    fireEvent.click(deleteButton);
    
    await waitFor(() => {
      expect(bugService.deleteBug).toHaveBeenCalledWith('1');
      expect(screen.queryByText('Login Issue')).not.toBeInTheDocument();
    });
  });
});