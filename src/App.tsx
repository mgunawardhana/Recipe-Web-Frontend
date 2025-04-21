import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import AuthForm from './components/AuthForm';
import {Recipe, RecipeDetail } from './types';
import Favorites from "./pages/Favorites.tsx";
import Navbar from "./components/Navbar.tsx";

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [showRegister, setShowRegister] = useState<boolean>(false);
    const [favorites, setFavorites] = useState<Recipe[]>([]);
    const [selectedRecipe, setSelectedRecipe] = useState<RecipeDetail | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = (email: string, password: string) => {
        if (email && password) {
            localStorage.setItem('user', email);
            setIsAuthenticated(true);
        }
    };

    const handleRegister = (email: string, password: string, confirmPassword: string) => {
        if (password !== confirmPassword) return false;
        if (email && password) {
            localStorage.setItem('user', email);
            setIsAuthenticated(true);
            return true;
        }
        return false;
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setIsAuthenticated(false);
    };

    const toggleFavorite = (recipe: Recipe) => {
        const isFavorite = favorites.some((fav) => fav.idMeal === recipe.idMeal);
        if (isFavorite) {
            setFavorites(favorites.filter((fav) => fav.idMeal !== recipe.idMeal));
        } else {
            setFavorites([...favorites, recipe]);
        }
    };

    const viewRecipeDetails = async (recipeId: string) => {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`);
        const data = await response.json();
        setSelectedRecipe(data.meals[0]);
    };

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 w-full max-w-2xl mx-auto">
                <AuthForm
                    showRegister={showRegister}
                    setShowRegister={setShowRegister}
                    onLogin={handleLogin}
                    onRegister={handleRegister}
                />
            </div>
        );
    }

    return (
        <Router>
            <Navbar onLogout={handleLogout} />
            <Routes>
                <Route
                    path="/"
                    element={
                        <Home
                            favorites={favorites}
                            toggleFavorite={toggleFavorite}
                            viewRecipeDetails={viewRecipeDetails}
                            selectedRecipe={selectedRecipe}
                            setSelectedRecipe={setSelectedRecipe}
                        />
                    }
                />
                <Route
                    path="/favorites"
                    element={
                        <Favorites
                            favorites={favorites}
                            toggleFavorite={toggleFavorite}
                            viewRecipeDetails={viewRecipeDetails}
                            selectedRecipe={selectedRecipe}
                            setSelectedRecipe={setSelectedRecipe}
                        />
                    }
                />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

export default App;