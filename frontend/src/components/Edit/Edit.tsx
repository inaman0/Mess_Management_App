import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import apiConfig from "../../config/apiConfig";

export type ResourceMetaData = {
  resource: string;
  fieldValues: any[];
};

const Edit = () => {
  const location = useLocation();
  const id = location.state.id;
  const editedData = location.state.editedData;
  const currUrl = location.state.currUrl;
  const resName = location.state.resName;
  const apiUrl = location.state.apiUrl;
  const metadataUrl = location.state.metadataUrl;
  const BaseUrl = location.state.BaseUrl;

  const [editedRecord, setEditedRecord] = useState<any>(editedData || {});
  const [fields, setFields] = useState<any[]>([]);
  const [resMetaData, setResMetaData] = useState<ResourceMetaData[]>([]);
  const [requiredFields, setRequiredFields] = useState<string[]>([]);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [foreignKeyData, setForeignKeyData] = useState<Record<string, any[]>>({});
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});
  const regex = /^(g_|archived|extra_data)/;
  const [enums, setEnums] = useState<Record<string, any[]>>({});


  useEffect(() => {
    const fetchResMetaData = async () => {
      const fetchedResources = new Set();
      const fetchedEnum = new Set();
      try {
        const response = await fetch(
          metadataUrl,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.ok) {
          const metaData = await response.json();
          setResMetaData(metaData);

          const fields = metaData[0]?.fieldValues || [];
          setFields(fields);

          const required = fields
            .filter((field: any) => !regex.test(field.name))
            .map((field: any) => field.name);
          setRequiredFields(required);

          const foreignFields = fields.filter((field: any) => field.foreign);
          for (const field of foreignFields) {
            if (!fetchedResources.has(field.foreign)) {
              fetchedResources.add(field.foreign);
              await fetchForeignData(field.foreign, field.name, field.foreign_field);
            }
          }

          const enumFields = fields.filter((field: any) => field.isEnum === true);
          for (const field of enumFields) {
            if (!fetchedEnum.has(field.possible_value)) {
              fetchedEnum.add(field.possible_value);
              await fetchEnumData(field.possible_value);
            }
          }
        } else {
          console.error("Failed to fetch metadata:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching metadata:", error);
      }
    };

    fetchResMetaData();
  }, [resName]);
  const fetchEnumData = async (enumName: string) => {
    try {
      const response = await fetch(
        `${apiConfig.API_BASE_URL}/${enumName}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

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
  }

  const fetchForeignData = async (foreignResource: string, fieldName: string, foreignField: string) => {
    try {
      const params = new URLSearchParams();
      const ssid: any = sessionStorage.getItem("key");
      params.append("queryId", "GET_ALL");
      params.append("session_id", ssid);

      const response = await fetch(
        `${BaseUrl}/${foreignResource.toLowerCase()}?${params.toString()}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setForeignKeyData((prev) => ({
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


  const handleEdit = (id: any, field: string, value: string) => {
    setEditedRecord((prevData: any) => ({
      ...prevData,
      [id]: {
        ...(prevData[id] || {}),
        [field]: value,
      },
    }));
  };


  const handleSearchChange = (fieldName: string, value: string) => {
    setSearchQueries((prev) => ({ ...prev, [fieldName]: value }));
  };


  const handleUpdate = async (id: any) => {
    if (!editedRecord[id]) return;

    const updatedRecord = {
      id,
      ...editedRecord[id],
    };

    const base64Encoded = btoa(JSON.stringify(updatedRecord));
    const params = new URLSearchParams();
    const ssid: any = sessionStorage.getItem("key");
    params.append("resource", base64Encoded);
    params.append("action", "MODIFY");
    params.append("session_id", ssid);

    try {
      const response = await fetch(
        apiUrl,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params.toString(),
        }
      );

      if (response.ok) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        window.location.assign(currUrl);
      } else {
        console.error("Error updating record:", response.statusText);
      }
    } catch (error) {
      console.error("Error in handleUpdate:", error);
    }
  };

  return (
    <div className="container mt-4">
      {fields.map((field, index) => {
        if (field.name !== "id" && !regex.test(field.name)) {
          if (field.foreign) {
            const options = foreignKeyData[field.foreign] || [];
            const filteredOptions = options.filter((option) =>
              option[field.foreign_field]
                .toLowerCase()
                .includes((searchQueries[field.name] || "").toLowerCase())
            );

            return (
              <div key={index} className="dropdown d-flex flex-column">
                <label>
                  {field.required && <span style={{ color: "red" }}>*</span>} {field.name}
                </label>
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  id={`dropdownMenu-${field.name}`}
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {editedRecord[id]?.[field.name] ||
                    `Select ${field.name}`}
                </button>
                <div className="dropdown-menu">
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder={`Search ${field.name}`}
                    value={searchQueries[field.name] || ""}
                    onChange={(e) => handleSearchChange(field.name, e.target.value)}
                  />
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option, i) => (
                      <button
                        key={i}
                        className="dropdown-item"
                        onClick={() =>
                          handleEdit(id, field.name, option[field.foreign_field])
                        }
                      >
                        {option[field.foreign_field]}
                      </button>
                    ))
                  ) : (
                    <span className="dropdown-item text-muted">No options available</span>
                  )}
                </div>
              </div>
            );
          } else if (field.isEnum === true) {
            return (
              <div key={index} className="form-group">
                <label>
                  {field.required && <span style={{ color: "red" }}>*</span>} {field.name}
                </label>
                <select
                  className="form-control"
                  value={editedRecord[id]?.[field.name] || ""}
                  onChange={(e) => handleEdit(id, field.name, e.target.value)}
                >
                  {Object.keys(enums).length != 0 && enums[field.possible_value].map((value: any, index: any) => (
                    <option key={index} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            );
          } else {
            return (
              <div key={index} className="form-group">
                <label>
                  {field.required && <span style={{ color: "red" }}>*</span>} {field.name}
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={editedRecord[id]?.[field.name] || ""}
                  onChange={(e) => handleEdit(id, field.name, e.target.value)}
                />
              </div>
            );
          }
        }
        return null;
      })}
      <button onClick={() => handleUpdate(id)} className="btn btn-success mt-3">
        Save
      </button>

      {showToast && (
        <div
          className="toast-container position-fixed top-20 start-50 translate-middle p-3"
          style={{ zIndex: 1550 }}
        >
          <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header">
              <strong className="me-auto">Success</strong>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowToast(false)}
              ></button>
            </div>
            <div className="toast-body text-success text-center">
              Updated successfully!
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Edit;

