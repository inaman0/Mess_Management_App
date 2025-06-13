import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar'
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