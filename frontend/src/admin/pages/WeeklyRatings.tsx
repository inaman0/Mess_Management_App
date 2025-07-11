import React, { useEffect, useState } from "react";
import apiConfig from "../../config/apiConfig";
import MealMenuCard from "../components/MealMenuCard";
import "./WeeklyRatings.css";
import ReadReview from "../../components/Resource/ReadReview";

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

interface Rating {
  Menu_item_id: string;
  Ratings: number | string;
  [key: string]: any;
}

const WeeklyRatings = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [meals, setMeals] = useState<MealData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [ratings, setRatings] = useState<Rating[]>([]); // 🔁 ratings managed here

  const apiUrl = `${apiConfig.getResourceUrl("menu_item")}?`;
  const apiMealUrl = `${apiConfig.getResourceUrl("meal")}?`;

  useEffect(() => {
    const fetchAllResources = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        const ssid = sessionStorage.getItem("key") || "";
        params.append("queryId", "GET_ALL");
        params.append("session_id", ssid);

        const [menuResponse, mealResponse] = await Promise.all([
          fetch(apiUrl + params.toString()),
          fetch(apiMealUrl + params.toString()),
        ]);

        if (!menuResponse.ok || !mealResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const menuData = await menuResponse.json();
        const mealData = await mealResponse.json();

        const parsedMeals =
          mealData.resource?.map((meal: any) => ({
            ...meal,
            Date: new Date(meal.Date),
          })) || [];

        setMenuItems(menuData.resource || []);
        setMeals(parsedMeals);
      } catch (error) {
        console.error("Error fetching resources:", error);
        setError("Failed to load menu. Please try again later.");
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
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const currentDayMeals = meals.filter(
    (meal) => meal.Date && isSameDate(meal.Date, currentDate)
  );

  const mealTypeMap = currentDayMeals.reduce<Record<string, string>>(
    (acc, meal) => {
      acc[meal.id] = meal.Meal_type;
      return acc;
    },
    {}
  );

  const currentDayMenuItems = menuItems.filter((item) =>
    currentDayMeals.some((meal) => meal.id === item.Meal_id)
  );

  const groupedMenu = currentDayMenuItems.reduce<Record<string, MenuItem[]>>(
    (acc, item) => {
      const mealType = mealTypeMap[item.Meal_id] || "Other";
      if (!acc[mealType]) acc[mealType] = [];
      acc[mealType].push(item);
      return acc;
    },
    {}
  );

  const mealTypeOrder = ["Breakfast", "Lunch", "Snacks", "Dinner", "Other"];

  if (isLoading)
    return <div className="wr-loading-message">Loading menu...</div>;
  if (error) return <div className="wr-error-message">{error}</div>;

  return (
    <>
      <h1 className="wr-title">Ratings</h1>
      <div className="wr-uploader-wrapper">
        {/* <ReadReview setRatings={setRatings} /> */}
        <div className="wr-menu-container">
          <div className="wr-date-navigation">
            <button onClick={() => changeDate(-1)} className="wr-btn-primary">
              Previous Day
            </button>
            <h1 className="wr-date-title">
              Menu for {formatDate(currentDate)}
            </h1>
            <button onClick={() => changeDate(1)} className="wr-btn-primary">
              Next Day
            </button>
          </div>

          {currentDayMenuItems.length === 0 ? (
            <div className="wr-empty-message">
              No menu items available for this day
            </div>
          ) : (
            mealTypeOrder.map((mealType) => {
              const items = groupedMenu[mealType];
              if (!items || items.length === 0) return null;

              return (
                <div key={mealType} className="wr-meal-type-section">
                  <h2 className="wr-meal-type-title">{mealType}</h2>
                  <div className="wr-meal-type-row">
                    {items.map((item) => (
                      <MealMenuCard
                        key={item.id}
                        Dish_name={item.Dish_name}
                        type={item.type}
                        id={item.id}
                        isFeast={false}
                        mealType={mealType}
                        ratings={ratings}
                      />
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
