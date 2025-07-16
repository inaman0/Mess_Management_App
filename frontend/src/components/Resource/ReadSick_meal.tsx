import React, { useEffect, useState } from "react";
import apiConfig from "../../config/apiConfig";
import "./ReadSick_meal.css";

export type ResourceMetaData = {
  resource: string;
  fieldValues: any[];
};

interface UserData {
  id: string;
  Name?: string;
  Email?: string;
  Room_no?: string;
  [key: string]: any;
}

const ReadSick_meal = () => {
  const [rowData, setRowData] = useState<any[]>([]);
  const [resMetaData, setResMetaData] = useState<ResourceMetaData[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [userData, setUserData] = useState<UserData[]>([]);
  const [mealData, setMealData] = useState<any[]>([]);

  const itemsPerPage = 5;
  const regex = /^(g_|archived|extra_data)/;

  const apiUrl = `${apiConfig.getResourceUrl("sick_meal")}?`;
  const metadataUrl = `${apiConfig.getResourceMetaDataUrl("SickMeal")}?`;
  const userApiUrl = `${apiConfig.getResourceUrl("user")}?`;
  const mealApiUrl = `${apiConfig.getResourceUrl("meal")}?`;

  // Add this mapping object after your state declarations
  const fieldNameMapping: { [key: string]: string } = {
    User_id: "Student",
    user_id: "Student",
    Meal_id: "Meal",
    meal_id: "Meal",
    Instruction: "Instructions",
    instruction: "Instructions",
    instructions: "Instructions",
  };

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      const params = new URLSearchParams();
      const ssid = sessionStorage.getItem("key");
      const queryId = "GET_ALL";
      params.append("queryId", queryId);
      params.append("session_id", ssid || "");

      try {
        const response = await fetch(userApiUrl + params.toString(), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Error: " + response.status);
        const data = await response.json();
        setUserData(data.resource || []);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Fetch sick meal data
  useEffect(() => {
    const fetchResourceData = async () => {
      const params = new URLSearchParams();
      const ssid = sessionStorage.getItem("key");
      const queryId = "GET_ALL";
      params.append("queryId", queryId);
      params.append("session_id", ssid || "");

      try {
        const response = await fetch(apiUrl + params.toString(), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Error: " + response.status);
        const data = await response.json();
        setRowData(data.resource || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchResourceData();
  }, []);

  // Fetch metadata
  useEffect(() => {
    const fetchResMetaData = async () => {
      try {
        const response = await fetch(metadataUrl, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Error: " + response.status);
        const metaData = await response.json();
        setResMetaData(metaData);
        setFields(
          metaData[0]?.fieldValues?.filter(
            (field: any) => !regex.test(field.name) && field.name !== "id"
          ) || []
        );
      } catch (error) {
        console.error("Error fetching metadata:", error);
      }
    };

    fetchResMetaData();
  }, []);

  // Fetch meal data
  useEffect(() => {
    const fetchMealData = async () => {
      const params = new URLSearchParams();
      const ssid = sessionStorage.getItem("key");
      const queryId = "GET_ALL";
      params.append("queryId", queryId);
      params.append("session_id", ssid || "");

      try {
        const response = await fetch(mealApiUrl + params.toString(), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Error: " + response.status);
        const data = await response.json();
        setMealData(data.resource || []);
      } catch (error) {
        console.error("Error fetching meal data:", error);
      }
    };

    fetchMealData();
  }, []);

  // Function to get user details by User_id
  const getUserDetails = (userId: string) => {
    const user = userData.find((u) => u.id === userId);
    if (user) {
      return {
        name: user.Name || "N/A",
        email: user.Email || "N/A",
        room: user.Room_no || "N/A",
      };
    }
    return { name: "N/A", email: "N/A", room: "N/A" };
  };

  // Add function to get meal details by Meal_id
  const getMealDetails = (mealId: string) => {
    const meal = mealData.find((m) => m.id === mealId);
    if (meal) {
      return {
        mealType: meal.Meal_type || "N/A",
        date: meal.Date
          ? new Date(meal.Date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "N/A",
      };
    }
    return { mealType: "N/A", date: "N/A" };
  };

  const totalPages = Math.ceil(rowData.length / itemsPerPage);
  const paginatedData = rowData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="sickmeal-container">
      <div className="sickmeal-header">
        <h2>Sick Meal Requests</h2>
      </div>

      {paginatedData.length === 0 ? (
        <div className="alert">No data available.</div>
      ) : (
        <div className="sickmeal-grid">
          {paginatedData.map((meal, index) => (
            <div key={index} className="sickmeal-card">
              {fields.map((field) => {
                // Get the display name from mapping or use original field name
                const displayName = fieldNameMapping[field.name] || field.name;

                return (
                  <div key={field.name} className="sickmeal-item">
                    <strong>{displayName}:</strong>{" "}
                    {field.name === "User_id" || field.name === "user_id" ? (
                      // Special handling for User_id to show user details
                      <div className="student-details">
                        {(() => {
                          const userDetails = getUserDetails(meal[field.name]);
                          return (
                            <div>
                              <div>
                                <strong>Name:</strong> {userDetails.name}
                              </div>
                              <div>
                                <strong>Email:</strong> {userDetails.email}
                              </div>
                              <div>
                                <strong>Room:</strong> {userDetails.room}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    ) : field.name === "Meal_id" || field.name === "meal_id" ? (
                      // Special handling for Meal_id to show meal details
                      <div className="meal-details">
                        {(() => {
                          const mealDetails = getMealDetails(meal[field.name]);
                          return (
                            <div>
                              <div>
                                <strong>Meal Type:</strong>{" "}
                                {mealDetails.mealType}
                              </div>
                              <div>
                                <strong>Date:</strong> {mealDetails.date}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    ) : field.name.toLowerCase() === "description" ||
                      field.name.toLowerCase() === "reason" ||
                      field.name.toLowerCase() === "instruction" ||
                      field.name.toLowerCase() === "instructions" ? (
                      <div className="sickmeal-text-scroll">
                        <span>{meal[field.name] || "N/A"}</span>
                      </div>
                    ) : (
                      <span>{meal[field.name] || "N/A"}</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="pagination">
        <button
          className="pagination-button"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </button>
        <span className="page-count">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="pagination-button"
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ReadSick_meal;
