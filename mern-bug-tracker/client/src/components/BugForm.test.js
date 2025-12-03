import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import BugForm from './BugForm';

describe('BugForm Component', () => {
  
  test('renders form with all fields', () => {
    render(<BugForm onSubmit={jest.fn()} />);
    
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/reported by/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('shows validation errors for empty fields', async () => {
    render(<BugForm onSubmit={jest.fn()} />);
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/description is required/i)).toBeInTheDocument();
      expect(screen.getByText(/reporter name is required/i)).toBeInTheDocument();
    });
  });

  test('submits form with valid data', async () => {
    const mockSubmit = jest.fn();
    render(<BugForm onSubmit={mockSubmit} />);
    
    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const reportedByInput = screen.getByLabelText(/reported by/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });
    
    await userEvent.type(titleInput, 'Test Bug');
    await userEvent.type(descriptionInput, 'This is a test bug description');
    await userEvent.type(reportedByInput, 'John Doe');
    fireEvent.click(submitButton);

await waitFor(() => {
  expect(mockSubmit).toHaveBeenCalledWith({
    title: 'Test Bug',
    description: 'This is a test bug description',
    priority: 'medium',
    reportedBy: 'John Doe'
  });
});
});
test('clears form after successful submission', async () => {
const mockSubmit = jest.fn();
render(<BugForm onSubmit={mockSubmit} />);
const titleInput = screen.getByLabelText(/title/i);
const descriptionInput = screen.getByLabelText(/description/i);
const reportedByInput = screen.getByLabelText(/reported by/i);

await userEvent.type(titleInput, 'Test Bug');
await userEvent.type(descriptionInput, 'Description');
await userEvent.type(reportedByInput, 'Tester');

const submitButton = screen.getByRole('button', { name: /submit/i });
fireEvent.click(submitButton);

await waitFor(() => {
  expect(titleInput.value).toBe('');
  expect(descriptionInput.value).toBe('');
  expect(reportedByInput.value).toBe('');
}); });
test('validates title length', async () => {
render(<BugForm onSubmit={jest.fn()} />);
const titleInput = screen.getByLabelText(/title/i);
const longTitle = 'a'.repeat(101);

await userEvent.type(titleInput, longTitle);

const submitButton = screen.getByRole('button', { name: /submit/i });
fireEvent.click(submitButton);

await waitFor(() => {
  expect(screen.getByText(/title must be less than 100 characters/i)).toBeInTheDocument();
});});
test('clears error when user starts typing', async () => {
render(<BugForm onSubmit={jest.fn()} />);
const submitButton = screen.getByRole('button', { name: /submit/i });
fireEvent.click(submitButton);

await waitFor(() => {
  expect(screen.getByText(/title is required/i)).toBeInTheDocument();
});

const titleInput = screen.getByLabelText(/title/i);
await userEvent.type(titleInput, 'T');

expect(screen.queryByText(/title is required/i)).not.toBeInTheDocument();});
test('allows selection of different priorities', async () => {
render(<BugForm onSubmit={jest.fn()} />);const prioritySelect = screen.getByLabelText(/priority/i);

await userEvent.selectOptions(prioritySelect, 'high');
expect(prioritySelect.value).toBe('high');

await userEvent.selectOptions(prioritySelect, 'low');
expect(prioritySelect.value).toBe('low');
});
});