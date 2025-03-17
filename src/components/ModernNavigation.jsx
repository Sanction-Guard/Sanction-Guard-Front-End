import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Base.css';
import '../styles/layouts/Navigation.css';
import '../styles/components/Animation.css';
import logo from '../img/logo.png';

const ModernNavigation = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname || "/");
  
  useEffect(() => {
    setActiveItem(location.pathname || "/");
  }, [location]);

  const navItems = [
    { path: "/", label: "Dashboard", icon: "bi-speedometer2" },
    { path: "/search-screen", label: "Search", icon: "bi-search" },
    { path: "/batch-processing", label: "Batch Processing", icon: "bi-cpu" },
    { path: "/data-import", label: "Data Import", icon: "bi-upload" },
    { path: "/reports-analytics", label: "Reports & Analytics", icon: "bi-bar-chart" },
    { path: "/audit-log", label: "Audit Log", icon: "bi-journal-text" }
  ];

  return (
    <nav className="modern-nav">
      <div className="logo-container container-fluid">
        <div className="app-logo-wrapper">
          <img src={logo} alt="Logo" className="app-logo-image" />
          <div className="app-logo-text">
            <h1 className="app-logo">SanctionGuard</h1>
            <h6>Enterprise edition</h6>
          </div>
        </div>
      </div>
      
      <ul className="nav-items">
        {navItems.map((item) => (
          <li key={item.path} className={activeItem === item.path ? "nav-item active" : "nav-item"}>
            <Link to={item.path} className="nav-link" onClick={() => setActiveItem(item.path)}>
              <i className={`bi ${item.icon}`}></i>
              <span className="nav-label">{item.label}</span>
              {activeItem === item.path && <span className="nav-indicator" />}
            </Link>
          </li>
        ))}
      </ul>
      
      <div className="nav-bottom">
        <div className="user-profile">
          <div className="avatar">
            <img src="/placeholder-avatar.jpg" alt="User" />
          </div>
          <div className="user-info">
            <h4>User Name</h4>
            <p>Admin</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ModernNavigation;