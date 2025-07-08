import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiConfig from '../../config/apiConfig';
// import '../components/Custom.css';

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

const mealTypes = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];

const EditMenuComponent = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [meals, setMeals] = useState<MealData[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedMealType, setSelectedMealType] = useState<string>('Breakfast');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = `${apiConfig.getResourceUrl('menu_item')}?`;
  const apiMealUrl = `${apiConfig.getResourceUrl('meal')}?`;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        const ssid = sessionStorage.getItem('key') || '';
        params.append('queryId', 'GET_ALL');
        params.append('session_id', ssid);

        const [menuRes, mealRes] = await Promise.all([
          fetch(apiUrl + params.toString()),
          fetch(apiMealUrl + params.toString()),
        ]);

        if (!menuRes.ok || !mealRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const menuData = await menuRes.json();
        const mealData = await mealRes.json();

        setMenuItems(menuData.resource || []);
        setMeals(
          mealData.resource?.map((meal: any) => ({
            ...meal,
            Date: new Date(meal.Date),
          })) || []
        );
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const isSameDate = (d1: Date, d2: Date) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  const selectedDateObj = new Date(selectedDate);
  const selectedMeal = meals.find(
    (meal) =>
      isSameDate(meal.Date, selectedDateObj) && meal.Meal_type === selectedMealType
  );

  const currentMenuItems = selectedMeal
    ? menuItems.filter((item) => item.Meal_id === selectedMeal.id)
    : [];

  const handleEdit = () => {
    if (!selectedMeal) return;
    navigate('/edit', {
      state: {
        id: selectedMeal.id,
        editedData: currentMenuItems,
        resourceName: 'Menu_item',
        currUrl: window.location.href,
        apiUrl,
        metadataUrl: apiConfig.getResourceMetaDataUrl('MenuItem') + '?',
        BaseUrl: apiConfig.API_BASE_URL,
      },
    });
  };

  return (
    <div className="edit-menu-container">
      <h2>Edit Menu</h2>

      <div className="edit-controls">
        <label>
          Select Date:
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </label>

        <label>
          Meal Type:
          <select
            value={selectedMealType}
            onChange={(e) => setSelectedMealType(e.target.value)}
          >
            {mealTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </label>

        <button
          className="btn btn-primary"
          onClick={handleEdit}
          disabled={!selectedMeal}
        >
          Edit This Menu
        </button>
      </div>

      {isLoading ? (
        <div className="loading-message">Loading...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : !selectedMeal ? (
        <div className="empty-message">
          No meal found for selected date and type.
        </div>
      ) : currentMenuItems.length === 0 ? (
        <div className="empty-message">
          No menu items for this meal on {selectedDate}.
        </div>
      ) : (
        <div className="meal-type-section">
          <h3>Current Dishes</h3>
          <div className="meal-cards-row">
            {currentMenuItems.map((item) => (
              <div key={item.id} className="meal-card">
                <div className="meal-card-content">
                  <h4>{item.Dish_name}</h4>
                  <p
                    className={`dish-type ${
                      item.type === 'Veg' ? 'dish-type-veg' : 'dish-type-nonveg'
                    }`}
                  >
                    {item.type}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditMenuComponent;
