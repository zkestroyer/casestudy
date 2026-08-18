import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: '📊' },
    { name: 'Products', path: '/products', icon: '📦' },
    { name: 'Categories', path: '/categories', icon: '🏷️' },
    { name: 'Suppliers', path: '/suppliers', icon: '🏢' },
    { name: 'Customers', path: '/customers', icon: '👥' },
    { name: 'Purchases', path: '/purchases', icon: '🛒' },
    { name: 'Orders', path: '/orders', icon: '🧾' },
    { name: 'Stock', path: '/stock', icon: '🏭' },
    { name: 'Payments', path: '/payments', icon: '💳' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">Business System</div>
      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink to={item.path} className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                <span className="nav-icon">{item.icon}</span>
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
export default Sidebar;
