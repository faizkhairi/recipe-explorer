import { describe, it, expect } from 'vitest';

// Pure validation logic extracted for unit testing — mirrors FeedbackForm's validate()
function validateFeedback(form: { name: string; email: string; comment: string }) {
  const errors: Record<string, string> = {};
  if (form.name.trim().length < 2) errors.name = 'Name must be at least 2 characters.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address.';
  if (form.comment.trim().length < 10) errors.comment = 'Comment must be at least 10 characters.';
  return errors;
}

describe('Feedback form validation', () => {
  it('passes with valid inputs', () => {
    const errors = validateFeedback({
      name: 'Faiz',
      email: 'faiz@example.com',
      comment: 'This recipe is absolutely delicious!',
    });
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it('rejects name shorter than 2 characters', () => {
    const errors = validateFeedback({ name: 'F', email: 'faiz@example.com', comment: 'Great recipe overall!' });
    expect(errors.name).toBeDefined();
    expect(errors.email).toBeUndefined();
    expect(errors.comment).toBeUndefined();
  });

  it('rejects invalid email formats', () => {
    const invalidEmails = ['notanemail', 'missing@', '@nodomain.com', 'spaces in@email.com'];
    invalidEmails.forEach(email => {
      const errors = validateFeedback({ name: 'Faiz', email, comment: 'Great recipe overall!' });
      expect(errors.email).toBeDefined();
    });
  });

  it('accepts valid email formats', () => {
    const validEmails = ['faiz@example.com', 'user+tag@sub.domain.org', 'a@b.co'];
    validEmails.forEach(email => {
      const errors = validateFeedback({ name: 'Faiz', email, comment: 'Great recipe overall!' });
      expect(errors.email).toBeUndefined();
    });
  });

  it('rejects comment shorter than 10 characters', () => {
    const errors = validateFeedback({ name: 'Faiz', email: 'faiz@example.com', comment: 'Good' });
    expect(errors.comment).toBeDefined();
  });

  it('trims whitespace before validating name and comment length', () => {
    const errors = validateFeedback({
      name: '   ',        // looks like content but is all whitespace
      email: 'faiz@example.com',
      comment: '          ', // same — 10 spaces but no real content
    });
    expect(errors.name).toBeDefined();
    expect(errors.comment).toBeDefined();
  });

  it('returns all errors simultaneously when all fields are invalid', () => {
    const errors = validateFeedback({ name: '', email: 'bad', comment: 'short' });
    expect(errors.name).toBeDefined();
    expect(errors.email).toBeDefined();
    expect(errors.comment).toBeDefined();
  });
});
