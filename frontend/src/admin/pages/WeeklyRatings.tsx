import React, { useEffect, useState } from 'react';
import apiConfig from '../../config/apiConfig';
import '../components/MealMenuCard.css';

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

const WeeklyRatings = () => {
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

  // Group menu items by meal type
  const groupedMenu = currentDayMenuItems.reduce<Record<string, MenuItem[]>>((acc, item) => {
    const mealType = mealTypeMap[item.Meal_id] || 'Other';
    if (!acc[mealType]) acc[mealType] = [];
    acc[mealType].push(item);
    return acc;
  }, {});

  // Define the order of meal types for consistent display
  const mealTypeOrder = ['Breakfast', 'Lunch', 'Snacks', 'Dinner', 'Other'];

  if (isLoading) return <div className="loading-message">Loading menu...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <>
      <h1 className="title">Ratings</h1>
      <div className="uploader-wrapper">
        <div className="menu-container">
          <div className="date-navigation">
            <button 
              onClick={() => changeDate(-1)}
              className="btn-primary"
            >
              Previous Day
            </button>
            <h1 className="date-title">
              Menu for {formatDate(currentDate)}
            </h1>
            <button 
              onClick={() => changeDate(1)}
              className="btn-primary"
            >
              Next Day
            </button>
          </div>

          {currentDayMenuItems.length === 0 ? (
            <div className="empty-message">
              No menu items available for this day
            </div>
          ) : (
            mealTypeOrder.map(mealType => {
              const items = groupedMenu[mealType];
              if (!items || items.length === 0) return null;
              
              return (
                <div key={mealType} className="meal-type-section">
                  <h2 className="meal-type-title">{mealType}</h2>
                  <div className="meal-type-row">
                    {items.map(item => (
                      <div 
                        key={item.id}
                        className={`meal-card`}
                        data-meal-type={mealType}
                      >
                        <div className="meal-card-content">
                          <div className="dish-name-container">
                            <h3 className="dish-name">{item.Dish_name}</h3>
                            <p className={`dish-type ${item.type === 'Veg' ? 'dish-type-veg' : 'dish-type-nonveg'}`}>
                              {item.type === 'Veg' ? 'VEG' : 'NON-VEG'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>    
      </div>
    </>
  );
};

export default WeeklyRatings;