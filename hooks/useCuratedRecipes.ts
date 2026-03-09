import { useQueries } from '@tanstack/react-query';
import { fetchRecipeById } from '@/lib/api';
import { curatedRecipeIds } from '@/lib/curatedRecipes';
import { RecipeDetails } from '@/lib/types';

export function useCuratedRecipes() {
  const results = useQueries({
    queries: curatedRecipeIds.map(id => ({
      queryKey: ['recipe', id],
      queryFn: () => fetchRecipeById(id),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const recipes = results
    .map(r => r.data)
    .filter((r): r is RecipeDetails => r !== null && r !== undefined);

  const isLoading = results.some(r => r.isLoading);
  const isError = results.length > 0 && results.every(r => r.isError);

  return { recipes, isLoading, isError };
}
