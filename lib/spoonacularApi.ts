import { Recipe } from './types';
import { SpoonacularRecipeDetails } from './types';

// Browser-side client. Calls this app's /api/spoonacular routes, which hold the
// API key on the server. See lib/spoonacular.server.ts.

async function getJson<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url);
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export async function searchSpoonacularByName(query: string): Promise<Recipe[]> {
  if (!query) return [];
  return getJson(`/api/spoonacular/search?query=${encodeURIComponent(query)}`, []);
}

export async function searchSpoonacularByIngredient(ingredient: string): Promise<Recipe[]> {
  if (!ingredient) return [];
  return getJson(`/api/spoonacular/search?ingredient=${encodeURIComponent(ingredient)}`, []);
}

export async function fetchSpoonacularRecipeById(id: string): Promise<SpoonacularRecipeDetails | null> {
  if (!id) return null;
  return getJson(`/api/spoonacular/recipes/${encodeURIComponent(id)}`, null);
}
