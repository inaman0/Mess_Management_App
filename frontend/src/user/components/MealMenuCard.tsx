import React from 'react';
import { motion } from 'framer-motion';
import './Custom.css';

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
  mealType
}) => {
  return (
    <div
      className={`meal-card ${isFeast ? 'feast-card' : ''}`}
      data-meal-type={mealType}
    >
      <h3 className="dish-name">{Dish_name}</h3>
      <p className="dish-type">{type}</p>
      {isFeast && <div className="feast-badge">Feast Special</div>}
    </div>
  );
};

export default MealMenuCard;