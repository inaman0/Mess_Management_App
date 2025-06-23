import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Always visible toggle button on small screens */}
      <button
        className="sidebar-toggle btn btn-outline-primary"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        ☰
      </button>

      <div className={`user-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-content">
          <div className="text-center p-3">
            <img
              src="/IIITB_logo.png"
              alt="IIITB Logo"
              className="logo mb-2 mt-4"
              style={{ width: "60px", height: "60px" }}
            />
            <h6 className="mb-0 mt-4 fw-bold">International Institute of</h6>
            <h6 className="mb-3 fw-bold">Information Technology Bangalore</h6>
          </div>
          <nav className="nav-links">
            <NavLink to="/" end className="nav-link">
              Dashboard
            </NavLink>
            <NavLink to="/menu" className="nav-link">
              Today's Menu
            </NavLink>
            <NavLink to="/weekmenu" className="nav-link">
              Week's Menu
            </NavLink>
            <NavLink to="/sickmeal" className="nav-link">
              Sick Meal
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Overlay for sidebar */}
      {isOpen && window.innerWidth >= 768 && (
        <div
          className="sidebar-overlay"
          onClick={toggleSidebar}
          role="button"
          aria-label="Close sidebar"
        />
      )}
    </>
  );
};

export default Sidebar;