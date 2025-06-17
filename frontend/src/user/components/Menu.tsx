import React, { useEffect, useState } from 'react'
import apiConfig from '../../config/apiConfig'
import MealMenuCard from './MealMenuCard'

interface MenuItem {
  Dish_name: string;
  Meal_id: string;
  type: string;
  id: string;
}

interface MealData {
  id: string;      
  Meal_type: string;
}

const Menu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [meals, setMeals] = useState<MealData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = `${apiConfig.getResourceUrl('menu_item')}?`;
  const apiMealUrl = `${apiConfig.getResourceUrl('meal')}?`;

  useEffect(() => {
    const fetchAllResources = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const params = new URLSearchParams();
        const ssid = sessionStorage.getItem('key') || '';
        params.append('queryId', 'GET_ALL');
        params.append('session_id', ssid);

        const [menuResponse, mealResponse] = await Promise.all([
          fetch(apiUrl + params.toString()),
          fetch(apiMealUrl + params.toString())
        ]);

        if (!menuResponse.ok || !mealResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const menuData = await menuResponse.json();
        const mealData = await mealResponse.json();

        setMenuItems(menuData.resource || []);
        setMeals(mealData.resource || []);
      } catch (error) {
        console.error('Error fetching resources:', error);
        setError('Failed to load menu. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllResources();
  }, []);

  // Create map of meal_id to meal_type
  const mealTypeMap = meals.reduce<Record<string, string>>((acc, meal) => {
    acc[meal.id] = meal.Meal_type;
    return acc;
  }, {});

  // Group menu items by meal type
  const groupedMenu = menuItems.reduce<Record<string, MenuItem[]>>((acc, item) => {
    const mealType = mealTypeMap[item.Meal_id] || 'Other';
    if (!acc[mealType]) acc[mealType] = [];
    acc[mealType].push(item);
    return acc;
  }, {});

  // Define the order of meal types for consistent display
  const mealTypeOrder = ['Breakfast', 'Lunch', 'Snacks', 'Dinner', 'Other'];

  if (isLoading) return <div className="p-4 text-center">Loading menu...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (menuItems.length === 0) return <div className="p-4 text-center">No menu items available</div>;

  return (
    <div className="p-4">
      {mealTypeOrder.map(mealType => {
        const items = groupedMenu[mealType];
        if (!items || items.length === 0) return null;
        
        return (
          <div key={mealType} className="mb-8">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">{mealType}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map(item => (
                <MealMenuCard
                  key={item.id}
                  Dish_name={item.Dish_name}
                  type={item.type}
                  id={item.id}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Menu;