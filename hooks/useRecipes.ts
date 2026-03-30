'use client'

import { useQuery } from '@tanstack/react-query';
import { fetchRecipes, fetchRecipeById, fetchCategories, fetchRecipesByCategory, fetchAreas, fetchRecipesByArea, fetchRecipesByIngredient } from '@/lib/api';
import { searchSpoonacularByName, searchSpoonacularByIngredient, fetchSpoonacularRecipeById } from '@/lib/spoonacularApi';

export function useRecipes(searchQuery?: string) {
  return useQuery({
    queryKey: ['recipes', searchQuery || ''],
    queryFn: () => fetchRecipes(searchQuery!),
    enabled: !!searchQuery,
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

export function useAreas() {
  return useQuery({
    queryKey: ['areas'],
    queryFn: fetchAreas,
    staleTime: 10 * 60 * 1000,
  });
}

export function useRecipesByArea(area: string) {
  return useQuery({
    queryKey: ['recipes', 'area', area],
    queryFn: () => fetchRecipesByArea(area),
    enabled: !!area,
    staleTime: 5 * 60 * 1000,
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

export function useSpoonacularSearch(query: string) {
  return useQuery({
    queryKey: ['spoonacular', 'name', query],
    queryFn: () => searchSpoonacularByName(query),
    enabled: !!query && query.length >= 2,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSpoonacularIngredientSearch(ingredient: string) {
  return useQuery({
    queryKey: ['spoonacular', 'ingredient', ingredient],
    queryFn: () => searchSpoonacularByIngredient(ingredient),
    enabled: !!ingredient && ingredient.length >= 2,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSpoonacularRecipeDetails(id: string) {
  return useQuery({
    queryKey: ['spoonacular', 'recipe', id],
    queryFn: () => fetchSpoonacularRecipeById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}
