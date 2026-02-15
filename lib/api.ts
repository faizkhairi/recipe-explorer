import { Recipe, RecipeDetails, FeedbackForm } from './types';
import { sampleRecipes } from './sampleRecipes';

const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export async function fetchRecipes(query?: string): Promise<Recipe[]> {
  try {
    const endpoint = query
      ? `${API_BASE_URL}/search.php?s=${encodeURIComponent(query)}`
      : `${API_BASE_URL}/search.php?s=`;

    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }

    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.log('Using sample recipes due to API error:', error);
    return sampleRecipes;
  }
}

export async function fetchRecipeById(id: string): Promise<RecipeDetails | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/lookup.php?i=${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch recipe details');
    }

    const data = await response.json();

    if (data.meals) {
      return data.meals[0];
    } else {
      const sampleRecipe = sampleRecipes.find(recipe => recipe.idMeal === id);
      return sampleRecipe || null;
    }
  } catch (error) {
    console.log('Looking for recipe in sample data due to API error:', error);
    const sampleRecipe = sampleRecipes.find(recipe => recipe.idMeal === id);
    return sampleRecipe || null;
  }
}

export async function fetchCategories(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/list.php?c=list`);

    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    const data = await response.json();
    return data.meals?.map((m: { strCategory: string }) => m.strCategory) || [];
  } catch {
    return ['Beef', 'Chicken', 'Dessert', 'Lamb', 'Pasta', 'Seafood', 'Vegetarian'];
  }
}

export async function fetchRecipesByCategory(category: string): Promise<Recipe[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);

    if (!response.ok) {
      throw new Error('Failed to fetch recipes by category');
    }

    const data = await response.json();
    return data.meals || [];
  } catch {
    return sampleRecipes.filter(r => r.strCategory === category);
  }
}

export async function submitFeedback(feedback: FeedbackForm): Promise<{ success: boolean }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stored = localStorage.getItem('recipe-feedback') || '{}';
      const allFeedback = JSON.parse(stored);
      const recipeFeedback = allFeedback[feedback.recipeId] || [];
      recipeFeedback.push({
        ...feedback,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      });
      allFeedback[feedback.recipeId] = recipeFeedback;
      localStorage.setItem('recipe-feedback', JSON.stringify(allFeedback));

      resolve({ success: true });
    }, 500);
  });
}
