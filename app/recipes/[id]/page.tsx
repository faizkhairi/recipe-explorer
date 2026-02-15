'use client'

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useRecipeDetails } from '@/hooks/useRecipes';
import { useFavorites } from '@/hooks/useFavorites';
import { useFeedback } from '@/hooks/useFeedback';
import IngredientsList from '@/components/IngredientsList';
import FeedbackForm from '@/components/FeedbackForm';
import FeedbackList from '@/components/FeedbackList';
import FavoriteButton from '@/components/FavoriteButton';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorDisplay from '@/components/ErrorDisplay';

export default function RecipeDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: recipe, isLoading, isError, error, refetch } = useRecipeDetails(id);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { feedback, refreshFeedback } = useFeedback(id);

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    return (
      <ErrorDisplay
        message={error?.message || 'Failed to load recipe'}
        onRetry={() => refetch()}
      />
    );
  }

  if (!recipe) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-dark mb-2">Recipe Not Found</h2>
        <p className="text-gray-600 mb-6">The recipe you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/" className="btn btn-primary">
          Browse Recipes
        </Link>
      </div>
    );
  }

  const tags = recipe.strTags?.split(',').filter(Boolean) || [];

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/" className="inline-flex items-center text-primary hover:underline mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Recipes
      </Link>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative h-64 md:h-96">
          <Image
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 896px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{recipe.strMeal}</h1>
                <div className="flex gap-2 flex-wrap">
                  <span className="bg-secondary/90 text-white px-3 py-1 rounded-full text-sm">
                    {recipe.strCategory}
                  </span>
                  <span className="bg-primary/90 text-white px-3 py-1 rounded-full text-sm">
                    {recipe.strArea}
                  </span>
                  {tags.map(tag => (
                    <span key={tag} className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
              <FavoriteButton
                isFavorite={isFavorite(id)}
                onToggle={() => toggleFavorite(id)}
                className="bg-white/20 backdrop-blur-sm rounded-full p-2"
              />
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <IngredientsList recipe={recipe} />

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Instructions</h3>
            <div className="prose max-w-none">
              {recipe.strInstructions.split(/\r?\n/).filter(Boolean).map((paragraph, i) => (
                <p key={i} className="text-gray-700 mb-3 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {recipe.strYoutube && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Video Tutorial</h3>
              <a
                href={recipe.strYoutube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 btn btn-primary"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
                  <polygon fill="white" points="9.545,15.568 15.818,12 9.545,8.432" />
                </svg>
                Watch on YouTube
              </a>
            </div>
          )}

          <FeedbackList feedback={feedback} />
          <FeedbackForm recipeId={id} onSuccess={refreshFeedback} />
        </div>
      </div>
    </div>
  );
}
