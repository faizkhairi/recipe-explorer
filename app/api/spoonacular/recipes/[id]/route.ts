import { NextResponse } from 'next/server';
import { fetchSpoonacularRecipeById } from '@/lib/spoonacular.server';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recipe = await fetchSpoonacularRecipeById(id);

  if (!recipe) {
    return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
  }

  return NextResponse.json(recipe, {
    headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' },
  });
}
