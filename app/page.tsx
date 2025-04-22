'use client'

import { useRecipes } from '@/hooks/useRecipes';
import RecipeCard from '@/components/RecipeCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorDisplay from '@/components/ErrorDisplay';
import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const { data: recipes, isLoading, isError, error, refetch } = useRecipes();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecipes = recipes?.filter(recipe => 
    recipe.strMeal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <section className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Browse Recipes</h2>
          <Link href="/recipes" className="btn btn-secondary">
            Featured Recipes
          </Link>
        </div>
        
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        {isLoading ? (
          <LoadingSpinner />
        ) : isError ? (
          <ErrorDisplay 
            message={error?.message || 'Failed to load recipes'} 
            onRetry={() => refetch()}
          />
        ) : (
          <>
            {filteredRecipes && filteredRecipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecipes.map(recipe => (
                  <RecipeCard key={recipe.idMeal} recipe={recipe} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-lg text-gray-600">No recipes found. Try a different search term.</p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}