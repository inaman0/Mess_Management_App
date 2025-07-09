import React, { useEffect, useState } from 'react';
import apiConfig from '../../config/apiConfig';

type MealType = 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner';

const EditMenu2 = () => {
  console.log("🔁 EditMenu2 component mounted");

  const [date, setDate] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<Record<MealType, boolean>>({
    Breakfast: false,
    Lunch: false,
    Snacks: false,
    Dinner: false,
  });

  const [meals, setMeals] = useState<any[]>([]);
  const [filteredMeals, setFilteredMeals] = useState<any[]>([]);

  useEffect(() => {
    console.log("👀 useEffect triggered");

    const fetchMeals = async () => {
      console.log('📦 Fetching all meals...');
      const params = new URLSearchParams();
      const ssid = sessionStorage.getItem('key');
      params.append('queryId', 'GET_ALL');
      params.append('session_id', ssid || '');

      try {
        const response = await fetch(`${apiConfig.getResourceUrl('meal')}?${params.toString()}`);
        if (!response.ok) throw new Error(`❌ Failed to fetch meals: ${response.status}`);
        const data = await response.json();
        const fetchedMeals = data.resource || [];

        console.log(`✅ Total meals fetched: ${fetchedMeals.length}`);
        console.log('🧪 Sample meals:', fetchedMeals.slice(0, 5).map((m: any) => ({
          id: m.id,
          Date: m.Date,
          Meal_type: m.Meal_type,
          IsFeast: m.IsFeast,
        })));

        setMeals(fetchedMeals);
      } catch (err) {
        console.error('❌ Error fetching meals:', err);
      }
    };

    fetchMeals();
  }, []);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as MealType;
    const checked = e.target.checked;

    console.log(`☑️ Meal type toggled: ${name} = ${checked}`);

    setSelectedTypes(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSearch = () => {
    console.log('🔍 Starting search...');
    console.log('📅 Selected date:', date);
    console.log('🍱 Selected meal types:', selectedTypes);

    if (!meals || meals.length === 0) {
      console.warn("⚠️ No meals loaded before search.");
    }

    const activeTypes: MealType[] = Object.keys(selectedTypes)
      .filter((key) => selectedTypes[key as MealType]) as MealType[];

    console.log('✅ Active meal types to check:', activeTypes);

    if (!date || activeTypes.length === 0) {
      alert('Please select a date and at least one meal type');
      return;
    }

    const results = meals.filter(meal => {
      const mealDate = new Date(meal.Date).toISOString().split('T')[0];
      const match = mealDate === date && activeTypes.includes(meal.Meal_type);

      console.log(`➡️ Meal ID: ${meal.id}, Date: ${mealDate}, Type: ${meal.Meal_type} => Match: ${match}`);
      return match;
    });

    console.log('🎯 Final matched meals:', results);
    setFilteredMeals(results);
  };

  try {
    return (
      <div>
        <h2>Search Meals by Date and Type</h2>

        <div>
          <label>Date: </label>
          <input
            type="date"
            value={date}
            onChange={e => {
              console.log('📆 Date changed to:', e.target.value);
              setDate(e.target.value);
            }}
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
              {filteredMeals.map((meal, idx) => (
                <li key={idx}>
                  Meal ID: {meal.id} | Date: {new Date(meal.Date).toISOString().split('T')[0]} | Type: {meal.Meal_type}
                  {meal.IsFeast && ` | IsFeast: ${meal.IsFeast}`}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No matching meals found.</p>
        )}
      </div>
    );
  } catch (err) {
    console.error("❌ Render error in EditMenu2:", err);
    return <p>Something went wrong while rendering EditMenu2.</p>;
  }
};

export default EditMenu2;