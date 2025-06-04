import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, PlusCircle, LogIn, User, MessageCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Update header style on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/listings?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled || isMobileMenuOpen || location.pathname !== '/' 
          ? 'bg-white shadow-md' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">College<span className="text-accent">Connect</span></span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden items-center md:flex">
            <div className="relative mr-4">
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search listings..."
                  className="h-10 w-64 rounded-full border border-gray-300 bg-gray-50 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </form>
            </div>
            <Link to="/listings" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary">
              Browse
            </Link>
            {user ? (
              <>
                <Link to="/messages" className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary">
                  <MessageCircle className="mr-1 h-4 w-4" />
                  Messages
                </Link>
                <Link to="/dashboard" className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary">
                  <User className="mr-1 h-4 w-4" />
                  Dashboard
                </Link>
                <Link to="/listings/create">
                  <Button variant="primary" className="ml-2 flex items-center">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Post Item
                  </Button>
                </Link>
                <div className="ml-4 flex items-center">
                  <Avatar 
                    src={user.profileImage} 
                    alt={user.name} 
                    className="cursor-pointer"
                    onClick={() => navigate('/profile')}
                  />
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="outline" className="flex items-center">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary">Sign Up</Button>
                </Link>
              </div>
            )}
          </nav>
          
          {/* Mobile menu button */}
          <button
            className="flex items-center md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="animate-fade-in space-y-4 pb-6 pt-2 md:hidden">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search listings..."
                className="h-10 w-full rounded-full border border-gray-300 bg-gray-50 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </form>
            <div className="flex flex-col space-y-3">
              <Link to="/listings" className="flex items-center px-2 py-2 text-base font-medium text-gray-700 hover:text-primary">
                Browse Listings
              </Link>
              {user ? (
                <>
                  <Link to="/messages" className="flex items-center px-2 py-2 text-base font-medium text-gray-700 hover:text-primary">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Messages
                  </Link>
                  <Link to="/dashboard" className="flex items-center px-2 py-2 text-base font-medium text-gray-700 hover:text-primary">
                    <User className="mr-2 h-5 w-5" />
                    Dashboard
                  </Link>
                  <Link to="/profile" className="flex items-center px-2 py-2 text-base font-medium text-gray-700 hover:text-primary">
                    Profile
                  </Link>
                  <Link to="/listings/create" className="flex items-center px-2 py-2 text-base font-medium text-primary hover:text-primary-dark">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Post New Item
                  </Link>
                  <button 
                    onClick={logout} 
                    className="flex items-center px-2 py-2 text-base font-medium text-destructive hover:text-destructive-dark"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link to="/login">
                    <Button variant="outline" className="w-full justify-center">
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="primary" className="w-full justify-center">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;