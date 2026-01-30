import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../login/AuthContext';
import { LogOut } from 'lucide-react';
import NotificationBell from './NotificationBell';

const Layout: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background text-white font-sans selection:bg-white selection:text-black">
      <nav className="fixed w-full top-0 z-50 bg-background/90 backdrop-blur-sm border-b-2 border-white">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <Link to={isAuthenticated ? "/home" : "/"} className="text-3xl font-display font-bold tracking-tighter uppercase border-2 border-white px-2 py-1 hover:bg-white hover:text-black transition-colors duration-300">
            TRINITY
          </Link>
          
          <div className="flex items-center gap-8">
            {isAuthenticated ? (
              <>
                <Link to="/lost-items" className="text-sm font-bold uppercase tracking-widest hover:underline decoration-2 underline-offset-4 transition-all text-white">
                  Lost Items
                </Link>
                <Link to="/found-items" className="text-sm font-bold uppercase tracking-widest hover:underline decoration-2 underline-offset-4 transition-all text-white">
                  Found Items
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link to="/admin" className="text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all text-white border border-white px-2 py-1">
                    Admin
                  </Link>
                )}
                <NotificationBell />
                <div className="flex items-center gap-6 border-l-2 border-white pl-6">
                  <span className="text-sm font-bold uppercase tracking-wider hidden md:block text-white">
                    {user?.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black px-3 py-1 transition-all duration-300 border border-transparent hover:border-white text-white"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex gap-6 items-center">
                <Link to="/" className="text-sm font-bold uppercase tracking-widest hover:underline decoration-2 underline-offset-4 text-white">
                  Login
                </Link>
                <Link to="/register" className="btn-mappa text-sm py-2 px-6">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto px-6 pt-32 pb-16 min-h-[calc(100vh-80px)]">
        <Outlet />
      </main>

      <footer className="border-t-2 border-white py-8 mt-auto">
        <div className="container mx-auto px-6 text-center">
          <p className="font-black text-2xl uppercase tracking-widest text-white mb-4">Lost Found Notify</p>
          <p className="font-bold uppercase tracking-widest text-xs text-gray-400">© 2026 Trinity System. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
