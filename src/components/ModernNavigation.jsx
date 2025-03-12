import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import '../styles/ModernNavigation.css';

const ModernNavigation = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);
  
  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location]);

  const navItems = [
    { path: "/", label: "Dashboard", icon: "bi-speedometer2" },
    { path: "/data-import", label: "Data Import", icon: "bi-upload" },
    { path: "/search-screen", label: "Search", icon: "bi-search" },
    { path: "/batch-processing", label: "Processing", icon: "bi-cpu" },
    { path: "/reports-analytics", label: "Analytics", icon: "bi-bar-chart" },
    { path: "/audit-log", label: "Audit Log", icon: "bi-journal-text" }
  ];

  return (
    <nav className="modern-nav">
      <div className="logo-container">
        
        <h1 className="app-logo">
          <Image 
                    src="/src/img/logo.png" 
                    alt="Sanction Guard Logo"
                    width="30"
                    height="30"
                    className="me-2"
                  />
                  <span className="text-dark">Sanction Guard</span></h1>
                  {/* ***************ADD ENTERPRISE EDITION***************** */}
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