// src/utils/validatePassword.ts
export const isStrongPassword = (password: string): boolean => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChar
  );
};

export const getPasswordStrength = (password: string): {
  strength: 'weak' | 'medium' | 'strong';
  feedback: string[];
} => {
  const feedback: string[] = [];
  
  if (password.length < 8) {
    feedback.push('At least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    feedback.push('One uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    feedback.push('One lowercase letter');
  }
  if (!/\d/.test(password)) {
    feedback.push('One number');
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    feedback.push('One special character');
  }

  const strength = feedback.length >= 3 ? 'weak' : feedback.length >= 1 ? 'medium' : 'strong';
  
  return { strength, feedback };
};