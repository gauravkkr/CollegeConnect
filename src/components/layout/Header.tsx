import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, MessageCircle, ShoppingBag, Home, PlusCircle, Bell, User, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/useTheme';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const { token, logout } = useAuth();
  const { darkMode, setDarkMode } = useTheme();

  const notifications = [
    { id: 1, text: 'New message from Alice', link: '/messages' },
    { id: 2, text: 'Your item was sold!', link: '/dashboard' },
    { id: 3, text: 'New message from Bob', link: '/messages' },
  ];

  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/listings?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="w-full flex items-center justify-between px-10 py-5 bg-white shadow-lg z-50 min-h-[84px] border-b border-gray-200">
      {/* Logo and Brand */}
      <div className="flex items-center gap-4 min-w-[260px]">
        <Home className="text-primary h-9 w-9 mr-2" />
        <Link to="/" className="font-extrabold text-3xl text-black tracking-tight select-none">
          <span className="text-[#ef6c13]">C</span>ollege
          <span className="text-[#ef6c13]">C</span>onnect
        </Link>
      </div>
      {/* Search Bar */}
      <div className="flex-1 flex items-center justify-center">
        <form onSubmit={handleSearch} className="relative w-full max-w-3xl">
          <input
            type="text"
            placeholder="Search for products, books, or more..."
            className="w-full pl-14 pr-6 py-4 rounded-full bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary shadow text-lg transition-all duration-200"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            autoComplete="off"
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-400" />
        </form>
      </div>
      {/* Navigation & Actions */}
      <nav className="flex items-center gap-8 text-lg font-semibold relative">
        <Link to="/listings" className="flex items-center gap-2 px-5 py-2 rounded-lg hover:text-primary hover:bg-gray-100 transition text-lg"><ShoppingBag className="h-6 w-6" />Browse</Link>
        <Link to="/messages" className="flex items-center gap-2 px-5 py-2 rounded-lg hover:text-primary hover:bg-gray-100 transition text-lg relative">
          <MessageCircle className="h-6 w-6" />Messages
          <span className="absolute -top-2 -right-3 bg-primary text-white text-xs rounded-full px-2 py-0.5 font-bold">3</span>
        </Link>
        <Link to="/dashboard" className="flex items-center gap-2 px-5 py-2 rounded-lg hover:text-primary hover:bg-gray-100 transition text-lg"><User className="h-6 w-6" />Dashboard</Link>
        <Link to="/listings/create" className="flex items-center gap-2 px-5 py-2 rounded-lg hover:text-primary hover:bg-gray-100 transition text-lg"><PlusCircle className="h-6 w-6" />Post Item</Link>
        {token && (
          <button onClick={logout} className="flex items-center gap-2 px-5 py-2 rounded-lg hover:text-primary hover:bg-gray-100 transition font-bold text-lg"><LogOut className="h-6 w-6" />Logout</button>
        )}
        {/* Dark/Light Mode Toggle */}
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-lg font-bold"
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <Sun className="h-6 w-6 text-yellow-400" /> : <Moon className="h-6 w-6 text-gray-700" />}
          {darkMode ? 'Light' : 'Dark'}
        </button>
        {/* Notification Bell */}
        <div className="relative">
          <button
            className="relative group ml-2 px-5 py-2 rounded-lg hover:bg-gray-100 transition"
            title="Notifications"
            type="button"
            onClick={() => setShowNotifications((prev) => !prev)}
          >
            <Bell className="h-6 w-6 text-gray-500 hover:text-primary transition" />
            <span className="absolute -top-1 -right-2 bg-primary text-white text-xs rounded-full px-2 py-0.5 font-bold">{notifications.length}</span>
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 animate-fade-in overflow-hidden">
              <div className="p-4 border-b font-bold text-gray-700 bg-gray-50">Notifications</div>
              <ul className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                {notifications.length === 0 && (
                  <li className="p-4 text-gray-400 text-center">No notifications</li>
                )}
                {notifications.map((notif) => (
                  <li key={notif.id} className="p-4 hover:bg-gray-50 transition">
                    <Link to={notif.link} className="text-primary font-medium hover:underline">{notif.text}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {/* Auth Buttons */}
        {!token && (
          <>
            <Link to="/login" className="flex items-center gap-2 px-5 py-2 rounded-lg bg-orange-700 text-white font-bold hover:bg-orange-800 transition text-lg">
              Login
            </Link>
            <Link to="/signup" className="flex items-center gap-2 px-5 py-2 rounded-lg border-2 border-orange-700 text-orange-700 font-bold hover:bg-orange-700 hover:text-white transition text-lg ml-2">
              Sign Up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;