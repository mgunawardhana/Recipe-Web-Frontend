import React, {useEffect} from "react";
import {RecipeDetail} from '../types';

interface RecipeModalProps {
    recipe: RecipeDetail | null;
    onClose: () => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({recipe, onClose}) => {
    if (!recipe) return null;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const formatIngredient = (measure: string, ingredient: string) => {
        const cleanMeasure = measure ? measure.trim() : '';
        const cleanIngredient = ingredient ? ingredient.trim() : '';
        return {measure: cleanMeasure, ingredient: cleanIngredient};
    };


    return (<div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
            <div
                className="bg-white rounded-xl shadow-xl w-full max-h-[85vh] flex flex-col max-w-sm md:max-w-md lg:max-w-lg">
                <div className="p-4 border-b flex justify-between items-center bg-white z-10 rounded-t-xl">
                    <h2 className="text-lg font-bold text-gray-800 truncate pr-2">{recipe.strMeal}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 rounded-full p-1 transition-colors focus:outline-none"
                        aria-label="Close"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"
                             fill="currentColor">
                            <path fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"/>
                        </svg>
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 px-4"
                     style={{overflowY: 'auto', WebkitOverflowScrolling: 'touch'}}>
                    <div className="py-4">
                        <img
                            src={recipe.strMealThumb}
                            alt={recipe.strMeal}
                            className="w-full h-48 object-cover rounded-lg shadow-md"
                        />
                    </div>

                    <div className="mb-4">
                        <h3 className="font-medium text-sm text-gray-500 uppercase tracking-wider mb-2">Instructions</h3>
                        <p className="text-gray-700">{recipe.strInstructions}</p>
                    </div>

                    <div className="mb-6">
                        <h3 className="font-medium text-sm text-gray-500 uppercase tracking-wider mb-3">Ingredients</h3>

                        <div className="grid grid-cols-[80px_1fr] gap-y-2">
                            {Array.from({length: 20}, (_, i) => i + 1).map((num) => {
                                const ingredient = recipe[`strIngredient${num}`];
                                const measure = recipe[`strMeasure${num}`];

                                if (ingredient && ingredient.trim() !== '') {
                                    const {
                                        measure: cleanMeasure,
                                        ingredient: cleanIngredient
                                    } = formatIngredient(measure || '', ingredient);

                                    return (<React.Fragment key={num}>
                                            <div className="text-gray-700">{cleanMeasure}</div>
                                            <div className="text-gray-800 font-medium">{cleanIngredient}</div>
                                        </React.Fragment>);
                                }
                                return null;
                            })}
                        </div>
                    </div>
                </div>


                <div className="p-4 border-t bg-gray-50 rounded-b-xl">
                    <button
                        onClick={onClose}
                        className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg w-full transition-colors font-medium shadow-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>);
};

export default RecipeModal;