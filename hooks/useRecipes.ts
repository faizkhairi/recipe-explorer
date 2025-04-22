'use client'

import { useQuery } from '@tanstack/react-query';
import { fetchRecipes, fetchRecipeById } from '@/lib/api';

export function useRecipes() {
  return useQuery({
    queryKey: ['recipes'],
    queryFn: fetchRecipes,
  });
}

export function useRecipeDetails(id: string) {
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: () => fetchRecipeById(id),
    enabled: !!id,
  });
}