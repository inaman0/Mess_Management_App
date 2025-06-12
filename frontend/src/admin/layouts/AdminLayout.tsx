import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar'

const AdminLayout = () => {
  return (
    <>
        <AdminSidebar />
    </>
  )
}

export default AdminLayout