import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, LogIn } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  // Close mobile menu when route changes (if you add mobile menu later)
  useEffect(() => {
    // setIsMobileMenuOpen(false);
  }, [location.pathname]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/listings?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-primary">CollegeConnect</Link>
        
        {/* Navigation */}
        <nav className="flex items-center gap-4">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search listings..."
              className="h-10 w-64 rounded-full border border-gray-300 bg-gray-50 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </form>
          
          {/* Desktop Navigation Links */}
          <Link to="/listings" className="text-sm font-medium text-gray-700 hover:text-primary">
            Browse
          </Link>
          <Link to="/messages" className="text-sm font-medium text-gray-700 hover:text-primary">
            Messages
          </Link>
          {token ? (
            <>
              <Link to="/dashboard" className="text-sm font-medium text-gray-700 hover:text-primary">
                Dashboard
              </Link>
              <Link to="/listings/create" className="text-sm font-medium text-gray-700 hover:text-primary">
                Post Item
              </Link>
              <button 
                onClick={logout} 
                className="ml-2 text-sm font-medium text-destructive hover:text-destructive-dark"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className="flex items-center">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" className="flex items-center">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;