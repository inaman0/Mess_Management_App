import React from "react";
import "./MealMenuCard.css";

interface MenuItemCardProps {
  Dish_name: string;
  type: string;
  id: string;
  isFeast: boolean;
  mealType?: string;
}

const MealMenuCard: React.FC<MenuItemCardProps> = ({
  Dish_name,
  type,
  isFeast,
  mealType,
}) => {
  const typeColorClass =
    type.toLowerCase() === "veg" ? "menu-item-veg" : "menu-item-nonveg";


  return (
    <div
      className={`menu-item-card ${isFeast ? "menu-item-feast" : ""}`}
      data-meal-type={mealType}
    >
      <div className="menu-item-content">
        {/* {console.log("MealMenuCard props:", { id, Dish_name, ratings })} */}
        <div className="menu-item-name-container">
          <div className="menu-item-name-wrapper">
            <h3 className="menu-item-name">
              {Dish_name[0].toUpperCase() + Dish_name.slice(1).toLowerCase()}
            </h3>
          </div>
          <p className={`menu-item-type ${typeColorClass}`}>{type}</p>

          <div className="menu-item-bottom">
            {/* <p className="menu-item-rating">
              {relevantRatings.length === 0
                ? "No ratings yet"
                : `${averageRating} ⭐ (${relevantRatings.length} rating${
                    relevantRatings.length > 1 ? "s" : ""
                  })`}
            </p> */}
          </div>
        </div>

        {isFeast && (
          <div className="menu-item-feast-badge">Feast Special</div>
        )}
      </div>
    </div>
  );
};

export default MealMenuCard;
