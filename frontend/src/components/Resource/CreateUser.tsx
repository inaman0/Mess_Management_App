import React, { useState, useEffect } from 'react';
import apiConfig from '../../config/apiConfig';
import { useNavigate } from 'react-router-dom';

export type resourceMetaData = {
  resource: string;
  fieldValues: any[];
};

const CreateUser = () => {
  const [resMetaData, setResMetaData] = useState<resourceMetaData[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [dataToSave, setDataToSave] = useState<any>({});
  const [showToast, setShowToast] = useState<any>(false);
  const [foreignkeyData, setForeignkeyData] = useState<Record<string, any[]>>({});
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});
  const [enums, setEnums] = useState<Record<string, any[]>>({});
  const regex = /^(g_|archived|extra_data)/;
  const [isUser, setIsUser] = useState<boolean>(false);

  const apiUrl = apiConfig.getResourceUrl("user");
  const metadataUrl = apiConfig.getResourceMetaDataUrl("User");

  const navigate = useNavigate();

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

          const foreignFields = metaData[0].fieldValues.filter((field: any) => field.foreign);
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
          console.error('Failed to fetch metadata:', data.statusText);
        }
      } catch (error) {
        console.error('Error fetching metadata:', error);
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
        setEnums((prev) => ({ ...prev, [enumName]: data }));
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
          [foreignResource]: data.resource,
        }));
      } else {
        console.error(`Error fetching foreign data for ${fieldName}:`, response.status);
      }
    } catch (error) {
      console.error(`Error fetching foreign data for ${fieldName}:`, error);
    }
  };

  const handleCreate = async () => {
    const params = new URLSearchParams();
    const jsonString = JSON.stringify(dataToSave);
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
      setTimeout(() => setShowToast(false), 3000);
      setDataToSave({});
      setIsUser(false);
    }
  };

  const handleSearchChange = (fieldName: string, value: string) => {
    setSearchQueries((prev) => ({ ...prev, [fieldName]: value }));
  };

  return (
    <div className="container d-flex justify-content-center align-items-center mt-5">
      <div className="card shadow w-100" style={{ maxWidth: '600px' }}>
        <div className="card-header bg-primary text-white text-center">
          <h4 className="mb-0">Sign Up</h4>
        </div>
        <div className="card-body">
          {fields.map((field, index) => {
            if (field.name !== 'id' && !regex.test(field.name)) {
              if(field.name === 'Email'){
                return (
                        <div key={index} className="mb-3">
                          <label className="form-label">
                            {field.required && <span className="text-danger">*</span>} {field.name}
                          </label>
                          <input
                            type={field.type}
                            name={field.name}
                            className="form-control"
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
              if(field.name === 'Name'){
                return (
                        <div key={index} className="mb-3">
                          <label className="form-label">
                            {field.required && <span className="text-danger">*</span>} {field.name}
                          </label>
                          <input
                            type={field.type}
                            name={field.name}
                            className="form-control"
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
              else if (field.isEnum === true) {
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
                          onChange={(e) =>{
                            setDataToSave({ ...dataToSave, [e.target.name]: e.target.value })
                            if(e.target.value === 'User') setIsUser(true)
                            else setIsUser(false);
                            }
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
                  }
              else if(field.name === 'Room_no' && isUser) {
                return (
                  <div key={index} className="mb-3">
                    <label className="form-label">
                      {field.required && <span className="text-danger">*</span>} {field.name}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      className="form-control"
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
          <div className="fs-6 d-flex flex-column align-items-center">
            {/* <p className="mb-0 m-4">Forgot Password</p> */}
            <p>
              Already have an account?{" "}
              <a href="/login" className="text-decoration-none">
                Click Me
              </a>
            </p>
          </div>
          <button className="btn btn-success w-100 mt-3" onClick={handleCreate}>
            Create Account
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
                  navigate('/login'); // Redirect to login page after showing the toast
                  setDataToSave({}); // Reset the form data
                }}
              ></button>
            </div>
            <div className="toast-body text-success text-center">User created successfully!</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateUser;
