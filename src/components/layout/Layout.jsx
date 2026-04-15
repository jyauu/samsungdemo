import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { LogOut, Sparkles } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../ui/Button';
import './Layout.css';

export const Layout = () => {
  const { role, logout } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="layout-container">
      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          <Sparkles className="icon-sparkles" size={24} color="var(--accent-cyan)" />
          NexGen <span>Agency</span>
        </Link>
        <div className="navbar-actions">
          {role && (
            <>
              <div className="role-badge">
                {role === 'influencer' ? '👤 Influencer View' : '🏢 Agency View'}
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut size={16} /> Logout
              </Button>
            </>
          )}
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};
