import React from 'react';
import { motion } from 'framer-motion';
import './Custom.css';

interface MenuItemCardProps {
  Dish_name: string;
  type: string;
  id: string;
  isFeast: boolean;
}

const MealMenuCard: React.FC<MenuItemCardProps> = ({ Dish_name, type, isFeast }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      whileHover={{ scale: 1.02 }}
      className={`meal-card ${isFeast ? 'feast-border' : ''}`}
    >
      <h3 className="dish-name">{Dish_name}</h3>
      <p className="dish-type">{type}</p>

      {isFeast && (
        <div className="feast-badge">Feast Special 🎉</div>
      )}
    </motion.div>
  );
};

export default MealMenuCard;