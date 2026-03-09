'use client'

import { useQuery } from '@tanstack/react-query';
import { fetchRecipes, fetchRecipeById, fetchCategories, fetchRecipesByCategory, fetchRecipesByIngredient } from '@/lib/api';

export function useRecipes(searchQuery?: string) {
  return useQuery({
    queryKey: ['recipes', searchQuery || ''],
    queryFn: () => fetchRecipes(searchQuery),
  });
}

export function useRecipeDetails(id: string) {
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: () => fetchRecipeById(id),
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });
}

export function useRecipesByCategory(category: string) {
  return useQuery({
    queryKey: ['recipes', 'category', category],
    queryFn: () => fetchRecipesByCategory(category),
    enabled: !!category,
  });
}

export function useRecipesByIngredient(ingredient: string) {
  return useQuery({
    queryKey: ['recipes', 'ingredient', ingredient],
    queryFn: () => fetchRecipesByIngredient(ingredient),
    enabled: !!ingredient,
    staleTime: 5 * 60 * 1000,
  });
}
