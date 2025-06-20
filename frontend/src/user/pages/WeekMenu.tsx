import React, { useEffect, useState } from 'react';
import apiConfig from '../../config/apiConfig';
import MealMenuCard from '../components/MealMenuCard';

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
}

const WeekMenu = () => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [meals, setMeals] = useState<MealData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentDate, setCurrentDate] = useState(new Date());
  
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
  
          const parsedMeals = mealData.resource?.map((meal: any) => ({
            ...meal,
            Date: new Date(meal.Date)
          })) || [];
  
          setMenuItems(menuData.resource || []);
          console.log('Menu Items:', menuData.resource);
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
  
    const changeDate = (days: number) => {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + days);
      setCurrentDate(newDate);
    };
  
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long',
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    };
  
    // Filter meals for the current date
    const currentDayMeals = meals.filter(meal => meal.Date && isSameDate(meal.Date, currentDate));
  
    // Create map of meal_id to meal_type
    const mealTypeMap = currentDayMeals.reduce<Record<string, string>>((acc, meal) => {
      acc[meal.id] = meal.Meal_type;
      return acc;
    }, {});
  
    // Filter menu items to only include those with meal IDs from current day's meals
    const currentDayMenuItems = menuItems.filter(item => 
      currentDayMeals.some(meal => meal.id === item.Meal_id)
    );

    console.log('Current Day Menu Items:', currentDayMenuItems);  
  
    // Group menu items by meal type
    const groupedMenu = currentDayMenuItems.reduce<Record<string, MenuItem[]>>((acc, item) => {
      const mealType = mealTypeMap[item.Meal_id] || 'Other';
      if (!acc[mealType]) acc[mealType] = [];
      acc[mealType].push(item);
      return acc;
    }, {});
  
    // Define the order of meal types for consistent display
    const mealTypeOrder = ['Breakfast', 'Lunch', 'Snacks', 'Dinner', 'Other'];
  
    if (isLoading) return <div className="p-4 text-center">Loading menu...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;
  
    return (
        <div className="p-4 flex">
            <div className="flex items-center justify-between mb-6">
                <button 
                    onClick={() => changeDate(-1)}
                    className="btn btn-primary"
                >
                    Previous Day
                </button>
                <button 
                    onClick={() => changeDate(1)}
                    className="btn btn-primary"
                    style={{ marginLeft: '82%' }}
                >
                    Next Day
                </button>
                <h1 className="text-3xl font-bold text-center mx-4 flex-grow">
                    Menu for {formatDate(currentDate)}
                </h1>
            </div>
      
        {currentDayMenuItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No menu items available for this day
          </div>
        ) : (
          mealTypeOrder.map(mealType => {
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
          })
        )}
      </div>
    );
  };

export default WeekMenu
