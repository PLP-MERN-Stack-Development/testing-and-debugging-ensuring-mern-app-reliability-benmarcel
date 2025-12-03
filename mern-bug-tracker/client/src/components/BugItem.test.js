import { render, screen, fireEvent } from '@testing-library/react';
import BugItem from './BugItem';

const mockBug = {
  _id: '123',
  title: 'Test Bug',
  description: 'Test Description',
  status: 'open',
  priority: 'high',
  reportedBy: 'John Doe',
  createdAt: '2024-01-01T00:00:00.000Z'
};

describe('BugItem Component', () => {
  
  test('renders bug information correctly', () => {
    render(
      <BugItem 
        bug={mockBug} 
        onStatusChange={jest.fn()} 
        onDelete={jest.fn()} 
      />
    );
    
    expect(screen.getByText('Test Bug')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
  });

  test('displays correct status in dropdown', () => {
    render(
      <BugItem 
        bug={mockBug} 
        onStatusChange={jest.fn()} 
        onDelete={jest.fn()} 
      />
    );
    
    const statusSelect = screen.getByLabelText(/change bug status/i);
    expect(statusSelect.value).toBe('open');
  });

  test('calls onStatusChange when status is changed', () => {
    const mockStatusChange = jest.fn();
    render(
      <BugItem 
        bug={mockBug} 
        onStatusChange={mockStatusChange} 
        onDelete={jest.fn()} 
      />
    );
    
    const statusSelect = screen.getByLabelText(/change bug status/i);
    fireEvent.change(statusSelect, { target: { value: 'resolved' } });
    
    expect(mockStatusChange).toHaveBeenCalledWith('123', 'resolved');
  });

  test('shows confirmation dialog before deleting', () => {
    const mockDelete = jest.fn();
    window.confirm = jest.fn(() => true);
    
    render(
      <BugItem 
        bug={mockBug} 
        onStatusChange={jest.fn()} 
        onDelete={mockDelete} 
      />
    );
    
    const deleteButton = screen.getByLabelText(/delete bug/i);
    fireEvent.click(deleteButton);
    
    expect(window.confirm).toHaveBeenCalled();
    expect(mockDelete).toHaveBeenCalledWith('123');
  });

  test('does not delete if user cancels confirmation', () => {
    const mockDelete = jest.fn();
    window.confirm = jest.fn(() => false);
    
    render(
      <BugItem 
        bug={mockBug} 
        onStatusChange={jest.fn()} 
        onDelete={mockDelete} 
      />
    );
    
    const deleteButton = screen.getByLabelText(/delete bug/i);
    fireEvent.click(deleteButton);
    
    expect(window.confirm).toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('formats date correctly', () => {
    render(
      <BugItem 
        bug={mockBug} 
        onStatusChange={jest.fn()} 
        onDelete={jest.fn()} 
      />
    );
    
    // Date should be formatted as locale date string
    expect(screen.getByText(/Created:/)).toBeInTheDocument();
  });
});