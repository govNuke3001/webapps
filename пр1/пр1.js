const validateUsername = (username) => {
  if (typeof username !== 'string') return 'Error: username must be a string';
  if (username.length < 5 || username.length > 15) return 'Error: username length must be between 5 and 15 characters';
  return null;
};

const validateEmail = (email) => {
  if (typeof email !== 'string') return 'Error: email must be a string';
  const atIndex = email.indexOf('@');
  if (atIndex === -1 || email.indexOf('.', atIndex) === -1) return 'Error: email must contain \'@\' and a dot \'.\' after it';
  return null;
};

const validateAge = (age) => {
  if (!Number.isInteger(age)) return 'Error: age must be an integer number';
  if (age < 18 || age > 120) return 'Error: age must be between 18 and 120';
  return null;
};

const validateAgreement = (isAgreed) => {
  if (typeof isAgreed !== 'boolean') return 'Error: agreement must be boolean';
  if (!isAgreed) return 'Error: agreement must be true';
  return null;
};

const validatePhone = (phone) => {
  if (phone === undefined) return null;
  if (typeof phone !== 'string') return 'Error: phone must be a string or undefined';
  if (phone.length !== 12 || !phone.startsWith('+7')) return 'Error: phone must start with \'+7\' and be 12 characters long';
  return null;
};