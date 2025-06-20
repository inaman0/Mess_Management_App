import React, { useEffect, useState } from 'react';
import apiConfig from '../../config/apiConfig';
import ReviewMenuCard from '../components/ReviewMenuCard';

interface MenuItem {
  Dish_name: string;
  Meal_id: string;
  type: string;
  id: string;
}

interface MealData {
  id: string;      
  Meal_type: string;
  Date: Date;
  IsFeast: string;
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
          fetch(apiMealUrl + params.toString()),
        ]);

        if (!menuResponse.ok || !mealResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const menuData = await menuResponse.json();
        const mealData = await mealResponse.json();

        const parsedMeals = mealData.resource?.map((meal: any) => ({
          ...meal,
          Date: new Date(meal.Date)
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

  const isSameDate = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const today = new Date();
  const todaysMeals = meals.filter(meal => meal.Date && isSameDate(meal.Date, today));

  const mealTypeMap = todaysMeals.reduce<Record<string, string>>((acc, meal) => {
    acc[meal.id] = meal.Meal_type;
    return acc;
  }, {});

  const todaysMenuItems = menuItems.filter(item => 
    todaysMeals.some(meal => meal.id === item.Meal_id)
  );

  const groupedMenu = todaysMenuItems.reduce<Record<string, {items: MenuItem[], isFeast: boolean}>>((acc, item) => {
    const meal = todaysMeals.find(meal => meal.id === item.Meal_id);
    const mealType = meal?.Meal_type || 'Other';
    const isFeast = meal?.IsFeast === "true";
    
    if (!acc[mealType]) {
      acc[mealType] = {items: [], isFeast: false};
    }
    acc[mealType].items.push(item);
    
    if (isFeast) {
      acc[mealType].isFeast = true;
    }
    
    return acc;
  }, {});

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
        const group = groupedMenu[mealType];
        if (!group || group.items.length === 0) return null;
        
        return (
          <div key={mealType} className={`mb-8 ${group.isFeast ? 'border-2 border-yellow-400 p-4 rounded-lg bg-yellow-50' : ''}`}>
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">
              {mealType}
              <br />
              {group.isFeast && <p className="ml-2 text-yellow-600"> Feast Day!</p>}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {group.items.map(item => {
                const meal = todaysMeals.find(meal => meal.id === item.Meal_id);
                const isItemFeast = meal?.IsFeast === "true";
                
                return (
                  <ReviewMenuCard
                    key={item.id}
                    Dish_name={item.Dish_name}
                    type={item.type}
                    id={item.id}
                    mealType={mealType}
                    isFeast={isItemFeast}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Menu;