import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

const Layout = ({ children, currentPage, onNavigate, onLogout, user, isAdmin }) => {
  return (
    <div className="layout">
      <Sidebar 
        onNavigate={onNavigate} 
        currentPage={currentPage} 
        isAdmin={isAdmin}
      />
      <div className="main-content">
        <Header user={user} onLogout={onLogout} />
        <main className="content-area fade-in">{children}</main>
      </div>
    </div>
  );
};

export default Layout;