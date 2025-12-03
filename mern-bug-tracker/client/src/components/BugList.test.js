import { render, screen } from '@testing-library/react';
import BugList from './BugList';

const mockBugs = [
  {
    _id: '1',
    title: 'Bug 1',
    description: 'Description 1',
    status: 'open',
    priority: 'high',
    reportedBy: 'User 1',
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    _id: '2',
    title: 'Bug 2',
    description: 'Description 2',
    status: 'resolved',
    priority: 'low',
    reportedBy: 'User 2',
    createdAt: '2024-01-02T00:00:00.000Z'
  }
];

describe('BugList Component', () => {
  
  test('renders loading state', () => {
    render(
      <BugList 
        bugs={[]} 
        loading={true} 
        error={null}
        onStatusChange={jest.fn()} 
        onDelete={jest.fn()} 
      />
    );
    
    expect(screen.getByText(/loading bugs/i)).toBeInTheDocument();
  });

  test('renders error state', () => {
    render(
      <BugList 
        bugs={[]} 
        loading={false} 
        error="Failed to fetch bugs"
        onStatusChange={jest.fn()} 
        onDelete={jest.fn()} 
      />
    );
    
    expect(screen.getByText(/error loading bugs/i)).toBeInTheDocument();
    expect(screen.getByText(/failed to fetch bugs/i)).toBeInTheDocument();
  });

  test('renders empty state when no bugs', () => {
    render(
      <BugList 
        bugs={[]} 
        loading={false} 
        error={null}
        onStatusChange={jest.fn()} 
        onDelete={jest.fn()} 
      />
    );
    
    expect(screen.getByText(/no bugs reported yet/i)).toBeInTheDocument();
  });

  test('renders list of bugs', () => {
    render(
      <BugList 
        bugs={mockBugs} 
        loading={false} 
        error={null}
        onStatusChange={jest.fn()} 
        onDelete={jest.fn()} 
      />
    );
    
    expect(screen.getByText('Bug 1')).toBeInTheDocument();
    expect(screen.getByText('Bug 2')).toBeInTheDocument();
    expect(screen.getByText(/Bug Reports \(2\)/i)).toBeInTheDocument();
  });

  test('renders correct number of BugItem components', () => {
    render(
      <BugList 
        bugs={mockBugs} 
        loading={false} 
        error={null}
        onStatusChange={jest.fn()} 
        onDelete={jest.fn()} 
      />
    );
    
    const bugItems = screen.getAllByTestId('bug-item');
    expect(bugItems).toHaveLength(2);
  });
});