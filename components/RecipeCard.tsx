import Image from 'next/image';
import Link from 'next/link';
import { Recipe } from '@/lib/types';

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`/recipes/${recipe.idMeal}`} className="card block">
      <div className="relative h-48">
        <Image 
          src={recipe.strMealThumb} 
          alt={recipe.strMeal}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
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