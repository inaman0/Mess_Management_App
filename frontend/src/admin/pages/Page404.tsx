import React from 'react';
import { Link } from 'react-router-dom';
import './Page404.css';

const Page404 = () => {
  return (
    <>
      <h2 className='title'>Invalid URL</h2>
      <div className="page404-container">
        <div className="page404-content">
          <h1 className="page404-code">404</h1>
          <p className="page404-message">The page you are looking for does not exist.</p>
          <Link to="/admin" className="page404-button">Return to Dashboard</Link>
        </div>
      </div>
    </>
  );
};

export default Page404;
