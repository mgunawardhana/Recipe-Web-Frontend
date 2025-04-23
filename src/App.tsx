import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import Home from './pages/Home';
import AuthFormNew from "./components/AuthFormNew.tsx";
import {Recipe, RecipeDetail} from './types';
import Favorites from "./pages/Favorites.tsx";
import Navbar from "./components/Navbar.tsx";
import api from "./services/services.ts";
import {FETCH_BY_ID} from "./services/routes/recipeRouting.ts";

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
        try {
            const response = await api.get(`${FETCH_BY_ID}${recipeId}`);
            console.log("fetch by id", response);

            if (response.data && response.data.meal) {
                setSelectedRecipe(response.data.meal);
            } else {
                console.error("No recipe found with that ID");
            }
        } catch (error) {
            console.error("Error fetching recipe details:", error);
        }
    };

    if (!isAuthenticated) {
        return (

                <AuthFormNew
                    showRegister={showRegister}
                    setShowRegister={setShowRegister}
                    onLogin={handleLogin}
                    onRegister={handleRegister}
                />
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