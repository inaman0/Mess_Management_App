import React, { useEffect, useState } from 'react'
import apiConfig from '../../config/apiConfig'
import MealMenuCard from './MealMenuCard'
import { useNavigate } from 'react-router-dom';

interface MenuItem {
  Dish_name: string;
  Meal_id: string;
  type: string;
  id: string;
}

interface MealData {
  id: string;
  Meal_type: string;
  Menu_id: string;
}

interface Menu {
  id: string;
  Date: Date;
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
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMealType, setCurrentMealType] = useState('');

  const apiUrl = `${apiConfig.getResourceUrl('menu_item')}?`;
  const apiMealUrl = `${apiConfig.getResourceUrl('meal')}?`;
  const apiMenuUrl = `${apiConfig.getResourceUrl('menu')}?`;

  const navigate = useNavigate()

  useEffect(() => {
    setCurrentMealType(getCurrentMealType());
    const interval = setInterval(() => {
      setCurrentMealType(getCurrentMealType());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  //Simple date comparison function
  const isSameDate = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  useEffect(() => {
    const fetchAllResources = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const params = new URLSearchParams();
        const ssid = sessionStorage.getItem('key') || '';
        params.append('queryId', 'GET_ALL');
        params.append('session_id', ssid);

        const [menuResponse, mealResponse, menuRes] = await Promise.all([
          fetch(apiUrl + params.toString()),
          fetch(apiMealUrl + params.toString()),
          fetch(apiMenuUrl + params.toString())
        ]);

        if (!menuResponse.ok || !mealResponse.ok || !menuRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const menuData = await menuResponse.json();
        const mealData = await mealResponse.json();
        const menuDataRes = await menuRes.json();

        // console.log(menuData);

        // Parse dates from API response
        const parsedMenus = menuDataRes.resource?.map((menu: any) => ({
          ...menu,
          Date: new Date(menu.Date)
        })) || [];

        setMenuItems(menuData.resource || []);
        setMeals(mealData.resource || []);
        setMenus(parsedMenus);
      } catch (error) {
        console.error('Error fetching resources:', error);
        setError('Failed to load menu. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllResources();
  }, []);

  // Find today's menu
  const today = new Date();
  const todayMenu = menus.find(menu => menu.Date && isSameDate(menu.Date, today));
  const todayMenuId = todayMenu?.id;

  // Filter meals to only include those for today's menu
  const todaysMeals = todayMenuId 
    ? meals.filter(meal => meal.Menu_id === todayMenuId)
    : [];

  // Filter menu items for current meal type and today's date
  const currentMealItems = menuItems.filter(item => {
    return todaysMeals.some(meal => 
      meal.id === item.Meal_id && 
      meal.Meal_type === currentMealType
    );
  });

  if (isLoading) return <div className="p-4 text-center">Loading menu...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (menuItems.length === 0) return <div className="p-4 text-center">No menu items available</div>;

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h1 m-0">
          Today's {currentMealType} Menu ({today.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })})
        </h1>
        <button 
          onClick={() => navigate('/feedback')}
          className="btn btn-primary"
        >
          Give Feedback
        </button>
      </div>

      
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
        <p className="text-center text-gray-500">
          No {currentMealType} items available for today
        </p>
      )}

      <div className="mt-8 text-sm text-gray-500">
        <p>Meal times:</p>
        <ul className="list-disc pl-5">
          <li>Breakfast: 6 AM - 10 AM</li>
          <li>Lunch: 10 AM - 2:30 PM</li>
          <li>Snacks: 2:30 PM - 6 PM</li>
          <li>Dinner: 6 PM - 10 PM</li>
        </ul>
      </div>
    </div>
  );
};

export default MenuOfTime;