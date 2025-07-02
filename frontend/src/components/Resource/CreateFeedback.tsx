import React, { useState, useEffect } from 'react';
import apiConfig from '../../config/apiConfig';
import { useNavigate } from 'react-router-dom';
import { ImageUploader } from '../../user/components/ImageUploader';

export type resourceMetaData = {
  resource: string;
  fieldValues: any[];
};

const CreateFeedback = () => {
  const [resMetaData, setResMetaData] = useState<resourceMetaData[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [dataToSave, setDataToSave] = useState<any>({});
  const [showToast, setShowToast] = useState<any>(false);
  const [foreignkeyData, setForeignkeyData] = useState<Record<string, any[]>>({});
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});
  const [enums, setEnums] = useState<Record<string, any[]>>({});
  const regex = /^(g_|archived|extra_data)/;
  const apiUrl = apiConfig.getResourceUrl("feedback");
  const metadataUrl = apiConfig.getResourceMetaDataUrl("Feedback");
  const navigate = useNavigate();

  const HARDCODED_USER_ID = "ee9f67bb-bbe1-4b28-9be5-7d36be9d9f16-20"; // Replace with your actual user ID

  // Set hardcoded user ID when component mounts
  useEffect(() => {
    setDataToSave({ ...dataToSave, User: HARDCODED_USER_ID });
  }, []);

  // Fetch metadata
  useEffect(() => {
    const fetchResMetaData = async () => {
      const fetchedResources = new Set();
      const fetchedEnum = new Set();
      
      try {
        const data = await fetch(metadataUrl, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (data.ok) {
          const metaData = await data.json();
          setResMetaData(metaData);
          setFields(metaData[0].fieldValues);
          const foreignFields = metaData[0].fieldValues.filter((field: any) => field.foreign && field.name !== 'User');
          
          for (const field of foreignFields) {
            if (!fetchedResources.has(field.foreign)) {
              fetchedResources.add(field.foreign);
              await fetchForeignData(field.foreign, field.name, field.foreign_field);
            }
          }

          const enumFields = metaData[0].fieldValues.filter((field: any) => field.isEnum === true);
          for (const field of enumFields) {
            if (!fetchedEnum.has(field.possible_value)) {
              fetchedEnum.add(field.possible_value);
              await fetchEnumData(field.possible_value);
            }
          }
        } else {
          console.error('Failed to fetch components:', data.statusText);
        }
      } catch (error) {
        console.error('Error fetching components:', error);
      }
    };

    fetchResMetaData();
  }, []);

  const fetchEnumData = async (enumName: string) => {
    try {
      const response = await fetch(`${apiConfig.API_BASE_URL}/${enumName}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        setEnums((prev) => ({
          ...prev,
          [enumName]: data
        }));
      } else {
        console.error(`Error fetching enum data for ${enumName}:`, response.status);
      }
    } catch (error) {
      console.error(`Error fetching enum data for ${enumName}:`, error);
    }
  };

  const fetchForeignData = async (foreignResource: string, fieldName: string, foreignField: string) => {
    try {
      const params = new URLSearchParams();
      const ssid: any = sessionStorage.getItem('key');
      params.append('queryId', 'GET_ALL');
      params.append('session_id', ssid);

      const response = await fetch(
        `${apiConfig.API_BASE_URL}/${foreignResource.toLowerCase()}?${params.toString()}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setForeignkeyData((prev) => ({
          ...prev,
          [foreignResource]: data.resource
        }));
      } else {
        console.error(`Error fetching foreign data for ${fieldName}:`, response.status);
      }
    } catch (error) {
      console.error(`Error fetching foreign data for ${fieldName}:`, error);
    }
  };

  const handleCreate = async () => {
    try {
      const ssid = sessionStorage.getItem('key');
      
      // Create form data for the request body instead of URL parameters
      const formData = new URLSearchParams();
      const jsonString = JSON.stringify({
        ...dataToSave,
        User: HARDCODED_USER_ID // Include the hardcoded user ID
      });
      const base64Encoded = btoa(jsonString);
      
      formData.append('resource', base64Encoded);
      formData.append('session_id', ssid || '');
  
      console.log("Final data being sent:", dataToSave); // Debug log
      console.log("JSON string length:", jsonString.length); // Debug log
      console.log("Base64 encoded length:", base64Encoded.length); // Debug log
  
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString() // Send data in body instead of URL
      });
  
      if (response.ok) {
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          navigate('/'); // Redirect after successful submission
        }, 3000);
        setDataToSave({});
      } else {
        const errorText = await response.text();
        console.error("Error response:", response.status, errorText);
        alert(`Error creating feedback: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error: Unable to submit feedback. Please check your connection and try again.");
    }
  };


  const getFormattedDate = (): string => {
    const date = new Date(Date.now());
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="container d-flex justify-content-center align-items-center mt-5">
      <div className="card shadow w-100" style={{ maxWidth: '600px' }}>
        <div className="card-header bg-primary text-white text-center">
          <h4 className="mb-0">Create Feedback</h4>
        </div>
        <div className="card-body">
          {fields.map((field, index) => {
            if (field.name !== 'id' && !regex.test(field.name) && field.name !== 'User') {
              if (field.name === 'Description') {
                return (
                  <div key={index} className="mb-3">
                    <label className="form-label">
                      {field.required && <span className="text-danger">*</span>} {field.name}
                    </label>
                    <textarea
                      className="form-control"
                      name={field.name}
                      required={field.required}
                      placeholder={field.name}
                      value={dataToSave[field.name] || ''}
                      onChange={(e) => setDataToSave({ ...dataToSave, [e.target.name]: e.target.value })}
                      rows={3}
                    />
                  </div>
                );
              } else if (field.name === 'Date') {
                return (
                  <div key={index} className="mb-3">
                    <label className="form-label">
                      {field.required && <span className="text-danger">*</span>} {field.name}
                    </label>
                    <input
                      type={field.type}
                      className="form-control"
                      name={field.name}
                      required={field.required}
                      placeholder={field.name}
                      value={dataToSave[field.name] || ''}
                      onChange={(e) => setDataToSave({ ...dataToSave, [e.target.name]: e.target.value })}
                    />
                  </div>
                );
              } else if (field.name === 'Image') {
                return (
                  <div key={index} className="mb-3">
                    <label className="form-label">
                      {field.required && <span className="text-danger">*</span>} {field.name}
                    </label>
                    <ImageUploader
                      value={dataToSave[field.name] || ''}
                      onChange={(dataUrl) => {
                        console.log("Image data URL:", dataUrl); // Debug log
                        setDataToSave({ ...dataToSave, [field.name]: dataUrl });
                      }}
                      required={field.required}
                    />
                  </div>
                );
              } else if (field.isEnum) {
                return (
                  <div key={index} className="mb-3">
                    <label className="form-label">
                      {field.required && <span className="text-danger">*</span>} {field.name}
                    </label>
                    <select
                      className="form-select"
                      name={field.name}
                      required={field.required}
                      value={dataToSave[field.name] || ''}
                      onChange={(e) =>
                        setDataToSave({ ...dataToSave, [e.target.name]: e.target.value })
                      }
                    >
                      <option value="">Select {field.name}</option>
                      {enums[field.possible_value]?.map((enumValue: any, idx: number) => (
                        <option key={idx} value={enumValue}>
                          {enumValue}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              } else {
                return (
                  <div key={index} className="mb-3">
                    <label className="form-label">
                      {field.required && <span className="text-danger">*</span>} {field.name}
                    </label>
                    <input
                      type={field.type}
                      className="form-control"
                      name={field.name}
                      required={field.required}
                      placeholder={field.name}
                      value={dataToSave[field.name] || ''}
                      onChange={(e) =>
                        setDataToSave({ ...dataToSave, [e.target.name]: e.target.value })
                      }
                    />
                  </div>
                );
              }
            }
            return null;
          })}
          <button className="btn btn-success w-100 mt-3" onClick={handleCreate}>
            Submit Feedback
          </button>
        </div>
      </div>
      {/* Toast Notification */}
      {showToast && (
        <div
          className="toast-container position-fixed top-50 start-50 translate-middle p-3"
          style={{ zIndex: 2000 }}
        >
          <div className="toast show bg-light border-success" role="alert">
            <div className="toast-header">
              <strong className="me-auto text-success">Success</strong>
              <button
                type="button"
                className="btn-close"
                onClick={() => {
                  setShowToast(false);
                  navigate('/'); // Redirect to login page after showing the toast
                  setDataToSave({}); // Reset the form data
                }}
              ></button>
            </div>
            <div className="toast-body text-success text-center">Feedback submitted successfully!</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateFeedback;