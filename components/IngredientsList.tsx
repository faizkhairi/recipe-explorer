'use client'

import { useState } from 'react';
import { RecipeDetails } from '@/lib/types';
import Image from 'next/image';

interface IngredientsListProps {
  recipe: RecipeDetails;
}

function IngredientItem({ ingredient, measure }: { ingredient: string; measure: string }) {
  const [imgError, setImgError] = useState(false);

  return (
    <li className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
      <div className="relative w-8 h-8 flex-shrink-0">
        {imgError ? (
          <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center text-primary text-xs font-bold">
            {ingredient[0].toUpperCase()}
          </div>
        ) : (
          <Image
            src={`https://www.themealdb.com/images/ingredients/${ingredient}-Small.png`}
            alt={ingredient}
            fill
            className="object-cover"
            onError={() => setImgError(true)}
          />
        )}
      </div>
      <span className="font-medium">{ingredient}:</span>
      <span>{measure}</span>
    </li>
  );
}

export default function IngredientsList({ recipe }: IngredientsListProps) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}` as keyof RecipeDetails];
    const measure = recipe[`strMeasure${i}` as keyof RecipeDetails];

    if (ingredient && ingredient.trim() !== '') {
      ingredients.push({
        ingredient,
        measure: measure || '',
      });
    }
  }

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">Ingredients</h3>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {ingredients.map((item, index) => (
          <IngredientItem key={index} ingredient={item.ingredient} measure={item.measure} />
        ))}
      </ul>
    </div>
  );
}
