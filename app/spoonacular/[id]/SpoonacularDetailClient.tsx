'use client'

import Image from 'next/image';
import Link from 'next/link';
import { SpoonacularRecipeDetails } from '@/lib/types';
import { useFavorites } from '@/hooks/useFavorites';
import FavoriteButton from '@/components/FavoriteButton';

interface Props {
  id: string;
  recipe: SpoonacularRecipeDetails;
}

export default function SpoonacularDetailClient({ id, recipe }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const recipeId = `spn_${id}`;

  const steps = recipe.analyzedInstructions?.[0]?.steps || [];
  const summary = recipe.summary?.replace(/<[^>]+>/g, '') || '';

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4">
        <Link href="/" className="text-primary hover:underline text-sm">← Back to Browse</Link>
      </div>

      <div className="card overflow-hidden mb-8">
        <div className="relative h-72 md:h-96">
          <Image
            src={recipe.image}
            alt={recipe.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 896px) 100vw, 896px"
          />
          <div className="absolute top-4 right-4">
            <FavoriteButton
              isFavorite={isFavorite(recipeId)}
              onToggle={() => toggleFavorite(recipeId)}
              className="bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md"
            />
          </div>
          <div className="absolute top-4 left-4">
            <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded font-medium">Spoonacular</span>
          </div>
        </div>

        <div className="p-6">
          <h1 className="text-3xl font-bold text-dark mb-4">{recipe.title}</h1>

          <div className="flex flex-wrap gap-2 mb-4">
            {recipe.cuisines?.map(c => (
              <span key={c} className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">{c}</span>
            ))}
            {recipe.dishTypes?.slice(0, 3).map(d => (
              <span key={d} className="bg-secondary/20 text-secondary px-3 py-1 rounded-full text-sm font-medium capitalize">{d}</span>
            ))}
          </div>

          <div className="flex gap-6 text-sm text-gray-600 mb-6">
            {recipe.readyInMinutes > 0 && (
              <div><span className="font-semibold text-dark">Ready in:</span> {recipe.readyInMinutes} min</div>
            )}
            {recipe.servings > 0 && (
              <div><span className="font-semibold text-dark">Servings:</span> {recipe.servings}</div>
            )}
          </div>

          {summary && (
            <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">{summary}</p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Ingredients */}
        <div className="md:col-span-1">
          <div className="card p-6">
            <h2 className="text-xl font-bold mb-4">Ingredients</h2>
            {recipe.extendedIngredients?.length > 0 ? (
              <ul className="space-y-2">
                {recipe.extendedIngredients.map((ing, i) => (
                  <li key={`${ing.id}-${i}`} className="flex items-start gap-2 text-sm">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span>{ing.original}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No ingredient data available.</p>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="md:col-span-2">
          <div className="card p-6">
            <h2 className="text-xl font-bold mb-4">Instructions</h2>
            {steps.length > 0 ? (
              <ol className="space-y-4">
                {steps.map(step => (
                  <li key={step.number} className="flex gap-4">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">
                      {step.number}
                    </span>
                    <p className="text-gray-700 text-sm leading-relaxed pt-1">{step.step}</p>
                  </li>
                ))}
              </ol>
            ) : recipe.instructions ? (
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {recipe.instructions.replace(/<[^>]+>/g, '')}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No instructions available.</p>
            )}
          </div>
        </div>
      </div>

      {recipe.sourceUrl && (
        <div className="mt-6 text-center text-sm text-gray-500">
          Recipe from{' '}
          <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            {recipe.creditsText || recipe.sourceUrl}
          </a>
        </div>
      )}
    </div>
  );
}
