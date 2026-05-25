export const validateSignup = ({ name, email, password }) => {
  const fieldErrors = {};

  if (!name?.trim()) fieldErrors.name = 'Name is required';
  else if (name.trim().length > 80) fieldErrors.name = 'Name is too long';

  if (!email?.trim()) fieldErrors.email = 'Email is required';
  else if (!/^\S+@\S+\.\S+$/.test(email)) fieldErrors.email = 'Enter a valid email';

  if (!password) fieldErrors.password = 'Password is required';
  else {
    if (password.length < 8) fieldErrors.password = 'At least 8 characters';
    else {
      if (!/[a-z]/.test(password)) fieldErrors.password = 'Include a lowercase letter';
      else if (!/[A-Z]/.test(password)) fieldErrors.password = 'Include an uppercase letter';
      else if (!/[0-9]/.test(password)) fieldErrors.password = 'Include a number';
    }
  }

  return {
    valid: Object.keys(fieldErrors).length === 0,
    fieldErrors,
  };
};

export const validateLogin = ({ email, password }) => {
  const fieldErrors = {};

  if (!email?.trim()) fieldErrors.email = 'Email is required';
  else if (!/^\S+@\S+\.\S+$/.test(email)) fieldErrors.email = 'Enter a valid email';

  if (!password) fieldErrors.password = 'Password is required';

  return {
    valid: Object.keys(fieldErrors).length === 0,
    fieldErrors,
  };
};
