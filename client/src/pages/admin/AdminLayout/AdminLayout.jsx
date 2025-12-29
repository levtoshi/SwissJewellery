import { Box, ChartBar, Container } from "lucide-react"
import { NavLink, Outlet } from "react-router-dom"
import "./AdminLayout.scss"

const AdminLayout = () => {

  const activeClass = ({ isActive }) => isActive ? 'nav-btn active' : 'nav-btn';

  return (
    <div className="admin-layout">
      <h1 className="page-title">Admin panel</h1>
      <nav className="admin-nav">
        <NavLink to="/admin/products" className={activeClass}>
          <Box size={18}/> Products
        </NavLink>
        <NavLink to="/admin/categories" className={activeClass}>
          <ChartBar size={18}/> Categories
        </NavLink>
        <NavLink to="/admin/orders" className={activeClass}>
          <Container size={18}/> Orders
        </NavLink>
      </nav>
      <main>
        <Outlet/>
      </main>
    </div>
  )
}

export default AdminLayout