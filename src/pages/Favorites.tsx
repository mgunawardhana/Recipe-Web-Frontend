import RecipeCard from '../components/RecipeCard';
import RecipeModal from '../components/RecipeModal';
import { Recipe, RecipeDetail } from '../types';
import React from "react";

interface FavoritesProps {
    favorites: Recipe[];
    toggleFavorite: (recipe: Recipe) => void;
    viewRecipeDetails: (recipeId: string) => void;
    selectedRecipe: RecipeDetail | null;
    setSelectedRecipe: (recipe: RecipeDetail | null) => void;
}

const Favorites: React.FC<FavoritesProps> = ({ favorites, toggleFavorite, viewRecipeDetails, selectedRecipe, setSelectedRecipe }) => {
    return (
        <div className="p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 md:mb-8">Favorite Recipes</h2>
            {favorites.length === 0 ? (
                <p className="text-base sm:text-lg md:text-xl">No favorite recipes yet.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
                    {favorites.map((recipe) => (
                        <RecipeCard
                            key={recipe.idMeal}
                            recipe={recipe}
                            isFavorite={true}
                            toggleFavorite={toggleFavorite}
                            viewRecipeDetails={viewRecipeDetails}
                        />
                    ))}
                </div>
            )}
            <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
        </div>
    );
};

export default Favorites;