import React from 'react';

interface MenuItemCardProps {
  Dish_name: string;
  type: string;
  id: string;
}

const MealMenuCard: React.FC<MenuItemCardProps> = ({ Dish_name, type }) => {
  return (
    <div className="border p-4 rounded-lg shadow bg-white hover:shadow-md transition">
      <h3 className="text-lg font-semibold">{Dish_name}</h3>
      <p className="text-sm text-gray-600">{type}</p>
    </div>
  );
};

export default MealMenuCard;
