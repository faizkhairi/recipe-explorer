import { fetchSpoonacularRecipeById } from '@/lib/spoonacularApi';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import SpoonacularDetailClient from './SpoonacularDetailClient';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const recipe = await fetchSpoonacularRecipeById(id);

  if (!recipe) return { title: 'Recipe Not Found — Recipe Explorer' };

  const description = recipe.summary.replace(/<[^>]+>/g, '').slice(0, 160);

  return {
    title: `${recipe.title} — Recipe Explorer`,
    description,
    openGraph: {
      title: recipe.title,
      description,
      images: [{ url: recipe.image, alt: recipe.title }],
      type: 'article',
      siteName: 'Recipe Explorer',
    },
    twitter: {
      card: 'summary_large_image',
      title: recipe.title,
      description,
      images: [recipe.image],
    },
  };
}

export default async function SpoonacularDetailPage({ params }: Props) {
  const { id } = await params;
  const recipe = await fetchSpoonacularRecipeById(id);

  if (!recipe) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.title,
    image: recipe.image,
    description: recipe.summary.replace(/<[^>]+>/g, '').slice(0, 160),
    recipeCategory: recipe.dishTypes?.[0] || '',
    recipeCuisine: recipe.cuisines?.[0] || '',
    prepTime: `PT${recipe.readyInMinutes}M`,
    recipeYield: `${recipe.servings} servings`,
    recipeIngredient: recipe.extendedIngredients?.map(i => i.original) || [],
    recipeInstructions: recipe.analyzedInstructions?.[0]?.steps?.map(s => ({
      '@type': 'HowToStep',
      position: s.number,
      text: s.step,
    })) || [],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SpoonacularDetailClient id={id} recipe={recipe} />
    </>
  );
}
