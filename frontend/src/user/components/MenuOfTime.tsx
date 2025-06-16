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

const MEAL_TIME_RANGES = {
  Breakfast: { start: 6, end: 10 },    // 6 AM - 10 AM
  Lunch: { start: 10, end: 14.5 },     // 10 AM - 2:30 PM
  Snacks: { start: 14.5, end: 18 },    // 2:30 PM - 6 PM
  Dinner: { start: 18, end: 22 }       // 6 PM - 11 PM
};

const getCurrentMealType = (): string => {
  const now = new Date();
  const currentHour = now.getHours() + now.getMinutes() / 60;
  
  for (const [mealType, range] of Object.entries(MEAL_TIME_RANGES)) {
    if (currentHour >= range.start && currentHour < range.end) {
      return mealType;
    }
  }
  
  return 'Breakfast';
};

const MenuOfTime = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [meals, setMeals] = useState<MealData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMealType, setCurrentMealType] = useState('');

  const apiUrl = `${apiConfig.getResourceUrl('menu_item')}?`;
  const apiMealUrl = `${apiConfig.getResourceUrl('meal')}?`;

  useEffect(() => {
    setCurrentMealType(getCurrentMealType());
    const interval = setInterval(() => {
      setCurrentMealType(getCurrentMealType());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

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

  // Filter menu items for current meal type only
  const currentMealItems = menuItems.filter(item => {
    return mealTypeMap[item.Meal_id] === currentMealType;
  });

  if (isLoading) return <div className="p-4 text-center">Loading menu...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (menuItems.length === 0) return <div className="p-4 text-center">No menu items available</div>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Today's {currentMealType} Menu</h1>
      
      {currentMealItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentMealItems.map(item => (
            <MealMenuCard
              key={item.id}
              Dish_name={item.Dish_name}
              type={item.type}
              id={item.id}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No items available for {currentMealType}</p>
      )}

      <div className="mt-8 text-sm text-gray-500">
        <p>Meal times:</p>
        <ul className="list-disc pl-5">
          <li>Breakfast: 7 AM - 9:45 AM</li>
          <li>Lunch: 12:30 AM - 2:15 PM</li>
          <li>Snacks: 4:30 PM - 6 PM</li>
          <li>Dinner: 7:30 PM - 9:30 PM</li>
        </ul>
      </div>
    </div>
  );
};

export default MenuOfTime;