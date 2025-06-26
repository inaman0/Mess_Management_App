// Menu.tsx
import React, { useEffect, useState } from 'react';
import apiConfig from '../../config/apiConfig';
import ReviewMenuCard from '../components/ReviewMenuCard';
import './MenuStyles.css';

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

  if (isLoading) return <div className="loading-message">Loading menu...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (todaysMenuItems.length === 0) return (
    <div className="empty-message">
      No menu items available for today ({today.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })})
    </div>
  );

  return (
    <div className="menu-container">
      <div className="header-container">
        <h1 className="current-meal-title">
          Today's Menu ({today.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })})
        </h1>
      </div>
      
      {mealTypeOrder.map(mealType => {
        const group = groupedMenu[mealType];
        if (!group || group.items.length === 0) return null;
        
        return (
          <div key={mealType} className={`meal-type-section ${group.isFeast ? 'feast-section' : ''}`}>
            <div className="meal-type-header">
              <h2 className="meal-type-title">
                {mealType}
                {group.isFeast && <span className="feast-label">Feast Day!</span>}
              </h2>
            </div>
            <div className="meal-cards-container">
              <div className="meal-cards-row">
                {group.items.map(item => (
                  <ReviewMenuCard
                    key={item.id}
                    Dish_name={item.Dish_name}
                    type={item.type}
                    id={item.id}
                    mealType={mealType}
                    isFeast={group.isFeast}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Menu;