export interface Category {
    idCategory: string;
    strCategory: string;
    strCategoryThumb: string;
    strCategoryDescription: string;
}

export interface Recipe {
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
}

export interface RecipeDetail {
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
    strInstructions: string;
    [key: string]: any;
}