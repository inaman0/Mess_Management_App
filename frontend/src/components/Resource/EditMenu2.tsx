import React, { useEffect, useState } from 'react';
import apiConfig from '../../config/apiConfig';
import './EditMenu2.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type MealType = 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner';

const EditMenu2 = () => {
  const [date, setDate] = useState('');
  const [selectedType, setSelectedType] = useState<MealType | ''>('');
  const [meals, setMeals] = useState<any[]>([]);
  const [filteredMeals, setFilteredMeals] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [currentUrl, setCurrentUrl] = useState('');
  const [editedItems, setEditedItems] = useState<Record<string, any>>({});

  const menuItemApiUrl = apiConfig.getResourceUrl('menu_item') + '?';

  useEffect(() => {
    setCurrentUrl(window.location.href);

    const fetchMeals = async () => {
      const params = new URLSearchParams();
      const ssid = sessionStorage.getItem('key');
      params.append('queryId', 'GET_ALL');
      params.append('session_id', ssid || '');

      try {
        const response = await fetch(`${apiConfig.getResourceUrl('meal')}?${params.toString()}`);
        if (!response.ok) throw new Error(`Failed to fetch meals: ${response.status}`);
        const data = await response.json();
        const fetchedMeals = data.resource || [];
        setMeals(fetchedMeals);
      } catch (err) {
        console.error('Error fetching meals:', err);
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
      if (!response.ok) throw new Error(`Failed to fetch menu items: ${response.status}`);
      const data = await response.json();
      const allMenuItems = data.resource || [];

      const filteredItems = allMenuItems.filter((item: any) =>
        mealIds.includes(item.Meal_id)
      );

      setMenuItems(filteredItems);
    } catch (err) {
      console.error('Error fetching menu items:', err);
    }
  };

  const handleInputChange = (id: string, field: string, value: string) => {
    setEditedItems(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        [field]: value
      }
    }));
  };

  const handleSaveItem = async (itemId: string) => {
    const updated = editedItems[itemId];
    const fullItem = menuItems.find(item => item.id === itemId);

    if (!fullItem) return;

    const updatedItem = {
      ...fullItem,
      ...updated
    };

    const jsonString = JSON.stringify(updatedItem);
    const uint8Array = new TextEncoder().encode(jsonString);
    const base64Encoded = btoa(String.fromCharCode(...uint8Array));

    const params = new URLSearchParams();
    const ssid = sessionStorage.getItem('key');
    params.append('resource', base64Encoded);
    params.append('action', 'MODIFY');
    params.append('session_id', ssid || '');

    try {
      const response = await fetch(menuItemApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      });

      if (response.ok) {
        toast.success('Item updated successfully!');

        setMenuItems(prev =>
          prev.map(item =>
            item.id === itemId ? { ...item, ...updated } : item
          )
        );

        setEditedItems(prev => {
          const updated = { ...prev };
          delete updated[itemId];
          return updated;
        });
      } else {
        toast.error('Update failed.');
      }
    } catch (err) {
      console.error('Error updating item:', err);
      toast.error('Error occurred while updating.');
    }
  };

  const handleSearch = async () => {
    if (!date || !selectedType) {
      toast.warning('Please select a date and a meal type');
      return;
    }

    const results = meals.filter(meal => {
      const mealDate = new Date(meal.Date).toLocaleDateString('en-CA');
      return mealDate === date && meal.Meal_type === selectedType;
    });

    setFilteredMeals(results);

    const mealIds = results.map(meal => meal.id);
    await fetchMenuItemsForMeals(mealIds);
  };

  return (
    <div className="edit-menu2-container">
      <ToastContainer
        closeOnClick
        pauseOnHover
        draggable
        closeButton
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        toastClassName="custom-toast"
      />

      <h2>Enter Date and Meal Type</h2>

      <div className="edit-menu2-controls">
        <label>Date: </label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
      </div>

      <div className="edit-menu2-meal-types">
        {(['Breakfast', 'Lunch', 'Snacks', 'Dinner'] as MealType[]).map((type) => (
          <label key={type}>
            <input
              type="radio"
              name="mealType"
              value={type}
              checked={selectedType === type}
              onChange={() => setSelectedType(type)}
            />{' '}
            {type}
          </label>
        ))}
      </div>

      <button onClick={handleSearch} className='edit-menu2-container-search'>Search</button>

      <hr />

      {filteredMeals.length > 0 ? (
        <div className="edit-menu2-results">
          <h3>Matching Meals</h3>
          <ul>
            {filteredMeals.map((meal, idx) => {
              const items = menuItems.filter(item => item.Meal_id === meal.id);
              return (
                <li key={idx}>
                  {items.length > 0 ? (
                    <ul>
                      {items.map((item, i) => (
                        <li key={i}>
                          <div className="edit-menu2-dish-row">
                            <input
                              type="text"
                              value={editedItems[item.id]?.Dish_name ?? item.Dish_name}
                              onChange={e => handleInputChange(item.id, 'Dish_name', e.target.value)}
                            />
                            <input
                              type="text"
                              value={editedItems[item.id]?.type ?? item.type}
                              onChange={e => handleInputChange(item.id, 'type', e.target.value)}
                            />
                            <button
                              onClick={() => handleSaveItem(item.id)} className='edit-menu2-edit-button'
                            >
                              Save
                            </button>
                          </div>
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