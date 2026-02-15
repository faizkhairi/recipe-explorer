import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFeedback } from '@/hooks/useFeedback';

describe('useFeedback', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with empty feedback for unknown recipe', () => {
    const { result } = renderHook(() => useFeedback('unknown'));
    expect(result.current.feedback).toEqual([]);
  });

  it('loads feedback from localStorage', () => {
    const mockFeedback = {
      '1001': [
        {
          id: '1',
          recipeId: '1001',
          name: 'Alice',
          email: 'alice@test.com',
          rating: 5,
          comment: 'Delicious!',
          createdAt: '2025-01-01T00:00:00.000Z',
        },
      ],
    };
    localStorage.setItem('recipe-feedback', JSON.stringify(mockFeedback));

    const { result } = renderHook(() => useFeedback('1001'));
    expect(result.current.feedback).toHaveLength(1);
    expect(result.current.feedback[0].name).toBe('Alice');
  });

  it('returns empty for recipe with no feedback', () => {
    const mockFeedback = {
      '1001': [
        {
          id: '1',
          recipeId: '1001',
          name: 'Alice',
          email: 'alice@test.com',
          rating: 5,
          comment: 'Delicious!',
          createdAt: '2025-01-01T00:00:00.000Z',
        },
      ],
    };
    localStorage.setItem('recipe-feedback', JSON.stringify(mockFeedback));

    const { result } = renderHook(() => useFeedback('1002'));
    expect(result.current.feedback).toEqual([]);
  });
});
