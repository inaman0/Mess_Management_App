import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = (): void => {
    setIsOpen(prev => !prev);
  };

  const getLinkClass = (path: string): string => {
    const isActive = location.pathname === path;
    return `nav-link ${isActive ? 'active' : ''}`;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className='navbar-left'>
          <div className="logo-container">
            <Link to="/admin" className="navbar-brand">
              <img src="/logo.png" alt="Logo" className="navbar-logo" />
              <span className='app-name'>Food-e</span>
            </Link>
          </div>
        </div>

        <div className="navbar-right">
          <div className="nav-links desktop-only">
            <Link to="/admin" className={getLinkClass('/admin')}>Upload Menu</Link>
            <Link to="/admin/add-feast" className={getLinkClass('/admin/add-feast')}>Add Feast</Link>
            <Link to="/admin/edit-menu" className={getLinkClass('/admin/edit-menu')}>Edit Menu</Link>
            <Link to="/admin/weeks-menu" className={getLinkClass('/admin/weeks-menu')}>Weekly Rating</Link>
            <Link to="/admin/feedback" className={getLinkClass('/admin/feedback')}>Feedback</Link>
          </div>
        </div>

        <button className="hamburger mobile-only" onClick={toggleMenu}>
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <button className="close-button" onClick={toggleMenu} aria-label="Close menu">✕</button>
        <Link to="/admin" onClick={toggleMenu} className={getLinkClass('/admin')}>Upload Menu</Link>
        <Link to="/admin/add-feast" onClick={toggleMenu} className={getLinkClass('/admin/add-feast')}>Add Feast</Link>
        <Link to="/admin/edit-menu" onClick={toggleMenu} className={getLinkClass('/admin/edit-menu')}>Edit Menu</Link>
        <Link to="/admin/weeks-menu" onClick={toggleMenu} className={getLinkClass('/admin/weeks-menu')}>Weekly Rating</Link>
        <Link to="/admin/feedback" onClick={toggleMenu} className={getLinkClass('/admin/feedback')}>Feedback</Link>
      </div>

      {/* Mobile Overlay */}
      {isOpen && <div className="overlay" onClick={toggleMenu} />}
    </nav>
  );
};

export default Navbar;
