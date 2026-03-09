import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchRecipesByIngredient } from '@/lib/api';

const mockMeals = [
  { idMeal: '52772', strMeal: 'Teriyaki Chicken', strCategory: 'Chicken', strArea: 'Japanese', strMealThumb: 'https://www.themealdb.com/images/media/meals/test.jpg' },
  { idMeal: '52773', strMeal: 'Chicken Handi', strCategory: 'Chicken', strArea: 'Indian', strMealThumb: 'https://www.themealdb.com/images/media/meals/test2.jpg' },
];

describe('fetchRecipesByIngredient', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns recipes containing the given ingredient', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ meals: mockMeals }),
    } as Response);

    const results = await fetchRecipesByIngredient('chicken');
    expect(results).toHaveLength(2);
    expect(results[0].strMeal).toBe('Teriyaki Chicken');
  });

  it('calls the correct TheMealDB ingredient filter endpoint', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ meals: mockMeals }),
    } as Response);

    await fetchRecipesByIngredient('garlic');
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining('/filter.php?i=garlic')
    );
  });

  it('returns empty array when no recipes match', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ meals: null }),
    } as Response);

    const results = await fetchRecipesByIngredient('xyzunknown');
    expect(results).toEqual([]);
  });

  it('returns empty array on network error', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'));

    const results = await fetchRecipesByIngredient('chicken');
    expect(results).toEqual([]);
  });

  it('encodes special characters in ingredient name', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ meals: [] }),
    } as Response);

    await fetchRecipesByIngredient('olive oil');
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining('olive%20oil')
    );
  });
});
