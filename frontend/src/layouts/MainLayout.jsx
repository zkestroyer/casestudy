import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, Package, FolderTree, Users, 
  Truck, ShoppingCart, Activity, CreditCard, 
  Settings, HelpCircle, LogOut, Search, Bell, User
} from 'lucide-react';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          Enterprise Biz
        </div>
        <nav className="sidebar-nav">
          <div style={{ padding: '0.5rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569', letterSpacing: '0.05em' }}>MAIN</div>
          <ul>
            <li>
              <NavLink to="/" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
                <LayoutDashboard className="nav-icon" size={18} /> Dashboard
              </NavLink>
            </li>
          </ul>

          <div style={{ padding: '1.5rem 1.5rem 0.5rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569', letterSpacing: '0.05em' }}>CATALOG</div>
          <ul>
            <li>
              <NavLink to="/products" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
                <Package className="nav-icon" size={18} /> Products
              </NavLink>
            </li>
            <li>
              <NavLink to="/categories" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
                <FolderTree className="nav-icon" size={18} /> Categories
              </NavLink>
            </li>
          </ul>

          <div style={{ padding: '1.5rem 1.5rem 0.5rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569', letterSpacing: '0.05em' }}>OPERATIONS</div>
          <ul>
            <li>
              <NavLink to="/suppliers" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
                <Truck className="nav-icon" size={18} /> Suppliers
              </NavLink>
            </li>
            <li>
              <NavLink to="/purchases" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
                <ShoppingCart className="nav-icon" size={18} /> Purchases
              </NavLink>
            </li>
            <li>
              <NavLink to="/orders" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
                <Activity className="nav-icon" size={18} /> Sales Orders
              </NavLink>
            </li>
            <li>
              <NavLink to="/stock" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
                <Package className="nav-icon" size={18} /> Stock Levels
              </NavLink>
            </li>
            <li>
              <NavLink to="/customers" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
                <Users className="nav-icon" size={18} /> Customers
              </NavLink>
            </li>
          </ul>

          <div style={{ padding: '1.5rem 1.5rem 0.5rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569', letterSpacing: '0.05em' }}>FINANCE</div>
          <ul>
            <li>
              <NavLink to="/payments" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
                <CreditCard className="nav-icon" size={18} /> Payments
              </NavLink>
            </li>
          </ul>
        </nav>
        
        <div style={{ padding: '1rem', borderTop: '1px solid #1e293b' }}>
          <button className="nav-item" style={{ width: '100%', textAlign: 'left' }}>
            <Settings className="nav-icon" size={18} /> Settings
          </button>
          <button className="nav-item" style={{ width: '100%', textAlign: 'left' }}>
            <HelpCircle className="nav-icon" size={18} /> Support
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="navbar">
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Search anything..." 
              style={{ padding: '0.5rem 1rem 0.5rem 2.2rem', borderRadius: '20px', border: '1px solid #e2e8f0', background: '#f8fafc', width: '300px', outline: 'none' }} 
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button style={{ color: '#64748b', position: 'relative' }}>
              <Bell size={20} />
              <span style={{ position: 'absolute', top: 0, right: 0, width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%' }}></span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: '1px solid #e2e8f0', paddingLeft: '1.5rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3730a3' }}>
                <User size={20} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user ? user.username : 'Admin'}</span>
                <button onClick={handleLogout} style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'left' }}>Logout</button>
              </div>
            </div>
          </div>
        </header>
        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
