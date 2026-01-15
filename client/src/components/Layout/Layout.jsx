import { Outlet, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Package, ShoppingCart, Shield, User, LogOut, LogIn, Contact, Menu, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import CartSidebar from '../CartSidebar/CartSidebar';
import './Layout.scss';

function Layout() {
  const { isAuthenticated, user, logout } = useAuth();
  const { toggleCart, itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const activeClass = ({ isActive }) => isActive ? 'nav-link active' : 'nav-btn';

  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <NavLink to="/" className="logo">SwissJewellery</NavLink>

          <nav className={`nav ${menuOpen ? 'open' : ''}`}>
            <NavLink to="/" className={activeClass}>
              <Package size={20}/> Catalog
            </NavLink>
            
            <button onClick={toggleCart} className="nav-btn cart-btn">
              <ShoppingCart size={20} /> Cart
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </button>

            
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <NavLink to="/admin" className={activeClass}>
                    <Shield size={20}/> Admin panel
                  </NavLink>
                )}
                <NavLink to="/profile" className={activeClass}>
                  <User size={20} /> Profile
                </NavLink>
                <button onClick={logout} className="nav-btn">
                  <LogOut size={20} /> Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={activeClass}>
                  <LogIn size={20}/> Login
                </NavLink>
                <NavLink to="/register" className={activeClass}>
                  <Contact size={20}/> Register
                </NavLink>
              </>
            )}
          </nav>

          <button className="burger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <main><Outlet /></main>
      <CartSidebar/>
    </div>
  );
}

export default Layout;