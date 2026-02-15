'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useFavorites } from '@/hooks/useFavorites';
import { useRecipeDetails } from '@/hooks/useRecipes';
import { RecipeDetails } from '@/lib/types';
import FavoriteButton from '@/components/FavoriteButton';
import LoadingSpinner from '@/components/LoadingSpinner';

function FavoriteRecipeCard({ id }: { id: string }) {
  const { data: recipe, isLoading } = useRecipeDetails(id);
  const { isFavorite, toggleFavorite } = useFavorites();

  if (isLoading) {
    return (
      <div className="card animate-pulse">
        <div className="h-48 bg-gray-200" />
        <div className="p-4 space-y-2">
          <div className="h-6 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!recipe) return null;

  return (
    <Link href={`/recipes/${id}`} className="card block relative group">
      <div className="relative h-48">
        <Image
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-2 right-2">
          <FavoriteButton
            isFavorite={isFavorite(id)}
            onToggle={() => toggleFavorite(id)}
            className="bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow-sm"
          />
        </div>
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2 text-dark">{recipe.strMeal}</h2>
        <div className="flex justify-between text-sm">
          <span className="bg-secondary/20 text-secondary px-2 py-1 rounded">{recipe.strCategory}</span>
          <span className="bg-primary/20 text-primary px-2 py-1 rounded">{recipe.strArea}</span>
        </div>
      </div>
    </Link>
  );
}

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-dark">Your Favorites</h1>
        <Link href="/" className="text-primary hover:underline">
          Back to Home
        </Link>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-16">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No favorites yet</h2>
          <p className="text-gray-500 mb-6">Browse recipes and click the heart icon to save your favorites.</p>
          <Link href="/" className="btn btn-primary">
            Browse Recipes
          </Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">
            {favorites.length} recipe{favorites.length !== 1 ? 's' : ''} saved
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map(id => (
              <FavoriteRecipeCard key={id} id={id} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
