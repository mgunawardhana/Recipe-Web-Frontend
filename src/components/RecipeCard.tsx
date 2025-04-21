import React from 'react';
import { Recipe } from '../types';

interface RecipeCardProps {
    recipe: Recipe;
    isFavorite: boolean;
    toggleFavorite: (recipe: Recipe) => void;
    viewRecipeDetails: (recipeId: string) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, isFavorite, toggleFavorite, viewRecipeDetails }) => {
    return (
        <div className="bg-gray-100 rounded-lg p-4 text-center">
            <img
                src={recipe.strMealThumb || 'https://via.placeholder.com/150'} // Fallback image
                alt={recipe.strMeal}
                className="w-full h-40 rounded-lg mb-2 object-cover" // Match your styling
                onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/150'; // Replace broken images
                }}
            />
            <p className="text-sm">Soups</p>
            <p className="font-semibold">{recipe.strMeal}</p>
            <div className="flex justify-center space-x-2 mt-2">
                <button onClick={() => toggleFavorite(recipe)}>
                    <svg
                        className={`w-6 h-6 ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                    </svg>
                </button>
                <button onClick={() => viewRecipeDetails(recipe.idMeal)} className="text-blue-500">
                    View Details
                </button>
            </div>
        </div>
    );
};

export default RecipeCard;