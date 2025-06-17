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
  Menu_id: string;
}

interface Menu {
  id: string;
  Date: Date;
}

const Menu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [meals, setMeals] = useState<MealData[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = `${apiConfig.getResourceUrl('menu_item')}?`;
  const apiMealUrl = `${apiConfig.getResourceUrl('meal')}?`;
  const apiMenuUrl = `${apiConfig.getResourceUrl('menu')}?`;

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

  //Date comparison function
  const isSameDate = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // Find today's menu - using 'Date' to match your field name
  const today = new Date();
  const todayMenu = menus.find(menu => menu.Date && isSameDate(menu.Date, today));
  const todayMenuId = todayMenu?.id;

  // Filter meals to only include those for today's menu
  const todaysMeals = todayMenuId 
    ? meals.filter(meal => meal.Menu_id === todayMenuId)
    : [];

  // Create map of meal_id to meal_type using only today's meals
  const mealTypeMap = todaysMeals.reduce<Record<string, string>>((acc, meal) => {
    acc[meal.id] = meal.Meal_type;
    return acc;
  }, {});

  // Filter menu items to only include those with meal IDs from today's meals
  const todaysMenuItems = todayMenuId
    ? menuItems.filter(item => todaysMeals.some(meal => meal.id === item.Meal_id))
    : [];

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