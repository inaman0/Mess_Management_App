// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Navbar from '../components/Navbar';

// const AdminLayout: React.FC = () => {
//   return (
//     <>
//       <Navbar />
//       <Outlet />
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         closeOnClick
//         pauseOnHover
//         theme="light"
//       />
//     </>
//   );
// };

// export default AdminLayout;

import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/AdminSideBar'
import Background from '../components/Background'

const AdminLayout = () => {
  return (
    <div className='admin-layout'>  
        <Background />
        <AdminSidebar />
        <div className="admin-content">
          <Outlet />
        </div>
    </div>
  )
}

export default AdminLayout
