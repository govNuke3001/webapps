function validateUsername(username) {
  if (typeof username !== 'string') return 'Username must be a string';
  if (username.length < 5 || username.length > 15) return 'Username must be between 5 and 15 characters';
  return null;
}

function validateEmail(email) {
  if (typeof email !== 'string') return 'Email must be a string';
  const atIndex = email.indexOf('@');
  if (atIndex === -1 || !email.includes('.', atIndex)) {
    return 'Email must contain @ and have a dot after it';
  }
  return null;
}

function validateAge(age) {
  if (typeof age !== 'number' || !Number.isInteger(age)) return 'Age must be an integer number';
  if (age < 18 || age > 120) return 'Age must be between 18 and 120';
  return null;
}

function validateAgreement(isAgreed) {
  if (typeof isAgreed !== 'boolean' || !isAgreed) return 'Agreement must be accepted';
  return null;
}

function validatePhone(phone) {
  if (phone === undefined) return null;
  if (typeof phone !== 'string') return 'Phone must be a string if provided';
  if (!phone.startsWith('+7') || phone.length !== 12) {
    return 'Phone must start with +7 and have 12 characters';
  }
  return null;
}