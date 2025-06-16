import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="d-flex flex-column bg-white vh-100 shadow-sm px-3 py-4" style={{ width: '220px', borderTopRightRadius: '20px', borderBottomRightRadius: '20px' }}>
      
      <div className="text-center mb-4">
        <img src="/IIITB_logo.png" alt="IIITB Logo" style={{ width: '60px', height: '60px' }} />
        <div className="mt-2 small fw-semibold text-muted">
          International Institute of<br />
          Information Technology<br />
          Bangalore
        </div>
      </div>

      <nav className="nav nav-pills flex-column">
        <Link
          to="/"
          className={`nav-link mb-2 ${location.pathname === '/' ? 'active' : ''}`}
        >
          Dashboard
        </Link>
        <Link
          to="/menu"
          className={`nav-link mb-2 ${location.pathname === '/menu' ? 'active' : ''}`}
        >
          Today's Menu
        </Link>
        <Link
          to="#"
          className={`nav-link mb-2 ${location.pathname === '/weeks-menu' ? 'active' : ''}`}
        >
          Week's Menu
        </Link>
        <Link
          to="/sickmeal"
          className={`nav-link mb-2 ${location.pathname === '/sickmeal' ? 'active' : ''}`}
        >
          Sick Meal
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
