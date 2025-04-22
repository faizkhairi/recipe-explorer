import { RecipeDetails } from '@/lib/types';
import Image from 'next/image';

interface IngredientsListProps {
  recipe: RecipeDetails;
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
          <li key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
            <div className="relative w-8 h-8">
              <Image 
                src={`https://www.themealdb.com/images/ingredients/${item.ingredient}-Small.png`} 
                alt={item.ingredient}
                fill
                className="object-cover"
              />
            </div>
            <span className="font-medium">{item.ingredient}:</span>
            <span>{item.measure}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}