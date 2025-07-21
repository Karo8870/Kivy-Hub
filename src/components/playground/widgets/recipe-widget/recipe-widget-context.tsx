import { createContext, ReactNode, useContext, useState } from 'react';
import { healthy } from '@/components/playground/widgets/recipe-widget/recipes';

interface RecipeWidgetContext {
  recipe: RecipeWidgetProps;
  setRecipe: (recipe: RecipeWidgetProps) => void;
}

const recipeWidgetContext = createContext<RecipeWidgetContext | null>(null);

export function useRecipeWidget() {
  const ctx = useContext(recipeWidgetContext);

  if (!ctx) {
    throw new Error(
      'useRecipeWidget must be used within a RecipeWidgetProvider'
    );
  }

  return ctx;
}

interface NutritionalInfo {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

interface RecipeWidgetProps {
  imageUrl: string;
  title: string;
  author: string;
  steps: string[];
  cookTime: string;
  nutritionalInfo: NutritionalInfo;
  weight: string;
}

export function RecipeWidgetProvider({ children }: { children: ReactNode }) {
  const [recipe, setRecipe] = useState<RecipeWidgetProps>(healthy);

  return (
    <recipeWidgetContext.Provider
      value={{
        recipe,
        setRecipe
      }}
    >
      {children}
    </recipeWidgetContext.Provider>
  );
}
