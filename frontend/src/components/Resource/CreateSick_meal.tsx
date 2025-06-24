import React, { useState, useEffect } from 'react';
import apiConfig from '../../config/apiConfig';
import { useNavigate } from 'react-router-dom';


export type resourceMetaData = {
  resource: string;
  fieldValues: any[];
};

interface Meal {
  id: string;
  Date: string;
  Meal_type: string;
}

const CreateSick_meal = () => {
  const [fields, setFields] = useState<any[]>([]);
  const [dataToSave, setDataToSave] = useState<any>({});
  const [showToast, setShowToast] = useState<boolean>(false);
  const [mealData, setMealData] = useState<Meal[]>([]);
  const [mealTypes, setMealTypes] = useState<string[]>(['Breakfast', 'Lunch', 'Snacks', 'Dinner']);
  const [mealSelection, setMealSelection] = useState({
    Date: '',
    Meal_type: ''
  });
  const regex = /^(g_|archived|extra_data)/;
  const apiUrl = apiConfig.getResourceUrl("sick_meal");
  const apimealUrl = apiConfig.getResourceUrl("meal");
  const metadataUrl = apiConfig.getResourceMetaDataUrl("SickMeal");
  const navigate = useNavigate();

  const HARDCODED_USER_ID = "b9cee83b-f548-471e-a700-31bcdaa5a4b5-38";

  // Set hardcoded user ID when component mounts
  useEffect(() => {
    setDataToSave({ User_id: HARDCODED_USER_ID });
  }, []);

  // Fetch all meals data
  useEffect(() => {
    const fetchMealData = async () => {
      try {
        const params = new URLSearchParams();
        const ssid: any = sessionStorage.getItem('key');
        params.append('queryId', 'GET_ALL');
        params.append('session_id', ssid);

        const response = await fetch(
          `${apimealUrl}?${params.toString()}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );

        if (response.ok) {
          const data = await response.json() as { resource: Meal[] };
          setMealData(data.resource);
          
          // Extract unique meal types
          if (data.resource?.length > 0) {
            const types = [...new Set(data.resource.map(meal => meal.Meal_type))];
            setMealTypes(types);
          }
        }
      } catch (error) {
        console.error('Error fetching meal data:', error);
      }
    };

    fetchMealData();
  }, []);

  // Fetch metadata
  useEffect(() => {
    const fetchResMetaData = async () => {
      try {
        const data = await fetch(metadataUrl, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (data.ok) {
          const metaData = await data.json();
          setFields(metaData[0].fieldValues);
        }
      } catch (error) {
        console.error('Error fetching metadata:', error);
      }
    };

    fetchResMetaData();
  }, []);

  const findMatchingMealId = (): string | null => {
    if (!mealSelection.Date || !mealSelection.Meal_type || mealData.length === 0) {
      return null;
    }
    
    const selectedDate = new Date(mealSelection.Date).toISOString().split('T')[0];
    
    const matchingMeal = mealData.find(meal => {
      const mealDate = new Date(meal.Date).toISOString().split('T')[0];
      return mealDate === selectedDate && meal.Meal_type === mealSelection.Meal_type;
    });
    
    return matchingMeal?.id || null;
  };

  const handleCreate = async () => {
    const mealId = findMatchingMealId();
    
    if (!mealId) {
      alert('No meal available for the selected date and meal type');
      return;
    }

    try {
      const params = new URLSearchParams();
      const submissionData = {
        ...dataToSave,
        Meal_id: mealId
      };
      
      const jsonString = JSON.stringify(submissionData);
      const base64Encoded = btoa(jsonString);
      params.append('resource', base64Encoded);
      const ssid: any = sessionStorage.getItem('key');
      params.append('session_id', ssid);
      
      const response = await fetch(apiUrl + `?${params.toString()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.ok) {
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          navigate('/');
        }, 3000);
        setDataToSave({ User_id: HARDCODED_USER_ID });
        setMealSelection({ Date: '', Meal_type: '' });
      }
    } catch (error) {
      console.error('Error submitting meal request:', error);
      alert('Error submitting meal request');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center mt-5">
      <div className="card shadow w-100" style={{ maxWidth: '600px' }}>
        <div className="card-header bg-primary text-white text-center">
          <h4 className="mb-0">Request Sick Meal</h4>
        </div>
        <div className="card-body">
          {/* Date Input */}
          <div className="mb-3">
            <label className="form-label">
              <span className="text-danger">*</span> Date
            </label>
            <input
              type="date"
              className="form-control"
              required
              value={mealSelection.Date}
              onChange={(e) => setMealSelection({...mealSelection, Date: e.target.value})}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Meal Type Select */}
          <div className="mb-3">
            <label className="form-label">
              <span className="text-danger">*</span> Meal Type
            </label>
            <select
              className="form-select"
              required
              value={mealSelection.Meal_type}
              onChange={(e) => setMealSelection({...mealSelection, Meal_type: e.target.value})}
            >
              <option value="">Select Meal Type</option>
              {mealTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Other fields */}
          {fields.map((field, index) => {
            if (field.name !== 'id' && !regex.test(field.name) && 
                field.name !== 'User_id' && field.name !== 'Meal_id') {
              if (field.name === 'Instruction') {
                return (
                  <div key={index} className="mb-3">
                    <label className="form-label">
                      {field.required && <span className="text-danger">*</span>} {field.name}
                    </label>
                    <textarea
                      className="form-control"
                      name={field.name}
                      required={field.required}
                      placeholder={`Enter ${field.name}`}
                      value={dataToSave[field.name] || ''}
                      onChange={(e) => setDataToSave({...dataToSave, [e.target.name]: e.target.value})}
                      rows={3}
                    />
                  </div>
                );
              }
            }
            return null;
          })}

          <button className="btn btn-success w-100 mt-3" onClick={handleCreate}>
            Request Meal
          </button>
        </div>
      </div>
      
      {/* Toast Notification */}
      {showToast && (
        <div className="toast-container position-fixed top-50 start-50 translate-middle p-3" style={{ zIndex: 2000 }}>
          <div className="toast show bg-light border-success" role="alert">
            <div className="toast-header">
              <strong className="me-auto text-success">Success</strong>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowToast(false)}
              ></button>
            </div>
            <div className="toast-body text-success text-center">Meal request submitted successfully!</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateSick_meal;