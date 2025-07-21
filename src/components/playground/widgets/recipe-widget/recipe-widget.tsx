import React from 'react';
import { useRecipeWidget } from '@/components/playground/widgets/recipe-widget/recipe-widget-context';

export default function RecipeWidget() {
  const { recipe } = useRecipeWidget();

  return (
    <div className='fixed top-6 left-6'>
      <div className='max-h-[80vh] w-[400px] overflow-hidden overflow-y-auto rounded-lg bg-white shadow-md'>
        <div className='relative h-64 w-full'>
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className='h-full w-full object-cover'
          />
          <div className='absolute top-3 right-3 rounded-full bg-amber-500 px-4 py-2 text-base font-medium text-white'>
            {recipe.cookTime}
          </div>
          <div className='absolute right-3 bottom-3 rounded-full bg-blue-500 px-4 py-2 text-base font-medium text-white'>
            {recipe.weight}
          </div>
        </div>

        <div className='p-6'>
          <h2 className='mb-3 text-3xl font-bold text-gray-800'>
            {recipe.title}
          </h2>
          <p className='mb-4 text-lg text-gray-600'>by {recipe.author}</p>

          <div className='mb-5 rounded-lg bg-gray-50 p-4'>
            <h3 className='mb-2 text-lg font-semibold text-gray-700'>
              Nutritional Info:
            </h3>
            <div className='grid grid-cols-4 gap-2'>
              <div className='rounded bg-white p-2 text-center shadow-sm'>
                <p className='text-xl font-bold text-gray-800'>
                  {recipe.nutritionalInfo.calories}
                </p>
                <p className='text-sm text-gray-600'>calories</p>
              </div>
              <div className='rounded bg-white p-2 text-center shadow-sm'>
                <p className='text-xl font-bold text-gray-800'>
                  {recipe.nutritionalInfo.protein}g
                </p>
                <p className='text-sm text-gray-600'>protein</p>
              </div>
              <div className='rounded bg-white p-2 text-center shadow-sm'>
                <p className='text-xl font-bold text-gray-800'>
                  {recipe.nutritionalInfo.carbs}g
                </p>
                <p className='text-sm text-gray-600'>carbs</p>
              </div>
              <div className='rounded bg-white p-2 text-center shadow-sm'>
                <p className='text-xl font-bold text-gray-800'>
                  {recipe.nutritionalInfo.fat}g
                </p>
                <p className='text-sm text-gray-600'>fat</p>
              </div>
            </div>
          </div>

          <div className='space-y-5'>
            <h3 className='mb-4 text-xl font-semibold text-gray-700'>
              Preparation Steps:
            </h3>
            <div className='space-y-4'>
              {recipe.steps.map((step, index) => (
                <div
                  key={index}
                  className='rounded-md border border-gray-100 bg-gray-50 p-4 shadow-sm'
                >
                  <div className='flex items-center'>
                    <span className='mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-500 text-base text-white'>
                      {index + 1}
                    </span>
                    <p className='text-lg text-gray-700'>{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
