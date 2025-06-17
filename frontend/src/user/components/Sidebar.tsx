import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="d-flex">
      {isOpen && (
        <div className="d-flex flex-column bg-white vh-100 shadow-sm px-3 py-4"
             style={{ width: '220px', borderTopRightRadius: '20px', borderBottomRightRadius: '20px', transition: 'width 0.3s' }}>
          <div className="text-center mb-4">
            <img src="/IIITB_logo.png" alt="IIITB Logo" style={{ width: '60px', height: '60px' }} />
            <div className="mt-2 small fw-semibold text-muted text-wrap">
              International Institute of
              Information Technology
              Bangalore
            </div>
          </div>

          <nav className="nav nav-pills flex-column">
            <Link to="/" className={`nav-link mb-2 ${location.pathname === '/' ? 'active' : ''}`}>
              Dashboard
            </Link>
            <Link to="/menu" className={`nav-link mb-2 ${location.pathname === '/menu' ? 'active' : ''}`}>
              Today's Menu
            </Link>
            <Link to="/weeks-menu" className={`nav-link mb-2 ${location.pathname === '/weeks-menu' ? 'active' : ''}`}>
              Week's Menu
            </Link>
            <Link to="/sickmeal" className={`nav-link mb-2 ${location.pathname === '/sickmeal' ? 'active' : ''}`}>
              Sick Meal
            </Link>
          </nav>
        </div>
      )}

      {/* Toggle Button */}
      
    </div>
  );
};

export default Sidebar;
