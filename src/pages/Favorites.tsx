import RecipeCard from '../components/RecipeCard';
import RecipeModal from '../components/RecipeModal';
import { Recipe, RecipeDetail } from '../types';
import React, {useEffect, useState} from "react";
import api from "../services/services.ts";
import {FAVORITE_RECIPES_ENDPOINT, UNLIKE_RECIPE} from "../services/routes/recipeRouting.ts";

interface FavoritesProps {
    favorites: Recipe[];
    toggleFavorite: (recipe: Recipe) => void;
    viewRecipeDetails: (recipeId: string) => void;
    selectedRecipe: RecipeDetail | null;
    setSelectedRecipe: (recipe: RecipeDetail | null) => void;
}

const Favorites: React.FC<FavoritesProps> = ({toggleFavorite, viewRecipeDetails, selectedRecipe, setSelectedRecipe }) => {

    const [favorites, setFavorites] = useState<Recipe[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchLikedRecipes = async () => {
        try {
            setLoading(true);
            const response = await api.get(FAVORITE_RECIPES_ENDPOINT);
            console.log("Fetched liked recipes:", response.data);

            const likedRecipes = response.data.likedRecipes.map((item: any) => ({
                idMeal: item.idMeal,
                strMeal: item.strMeal,
                strMealThumb: item.strMealThumb,
                isFavorite: true
            }));

            setFavorites(likedRecipes);
            return response.data;
        } catch (error) {
            setError('Error fetching favorite recipes');
            console.error("Error fetching favorite recipes:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const removeFromFavorites = async (recipeId: string) => {
        try {
            await api.delete(`${UNLIKE_RECIPE}/${recipeId}`);

            setFavorites(prevFavorites =>
                prevFavorites.filter(recipe => recipe.idMeal !== recipeId)
            );

            console.log(`Recipe ${recipeId} removed from favorites`);
        } catch (error) {
            setError('Error removing recipe from favorites');
            console.error("Error removing from favorites:", error);
        }
    };

    const handleToggleFavorite = (recipe: Recipe) => {
        removeFromFavorites(recipe.idMeal).then(r => (r));
        toggleFavorite(recipe);
    };

    useEffect(() => {
        fetchLikedRecipes().then(r => (r));
    }, []);

    if (loading) {
        return <div className="p-4 text-center">Loading your favorites...</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-500">{error}</div>;
    }
    
    return (
        <div className="p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 md:mb-8">Favorite Recipes</h2>
            {favorites.length === 0 ? (
                <p className="text-base sm:text-lg md:text-xl">No favorite recipes yet.</p>
            ) : (
                <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
                    {favorites.map((recipe) => (
                        <RecipeCard
                            key={recipe.idMeal}
                            recipe={recipe}
                            isFavorite={true}
                            toggleFavorite={handleToggleFavorite}
                            viewRecipeDetails={viewRecipeDetails}
                        />
                    ))}
                </div>
                </div>
            )}
            <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
        </div>
    );
};

export default Favorites;