import { Recipe } from './types';
import { SpoonacularRecipeDetails } from './types';

const SPOONACULAR_BASE = 'https://api.spoonacular.com';
const API_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY || '';

function toRecipe(r: { id: number; title: string; image: string }): Recipe {
  return {
    idMeal: `spn_${r.id}`,
    strMeal: r.title,
    strCategory: '',
    strArea: 'Spoonacular',
    strInstructions: '',
    strMealThumb: r.image,
    strTags: '',
    strYoutube: '',
  };
}

export async function searchSpoonacularByName(query: string): Promise<Recipe[]> {
  if (!query || !API_KEY) return [];
  try {
    const res = await fetch(
      `${SPOONACULAR_BASE}/recipes/complexSearch?query=${encodeURIComponent(query)}&number=24&apiKey=${API_KEY}`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).map(toRecipe);
  } catch {
    return [];
  }
}

export async function searchSpoonacularByIngredient(ingredient: string): Promise<Recipe[]> {
  if (!ingredient || !API_KEY) return [];
  try {
    const res = await fetch(
      `${SPOONACULAR_BASE}/recipes/complexSearch?includeIngredients=${encodeURIComponent(ingredient)}&number=24&apiKey=${API_KEY}`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).map(toRecipe);
  } catch {
    return [];
  }
}

export async function fetchSpoonacularRecipeById(id: string): Promise<SpoonacularRecipeDetails | null> {
  if (!API_KEY) return null;
  try {
    const res = await fetch(
      `${SPOONACULAR_BASE}/recipes/${id}/information?apiKey=${API_KEY}`
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
