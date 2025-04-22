import { Recipe, RecipeDetails, FeedbackForm } from './types';
import { sampleRecipes } from './sampleRecipes';

const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export async function fetchRecipes(): Promise<Recipe[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/search.php?f=b`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }
    
    const data = await response.json();
    return data.meals || sampleRecipes; // Use sample recipes as fallback
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
      // If not found in API, look in sample recipes
      const sampleRecipe = sampleRecipes.find(recipe => recipe.idMeal === id);
      return sampleRecipe || null;
    }
  } catch (error) {
    console.log('Looking for recipe in sample data due to API error:', error);
    const sampleRecipe = sampleRecipes.find(recipe => recipe.idMeal === id);
    return sampleRecipe || null;
  }
}

export async function submitFeedback(feedback: FeedbackForm): Promise<{ success: boolean }> {
  // In a real app, this would send data to a backend
  // Simulating an API call with a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Feedback submitted:', feedback);
      resolve({ success: true });
    }, 1000);
  });
}