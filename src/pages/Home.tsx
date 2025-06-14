import React, {useEffect, useState} from 'react';
import {Category, Recipe, RecipeDetail} from '../types';
import RecipeCard from "../components/RecipeCard.tsx";
import RecipeModal from "../components/RecipeModal.tsx";
import {
    CATEGORIES_ENDPOINT,
    LIKED_RECIPE_ENDPOINT,
    RECIPES_BY_CATEGORY_ENDPOINT
} from "../services/routes/recipeRouting.ts";
import api from "../services/services.ts";
import {toast} from 'react-toastify';
import {AxiosError} from "axios";

interface HomeProps {
    favorites: Recipe[];
    toggleFavorite: (recipe: Recipe) => void;
    viewRecipeDetails: (recipeId: string) => void;
    selectedRecipe: RecipeDetail | null;
    setSelectedRecipe: (recipe: RecipeDetail | null) => void;
}

const Home: React.FC<HomeProps> = ({
                                       favorites, toggleFavorite, viewRecipeDetails, selectedRecipe, setSelectedRecipe,
                                   }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('Pork');
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = async () => {
        try {
            const response = await api.get(CATEGORIES_ENDPOINT);
            console.log("Fetched categories:", response.data);
            const selectedCategories = response.data.categories.slice(0, 5);
            setCategories(selectedCategories);
            return response.data;
        } catch (error) {
            setError('Error fetching categories');
            console.error("Error fetching categories:", error);
            throw error;
        }
    };

    const fetchRecipes = async (category: string) => {
        try {
            const response = await api.get(`${RECIPES_BY_CATEGORY_ENDPOINT}${category}`);
            console.log("Fetched recipes:", response.data);
            setRecipes(response.data.meals || []);
            return response.data;
        } catch (error) {
            setError('Error fetching recipes');
            console.error("Error fetching recipes:", error);
            throw error;
        }
    };

    const handleToggleFavorite = async (recipe: Recipe) => {
        try {

            const response = await api.post(LIKED_RECIPE_ENDPOINT, {
                idMeal: recipe.idMeal, strMeal: recipe.strMeal, strMealThumb: recipe.strMealThumb
            });

            if (response.data?.message === "Recipe liked successfully") {
                toast.success(`${recipe.strMeal} added to favorites`);
                toggleFavorite(recipe);
            } else if (response.data?.message === "Recipe already liked") {
                toast.info(`${recipe.strMeal} is already in your favorites`);
            } else {
                toast.success(`Favorite status updated for ${recipe.strMeal}`);
                toggleFavorite(recipe);
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError) {

                const errorMessage = error.response?.data?.message || "Error updating favorite status";

                if (error.response?.status === 401) {
                    toast.error("Please log in to save favorites");
                } else if (error.response?.status === 404) {
                    toast.error("Recipe not found");
                } else if (error.response?.status === 429) {
                    toast.error("Too many requests. Please try again later");
                } else {
                    toast.error(errorMessage);
                }

                console.error('Error updating recipe favorite status:', error);

            } else {
                toast.error("An unexpected error occurred");
                console.error('Unexpected error:', error);
            }
        }
    };


    useEffect(() => {
        fetchCategories().then(r => (r));
    }, []);

    useEffect(() => {
        fetchRecipes(selectedCategory).then(r => (r));
    }, [selectedCategory]);

    if (error) {
        return <div className="p-4 sm:p-6 md:p-8 text-red-500 text-base sm:text-lg md:text-xl">{error}</div>;
    }

    return (<div className="p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
            {categories.map((category) => (<button
                key={category.idCategory}
                onClick={() => setSelectedCategory(category.strCategory)}
                className={`py-1.5 px-4 sm:px-6 rounded-full border ${selectedCategory === category.strCategory ? 'bg-pink-500 text-white border-pink-500' : 'bg-white text-pink-500 border-pink-500 hover:bg-pink-50'} transition-colors duration-200 text-sm sm:text-base md:text-lg`}
            >
                {category.strCategory}
            </button>))}
        </div>
        <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
            {recipes.map((recipe) => (<RecipeCard
                key={recipe.idMeal}
                recipe={recipe}
                isFavorite={favorites.some((fav) => fav.idMeal === recipe.idMeal)}
                toggleFavorite={handleToggleFavorite}
                viewRecipeDetails={viewRecipeDetails}
            />))}
        </div>
        <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)}/>
    </div>);
};

export default Home;