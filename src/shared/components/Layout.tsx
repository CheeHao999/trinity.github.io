import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../login/AuthContext';
import { LogOut, Menu, X } from 'lucide-react';
import NotificationBell from './NotificationBell';

const Layout: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="min-h-screen bg-background text-white font-sans selection:bg-white selection:text-black">
      <nav className="fixed w-full top-0 z-[100] bg-background/80 backdrop-blur-md border-b-2 border-white transition-all duration-300">
        <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <Link
            to={isAuthenticated ? "/home" : "/"}
            onClick={closeMenu}
            className="text-2xl md:text-3xl font-display font-black tracking-tighter uppercase border-2 border-white px-3 py-1 hover:bg-white hover:text-black transition-all duration-300 active:scale-95"
          >
            TRINITY
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMenu}
            className="p-2 md:hidden border-2 border-white hover:bg-white hover:text-black transition-all active:scale-90"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {isAuthenticated ? (
              <>
                <Link to="/lost-items" className="text-xs font-bold uppercase tracking-[0.2em] hover:text-gray-400 transition-all text-white">
                  Lost Items
                </Link>
                <Link to="/found-items" className="text-xs font-bold uppercase tracking-[0.2em] hover:text-gray-400 transition-all text-white">
                  Found Items
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link to="/admin" className="text-xs font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all text-white border-2 border-white px-3 py-1.5">
                    Admin
                  </Link>
                )}
                <NotificationBell />
                <div className="flex items-center gap-6 border-l-2 border-white pl-6">
                  <span className="text-xs font-black uppercase tracking-widest text-white">
                    {user?.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest bg-white text-black px-4 py-2 hover:bg-black hover:text-white border-2 border-white transition-all duration-300"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex gap-6 items-center">
                <Link to="/" className="text-xs font-bold uppercase tracking-[0.2em] hover:text-gray-400 text-white">
                  Login
                </Link>
                <Link to="/register" className="bg-white text-black px-6 py-2 text-xs font-black uppercase tracking-[0.2em] border-2 border-white hover:bg-black hover:text-white transition-all">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <div className={`
          md:hidden fixed inset-0 top-[73px] bg-background/98 z-50 transition-all duration-500 ease-in-out
          ${isMenuOpen ? 'opacity-100 visible translate-x-0' : 'opacity-0 invisible translate-x-full'}
        `}>
          <div className="flex flex-col p-8 gap-8 items-center text-center justify-center h-full">
            {isAuthenticated ? (
              <>
                <Link to="/home" onClick={closeMenu} className="text-3xl font-black uppercase tracking-tighter hover:italic">Home</Link>
                <Link to="/lost-items" onClick={closeMenu} className="text-3xl font-black uppercase tracking-tighter hover:italic">Lost Items</Link>
                <Link to="/found-items" onClick={closeMenu} className="text-3xl font-black uppercase tracking-tighter hover:italic">Found Items</Link>
                {user?.role === 'ADMIN' && (
                  <Link to="/admin" onClick={closeMenu} className="text-3xl font-black uppercase tracking-tighter hover:italic text-gray-500">Admin Panel</Link>
                )}
                <div className="h-px w-full bg-white/20 my-4"></div>
                <span className="text-sm font-bold uppercase tracking-widest opacity-50">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="w-full bg-white text-black py-5 text-xl font-black uppercase tracking-widest active:bg-gray-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/" onClick={closeMenu} className="text-4xl font-black uppercase tracking-tighter">Login</Link>
                <Link to="/register" onClick={closeMenu} className="w-full bg-white text-black py-5 text-xl font-black uppercase tracking-widest">Register</Link>
              </>
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
