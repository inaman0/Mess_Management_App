import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiConfig from '../../config/apiConfig';

type MealType = 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner';

const EditMenu2 = () => {
  const navigate = useNavigate();

  const [date, setDate] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<Record<MealType, boolean>>({
    Breakfast: false,
    Lunch: false,
    Snacks: false,
    Dinner: false,
  });

  const [meals, setMeals] = useState<any[]>([]);
  const [filteredMeals, setFilteredMeals] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [currentUrl, setCurrentUrl] = useState('');

  const menuItemApiUrl = apiConfig.getResourceUrl('menu_item') + '?';
  const menuItemMetaUrl = apiConfig.getResourceMetaDataUrl('MenuItem') + '?';

  const mealApiUrl = apiConfig.getResourceUrl('meal') + '?';
  const mealMetaUrl = apiConfig.getResourceMetaDataUrl('Meal') + '?';

  const BaseUrl = apiConfig.API_BASE_URL;

  useEffect(() => {
    setCurrentUrl(window.location.href);

    const fetchMeals = async () => {
      const params = new URLSearchParams();
      const ssid = sessionStorage.getItem('key');
      params.append('queryId', 'GET_ALL');
      params.append('session_id', ssid || '');

      try {
        const response = await fetch(`${apiConfig.getResourceUrl('meal')}?${params.toString()}`);
        if (!response.ok) throw new Error(`❌ Failed to fetch meals: ${response.status}`);
        const data = await response.json();
        const fetchedMeals = data.resource || [];
        setMeals(fetchedMeals);
      } catch (err) {
        console.error('❌ Error fetching meals:', err);
      }
    };

    fetchMeals();
  }, []);

  const fetchMenuItemsForMeals = async (mealIds: string[]) => {
    const params = new URLSearchParams();
    const ssid = sessionStorage.getItem('key');
    params.append('queryId', 'GET_ALL');
    params.append('session_id', ssid || '');

    try {
      const response = await fetch(`${apiConfig.getResourceUrl('menu_item')}?${params.toString()}`);
      if (!response.ok) throw new Error(`❌ Failed to fetch menu items: ${response.status}`);
      const data = await response.json();
      const allMenuItems = data.resource || [];

      const filteredItems = allMenuItems.filter((item: any) =>
        mealIds.includes(item.Meal_id)
      );

      setMenuItems(filteredItems);
    } catch (err) {
      console.error('❌ Error fetching menu items:', err);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as MealType;
    const checked = e.target.checked;

    setSelectedTypes(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleUpdate = (id: string, type: 'Meal' | 'Menu_item') => {
    const editedData: any = {};
    const dataSource = type === 'Meal' ? filteredMeals : menuItems;

    dataSource.forEach(item => {
      editedData[item.id] = { ...item };
    });

    navigate('/edit', {
      state: {
        id,
        editedData,
        resourceName: type,
        currUrl: currentUrl,
        apiUrl: type === 'Meal' ? mealApiUrl : menuItemApiUrl,
        metadataUrl: type === 'Meal' ? mealMetaUrl : menuItemMetaUrl,
        BaseUrl,
      }
    });
  };

  const handleSearch = async () => {
    const activeTypes: MealType[] = Object.keys(selectedTypes)
      .filter((key) => selectedTypes[key as MealType]) as MealType[];

    if (!date || activeTypes.length === 0) {
      alert('Please select a date and at least one meal type');
      return;
    }

    const results = meals.filter(meal => {
      const mealDate = new Date(meal.Date).toISOString().split('T')[0];
      return mealDate === date && activeTypes.includes(meal.Meal_type);
    });

    setFilteredMeals(results);

    const mealIds = results.map(meal => meal.id);
    await fetchMenuItemsForMeals(mealIds);
  };

  return (
    <div>
      <h2>Search Meals by Date and Type</h2>

      <div>
        <label>Date: </label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
      </div>

      <div>
        {(['Breakfast', 'Lunch', 'Snacks', 'Dinner'] as MealType[]).map((type) => (
          <label key={type} style={{ marginRight: '10px' }}>
            <input
              type="checkbox"
              name={type}
              checked={selectedTypes[type]}
              onChange={handleCheckboxChange}
            />{' '}
            {type}
          </label>
        ))}
      </div>

      <button onClick={handleSearch}>Search</button>

      <hr />

      {filteredMeals.length > 0 ? (
        <div>
          <h3>Matching Meals</h3>
          <ul>
            {filteredMeals.map((meal, idx) => {
              const items = menuItems.filter(item => item.Meal_id === meal.id);
              return (
                <li key={idx}>
                  <div>
                    <strong>Meal ID:</strong> {meal.id} |
                    <strong> Date:</strong> {new Date(meal.Date).toISOString().split('T')[0]} |
                    <strong> Type:</strong> {meal.Meal_type}
                    <button
                      style={{ marginLeft: '10px' }}
                      onClick={() => handleUpdate(meal.id, 'Meal')}
                    >
                      Edit Meal
                    </button>
                  </div>
                  {items.length > 0 ? (
                    <ul>
                      {items.map((item, i) => (
                        <li key={i}>
                          🍽 Dish: {item.Dish_name} | Type: {item.type}
                          <button
                            style={{ marginLeft: '10px' }}
                            onClick={() => handleUpdate(item.id, 'Menu_item')}
                          >
                            Edit Dish
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No dishes found for this meal.</p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <p>No matching meals found.</p>
      )}
    </div>
  );
};

export default EditMenu2;