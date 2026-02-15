import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFavorites } from '@/hooks/useFavorites';

describe('useFavorites', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with empty favorites', () => {
    const { result } = renderHook(() => useFavorites());
    expect(result.current.favorites).toEqual([]);
  });

  it('adds a recipe to favorites', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite('1001');
    });

    expect(result.current.favorites).toContain('1001');
    expect(result.current.isFavorite('1001')).toBe(true);
  });

  it('removes a recipe from favorites', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite('1001');
    });
    expect(result.current.isFavorite('1001')).toBe(true);

    act(() => {
      result.current.toggleFavorite('1001');
    });
    expect(result.current.isFavorite('1001')).toBe(false);
  });

  it('persists favorites to localStorage', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite('1001');
      result.current.toggleFavorite('1002');
    });

    const stored = JSON.parse(localStorage.getItem('recipe-favorites') || '[]');
    expect(stored).toContain('1001');
    expect(stored).toContain('1002');
  });

  it('loads favorites from localStorage on mount', () => {
    localStorage.setItem('recipe-favorites', JSON.stringify(['1003', '1004']));

    const { result } = renderHook(() => useFavorites());
    expect(result.current.isFavorite('1003')).toBe(true);
    expect(result.current.isFavorite('1004')).toBe(true);
  });
});
