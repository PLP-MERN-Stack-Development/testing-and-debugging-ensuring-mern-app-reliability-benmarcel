// Validation helper functions
const validateBugTitle = (title) => {
  if (!title || typeof title !== 'string') {
    return { valid: false, error: 'Title is required and must be a string' };
  }
  
  const trimmedTitle = title.trim();
  
  if (trimmedTitle.length === 0) {
    return { valid: false, error: 'Title cannot be empty' };
  }
  
  if (trimmedTitle.length > 100) {
    return { valid: false, error: 'Title cannot exceed 100 characters' };
  }
  
  return { valid: true, value: trimmedTitle };
};

const validateBugStatus = (status) => {
  const validStatuses = ['open', 'in-progress', 'resolved'];
  
  if (!status) {
    return { valid: true, value: 'open' }; // Default value
  }
  
  if (!validStatuses.includes(status)) {
    return { 
      valid: false, 
      error: `Status must be one of: ${validStatuses.join(', ')}` 
    };
  }
  
  return { valid: true, value: status };
};

const validateBugPriority = (priority) => {
  const validPriorities = ['low', 'medium', 'high'];
  
  if (!priority) {
    return { valid: true, value: 'medium' }; // Default value
  }
  
  if (!validPriorities.includes(priority)) {
    return { 
      valid: false, 
      error: `Priority must be one of: ${validPriorities.join(', ')}` 
    };
  }
  
  return { valid: true, value: priority };
};

module.exports = {
  validateBugTitle,
  validateBugStatus,
  validateBugPriority
};