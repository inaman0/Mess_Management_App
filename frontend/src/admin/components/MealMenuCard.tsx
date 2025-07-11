import React from "react";
import "./MealMenuCard.css";

interface MenuItemCardProps {
  Dish_name: string;
  type: string;
  id: string;
  // isFeast: string;
  mealType?: string;
  ratings: {
    Menu_item_id: string;
    Ratings: number | string;
    [key: string]: any;
  }[];
}

const MealMenuCard: React.FC<MenuItemCardProps> = ({
  Dish_name,
  type,
  id,
  mealType,
  ratings,
}) => {
  const typeColorClass =
    type.toLowerCase() === "veg" ? "menu-item-veg" : "menu-item-nonveg";

  // Find all ratings for this menu item
  const itemRatings = ratings.filter((r) => r.Menu_item_id === id);

  // Calculate average rating
  const avgRating =
    itemRatings.length > 0
      ? (
          itemRatings.reduce((sum, r) => sum + Number(r.Ratings), 0) /
          itemRatings.length
        ).toFixed(1)
      : "No";

  // Get total number of ratings
  const totalRatings = itemRatings.length;

  // Format the rating display
  const ratingDisplay =
    totalRatings > 0
      ? `${avgRating} ⭐ (${totalRatings} rating${
          totalRatings !== 1 ? "s" : ""
        })`
      : "No ratings yet";

  return (
    <div
      className={"menu-item-card"}
      data-meal-type={mealType}
    >
      <div className="menu-item-content">
        <div className="menu-item-name-container">
          <div className="menu-item-name-wrapper">
            <h3 className="menu-item-name">
              {Dish_name[0].toUpperCase() + Dish_name.slice(1).toLowerCase()}
            </h3>
          </div>
          <p className={`menu-item-type ${typeColorClass}`}>{type}</p>

          <div className="menu-item-bottom">
            <p className="menu-item-rating">{ratingDisplay}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealMenuCard;
