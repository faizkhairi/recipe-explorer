import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchRecipes, fetchRecipeById, fetchCategories, submitFeedback } from '@/lib/api';

const mockMeal = {
  idMeal: '52772',
  strMeal: 'Teriyaki Chicken Casserole',
  strCategory: 'Chicken',
  strArea: 'Japanese',
  strInstructions: 'Cook the chicken.',
  strMealThumb: 'https://www.themealdb.com/images/media/meals/test.jpg',
  strTags: 'Meat,Casserole',
  strYoutube: '',
};

describe('API functions', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  describe('fetchRecipes', () => {
    it('returns recipes from API', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ meals: [mockMeal] }),
      } as Response);

      const recipes = await fetchRecipes();
      expect(recipes).toHaveLength(1);
      expect(recipes[0].strMeal).toBe('Teriyaki Chicken Casserole');
    });

    it('returns empty array when API returns null meals', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ meals: null }),
      } as Response);

      const recipes = await fetchRecipes();
      expect(recipes).toEqual([]);
    });

    it('falls back to sample recipes on network error', async () => {
      vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'));

      const recipes = await fetchRecipes();
      expect(recipes.length).toBeGreaterThan(0);
      expect(recipes[0].idMeal).toBe('1001');
    });

    it('passes search query to API', async () => {
      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ meals: [mockMeal] }),
      } as Response);

      await fetchRecipes('chicken');
      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining('search.php?s=chicken')
      );
    });
  });

  describe('fetchRecipeById', () => {
    it('returns recipe details from API', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ meals: [mockMeal] }),
      } as Response);

      const recipe = await fetchRecipeById('52772');
      expect(recipe).not.toBeNull();
      expect(recipe?.strMeal).toBe('Teriyaki Chicken Casserole');
    });

    it('falls back to sample recipes when not found in API', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ meals: null }),
      } as Response);

      const recipe = await fetchRecipeById('1001');
      expect(recipe).not.toBeNull();
      expect(recipe?.strMeal).toBe('Spaghetti Carbonara');
    });

    it('returns null for unknown recipe', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ meals: null }),
      } as Response);

      const recipe = await fetchRecipeById('99999');
      expect(recipe).toBeNull();
    });
  });

  describe('fetchCategories', () => {
    it('returns category list from API', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          meals: [{ strCategory: 'Beef' }, { strCategory: 'Chicken' }],
        }),
      } as Response);

      const categories = await fetchCategories();
      expect(categories).toEqual(['Beef', 'Chicken']);
    });

    it('returns fallback categories on error', async () => {
      vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('fail'));

      const categories = await fetchCategories();
      expect(categories).toContain('Beef');
      expect(categories).toContain('Chicken');
    });
  });

  describe('submitFeedback', () => {
    it('stores feedback in localStorage', async () => {
      const feedback = {
        recipeId: '1001',
        name: 'Test User',
        email: 'test@test.com',
        rating: 5,
        comment: 'Great recipe!',
      };

      const result = await submitFeedback(feedback);
      expect(result.success).toBe(true);

      const stored = JSON.parse(localStorage.getItem('recipe-feedback') || '{}');
      expect(stored['1001']).toHaveLength(1);
      expect(stored['1001'][0].name).toBe('Test User');
    });
  });
});
