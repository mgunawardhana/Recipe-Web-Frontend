import React from "react";
import { RecipeDetail } from '../types';

interface RecipeModalProps {
    recipe: RecipeDetail | null;
    onClose: () => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose }) => {
    if (!recipe) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg max-w-lg w-full">
                <h2 className="text-xl font-bold mb-4">{recipe.strMeal}</h2>
                <img src={recipe.strMealThumb} alt={recipe.strMeal} className="w-full h-48 object-cover rounded-lg mb-4" />
                <p className="mb-4">{recipe.strInstructions}</p>
                <h3 className="font-semibold">Ingredients:</h3>
                <ul className="list-disc pl-5">
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => {
                        const ingredient = recipe[`strIngredient${num}`];
                        const measure = recipe[`strMeasure${num}`];
                        if (ingredient && measure) {
                            return <li key={num}>{`${measure} ${ingredient}`}</li>;
                        }
                        return null;
                    })}
                </ul>
                <button
                    onClick={onClose}
                    className="mt-4 bg-pink-500 text-white py-2 px-4 rounded w-full"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default RecipeModal;