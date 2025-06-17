import React, { useEffect, useState } from 'react';
import apiConfig from '../../config/apiConfig';
import MealMenuCard from './MealMenuCard';

interface MenuItem {
  Dish_name: string;
  Meal_id: string;
  type: string;
  id: string;
}

interface MealData {
  id: string;      
  Meal_type: string;
  Date: Date; // Changed to Date (capital D)
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

        // Parse dates from API response - using Date (capital D)
        const parsedMeals = mealData.resource?.map((meal: any) => ({
          ...meal,
          Date: new Date(meal.Date) // Changed to Date (capital D)
        })) || [];

        setMenuItems(menuData.resource || []);
        setMeals(parsedMeals);
        
      } catch (error) {
        console.error('Error fetching resources:', error);
        setError('Failed to load menu. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllResources();
  }, []);

  // Simple date comparison function
  const isSameDate = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // Filter meals to only include those for today - using Date (capital D)
  const today = new Date();
  const todaysMeals = meals.filter(meal => meal.Date && isSameDate(meal.Date, today));

  // Create map of meal_id to meal_type using only today's meals
  const mealTypeMap = todaysMeals.reduce<Record<string, string>>((acc, meal) => {
    acc[meal.id] = meal.Meal_type;
    return acc;
  }, {});

  // Filter menu items to only include those with meal IDs from today's meals
  const todaysMenuItems = menuItems.filter(item => 
    todaysMeals.some(meal => meal.id === item.Meal_id)
  );

  // Group today's menu items by meal type
  const groupedMenu = todaysMenuItems.reduce<Record<string, MenuItem[]>>((acc, item) => {
    const mealType = mealTypeMap[item.Meal_id] || 'Other';
    if (!acc[mealType]) acc[mealType] = [];
    acc[mealType].push(item);
    return acc;
  }, {});

  // Define the order of meal types for consistent display
  const mealTypeOrder = ['Breakfast', 'Lunch', 'Snacks', 'Dinner', 'Other'];

  if (isLoading) return <div className="p-4 text-center">Loading menu...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (todaysMenuItems.length === 0) return (
    <div className="p-4 text-center">
      No menu items available for today ({today.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })})
    </div>
  );

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">
        Today's Menu ({today.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        })})
      </h1>
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