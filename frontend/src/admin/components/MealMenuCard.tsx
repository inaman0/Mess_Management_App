import React from "react";
import "./MealMenuCard.css";
import ReadReview from "../../components/Resource/ReadReview";

interface MenuItemCardProps {
  Dish_name: string;
  type: string;
  id: string;
  isFeast: boolean;
}

const MealMenuCard: React.FC<MenuItemCardProps & { mealType?: string }> = ({
  Dish_name,
  type,
  isFeast,
  mealType,
}) => {
  // Set text color class based on type
  const typeColorClass =
    type.toLowerCase() === "veg" ? "menu-item-veg" : "menu-item-nonveg";

  return (
    <div
      className={`menu-item-card ${isFeast ? "menu-item-feast" : ""}`}
      data-meal-type={mealType}
    >
      <div className="menu-item-content">
        <div className="menu-item-name-container">
          <h3 className="menu-item-name">{Dish_name[0].toUpperCase() + Dish_name.slice(1).toLowerCase()}</h3>
          <p className={`menu-item-type ${typeColorClass}`}>{type}</p>
        </div>
        {isFeast && <div className="menu-item-feast-badge">Feast Special</div>}
      </div>
      
    </div>
  );
};

export default MealMenuCard;
