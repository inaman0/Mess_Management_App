// MainLayout.js
import React from 'react';
import Sidebar from '../components/Sidebar';
import Background from '../components/Background';
import { Outlet } from 'react-router-dom';
import './Mainlayout.css';

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="main-content">
        <Background />
        <div className="content-container px-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;