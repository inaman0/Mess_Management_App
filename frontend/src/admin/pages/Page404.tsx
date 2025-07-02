import React from 'react';
import { Link } from 'react-router-dom';
import './Page404.css';

const Page404 = () => {
  return (
    <div className="page404-container">
      <div className="page404-content">
        <h1 className="page404-code">404</h1>
        <p className="page404-message">Oops! The page you're looking for doesn't exist.</p>
        <Link to="/admin" className="page404-button">Go Back to Dashboard</Link>
      </div>
      
    </div>
  );
};

export default Page404;
