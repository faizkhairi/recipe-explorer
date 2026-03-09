import { fetchRecipeById, fetchRecipesByCategory } from '@/lib/api';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import RecipeDetailClient from './RecipeDetailClient';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const recipe = await fetchRecipeById(id);

  if (!recipe) {
    return { title: 'Recipe Not Found — Recipe Explorer' };
  }

  const description = recipe.strInstructions.replace(/\r?\n/g, ' ').slice(0, 160);

  return {
    title: `${recipe.strMeal} — Recipe Explorer`,
    description,
    openGraph: {
      title: recipe.strMeal,
      description,
      images: [{ url: recipe.strMealThumb, alt: recipe.strMeal }],
      type: 'article',
      siteName: 'Recipe Explorer',
    },
    twitter: {
      card: 'summary_large_image',
      title: recipe.strMeal,
      description,
      images: [recipe.strMealThumb],
    },
  };
}

export default async function RecipeDetailPage({ params }: Props) {
  const { id } = await params;
  const recipe = await fetchRecipeById(id);

  if (!recipe) {
    notFound();
  }

  const related = (await fetchRecipesByCategory(recipe.strCategory))
    .filter(r => r.idMeal !== id)
    .slice(0, 3);

  const ingredients = Array.from({ length: 20 }, (_, i) => {
    const ingredient = recipe[`strIngredient${i + 1}` as keyof typeof recipe];
    const measure = recipe[`strMeasure${i + 1}` as keyof typeof recipe];
    return ingredient && String(ingredient).trim() ? String(measure || '') + ' ' + String(ingredient) : null;
  }).filter(Boolean);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.strMeal,
    image: recipe.strMealThumb,
    description: recipe.strInstructions.replace(/\r?\n/g, ' ').slice(0, 160),
    recipeCategory: recipe.strCategory,
    recipeCuisine: recipe.strArea,
    keywords: recipe.strTags || '',
    recipeIngredient: ingredients,
    recipeInstructions: recipe.strInstructions
      .split(/\r?\n/)
      .filter(Boolean)
      .map((text, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        text,
      })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RecipeDetailClient id={id} recipe={recipe} relatedRecipes={related} />
    </>
  );
}
