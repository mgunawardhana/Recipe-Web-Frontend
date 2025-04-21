import React, { useState, useEffect } from 'react';
import { Category, Recipe, RecipeDetail } from '../types';
import RecipeCard from "../components/RecipeCard.tsx";
import RecipeModal from "../components/RecipeModal.tsx";

interface HomeProps {
    favorites: Recipe[];
    toggleFavorite: (recipe: Recipe) => void;
    viewRecipeDetails: (recipeId: string) => void;
    selectedRecipe: RecipeDetail | null;
    setSelectedRecipe: (recipe: RecipeDetail | null) => void;
}

const Home: React.FC<HomeProps> = ({
                                       favorites,
                                       toggleFavorite,
                                       viewRecipeDetails,
                                       selectedRecipe,
                                       setSelectedRecipe,
                                   }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('Pork');
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
                if (!response.ok) throw new Error('Failed to fetch categories');
                const data = await response.json();
                const selectedCategories = data.categories.slice(0, 5);
                setCategories(selectedCategories);
            } catch (err) {
                setError('Error fetching categories');
                console.error(err);
            }
        };
        fetchCategories().then(r => (r));
    }, []);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await fetch(
                    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`
                );
                if (!response.ok) throw new Error('Failed to fetch recipes');
                const data = await response.json();
                console.log('Recipes:', data.meals);
                setRecipes(data.meals || []);
            } catch (err) {
                setError('Error fetching recipes');
                console.error(err);
            }
        };
        fetchRecipes().then(r => (r));
    }, [selectedCategory]);

    if (error) {
        return <div className="p-4 sm:p-6 md:p-8 text-red-500 text-base sm:text-lg md:text-xl">{error}</div>;
    }

    return (
        <div className="p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
            <div className="flex flex-wrap gap-2 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
                {categories.map((category) => (
                    <button
                        key={category.idCategory}
                        onClick={() => setSelectedCategory(category.strCategory)}
                        className={`py-2 px-4 sm:px-6 rounded-full border text-sm sm:text-base md:text-lg ${
                            selectedCategory === category.strCategory
                                ? 'bg-pink-500 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                        } transition-colors duration-200`}
                    >
                        {category.strCategory}
                    </button>
                ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
                {recipes.map((recipe) => (
                    <RecipeCard
                        key={recipe.idMeal}
                        recipe={recipe}
                        isFavorite={favorites.some((fav) => fav.idMeal === recipe.idMeal)}
                        toggleFavorite={toggleFavorite}
                        viewRecipeDetails={viewRecipeDetails}
                    />
                ))}
            </div>
            <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
        </div>
    );
};

export default Home;