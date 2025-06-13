import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./AdminSidebar.css";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Toggle Button */}
     <button
        className={`sidebar-toggle btn btn-outline-primary m-3 ${isOpen ? 'open' : ''}`}
        onClick={toggleSidebar}
      >
        ☰
      </button>


      {/* Sidebar Overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? "show" : ""}`}
        onClick={toggleSidebar}
      ></div>

      {/* Sidebar */}
      <div className={`admin-sidebar ${isOpen ? "open" : ""}`}>
        <div className="text-center p-3">
          <img
            src="/IIITB_logo.png"
            alt="IIITB Logo"
            className="logo mb-2"
            style={{ width: "60px", height: "60px" }}
          />
          <h6 className="mb-0">International Institute of</h6>
          <h6 className="mb-3">Information Technology Bangalore</h6>
        </div>
        <nav className="nav flex-column px-3">
          <NavLink to="/admin" end className="nav-link" onClick={toggleSidebar}>
            Upload Menu
          </NavLink>
          <NavLink
            to="/admin/weeks-menu"
            className="nav-link"
            onClick={toggleSidebar}
          >
            Weekly Rating
          </NavLink>
          <NavLink
            to="/admin/add-feast"
            className="nav-link"
            onClick={toggleSidebar}
          >
            Add Feast
          </NavLink>
          <NavLink
            to="/admin/edit-menu"
            className="nav-link"
            onClick={toggleSidebar}
          >
            Edit Menu
          </NavLink>
          <NavLink
            to="/admin/feedbacks"
            className="nav-link"
            onClick={toggleSidebar}
          >
            Feedback
          </NavLink>
        </nav>
      </div>

      {/* Page Content */}
      <div className="p-3">
        <Outlet />
      </div>
    </>
  );
};

export default AdminSidebar;
