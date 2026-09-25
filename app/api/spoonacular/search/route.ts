import { NextResponse } from 'next/server';
import { searchSpoonacularByName, searchSpoonacularByIngredient } from '@/lib/spoonacular.server';

const MAX_TERM_LENGTH = 100;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query')?.trim() ?? '';
  const ingredient = searchParams.get('ingredient')?.trim() ?? '';

  if ((!query && !ingredient) || query.length > MAX_TERM_LENGTH || ingredient.length > MAX_TERM_LENGTH) {
    return NextResponse.json({ error: 'Provide a query or ingredient of up to 100 characters' }, { status: 400 });
  }

  const recipes = query ? await searchSpoonacularByName(query) : await searchSpoonacularByIngredient(ingredient);

  // Cache hits at the edge so repeated searches don't spend the Spoonacular quota.
  // Empty results are not cached: they may come from an upstream failure.
  const cacheControl = recipes.length > 0 ? 'public, s-maxage=3600, stale-while-revalidate=86400' : 'no-store';
  return NextResponse.json(recipes, { headers: { 'Cache-Control': cacheControl } });
}
