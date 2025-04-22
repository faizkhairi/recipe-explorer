'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { sampleRecipes } from '@/lib/sampleRecipes';

export default function RecipesPage() {
  const router = useRouter();

  // Redirect to home after a brief delay
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 30000); // 30 seconds

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-dark">Featured Recipes</h1>
        <Link href="/" className="text-primary hover:underline">
          Back to Home
        </Link>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <p className="text-yellow-700">
          Example of 5 Featured Recipes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sampleRecipes.map(recipe => (
          <Link href={`/recipes/${recipe.idMeal}`} key={recipe.idMeal} className="card group">
            <div className="relative h-56 overflow-hidden">
              <Image 
                src={recipe.strMealThumb} 
                alt={recipe.strMeal}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h2 className="text-xl font-bold text-white">{recipe.strMeal}</h2>
                <p className="text-white/90 text-sm">{recipe.strArea} • {recipe.strCategory}</p>
              </div>
            </div>
            <div className="p-4">
              <p className="line-clamp-2 text-gray-600">
                {recipe.strInstructions.split('\r\n')[0]}
              </p>
              <div className="mt-4 flex items-center text-sm text-primary font-medium">
                View Recipe Details
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}