import { useAuth } from '../../hooks/useAuth';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import Avatar from '../../components/ui/Avatar';
import { User, ShoppingBag, LogOut, Edit3, Bell } from 'lucide-react';
import { useListings } from '../../hooks/useListings';
import { useEffect, useState } from 'react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Button from '../../components/ui/Button';

const navLinks = [
  { label: 'Dashboard', icon: User, to: '/dashboard' },
  { label: 'Profile', icon: Edit3, to: '/profile' },
  { label: 'My Listings', icon: ShoppingBag, to: '/listings' },
  { label: 'Post Listing', icon: ShoppingBag, to: '/listings/create' },
];

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { userListings, getUserListings, isLoading } = useListings();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    getUserListings();
    // Fetch unread messages count
    fetch('/api/messages/unread', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => res.json())
      .then(data => setUnreadCount(data.count || 0))
      .catch(() => setUnreadCount(0));
  }, [getUserListings]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper to prevent navigation if already on dashboard
  const handleNavClick = (e: React.MouseEvent, to: string) => {
    if (to === '/dashboard' && window.location.pathname === '/dashboard') {
      e.preventDefault();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex flex-col">
      {/* Dashboard Navbar */}
      <header className="w-full flex items-center justify-between px-10 py-6 bg-white shadow-lg border-b border-orange-100 z-30">
        <div className="flex items-center gap-4">
          <Avatar src={user?.profileImage} alt={user?.name} size="md" />
          <span className="text-2xl font-bold text-gray-900">Welcome, {user?.name?.split(' ')[0] || 'Student'}</span>
        </div>
        <div className="flex items-center gap-6">
          {/* Message Icon with badge */}
          <button
            className="relative group"
            onClick={() => navigate('/messages')}
            aria-label="Messages"
          >
            <Bell className="h-7 w-7 text-primary hover:text-orange-600 transition" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold animate-pulse">{unreadCount}</span>
            )}
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2 rounded-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 text-white shadow hover:from-orange-700 hover:to-orange-500 transition-all text-lg">
            <LogOut className="h-5 w-5" />Logout
          </button>
        </div>
      </header>
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col items-center gap-4 bg-white border-r border-orange-100 py-10 px-4 min-w-[100px] rounded-tr-3xl rounded-br-3xl shadow-lg">
          <Avatar src={user?.profileImage} alt={user?.name} size="md" className="mb-4" />
          <nav className="flex flex-col gap-6 mt-8 w-full">
            {/* Remove Messages from navLinks */}
            {navLinks.filter(link => link.label !== 'Messages').map(link => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.label}
                  to={link.to}
                  onClick={e => handleNavClick(e, link.to)}
                  className={({ isActive }) =>
                    `group flex flex-col items-center py-3 rounded-2xl transition cursor-pointer w-full text-lg font-semibold ${isActive ? 'bg-gradient-to-r from-orange-100 to-orange-200 text-primary shadow pointer-events-none opacity-70' : 'text-gray-400 hover:text-primary hover:bg-orange-50'}`
                  }
                  title={link.label}
                >
                  <Icon className="h-7 w-7 mb-1 transition group-hover:scale-110" />
                  <span className="text-xs">{link.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </aside>
        {/* Main Content */}
        <main className="flex-1 flex flex-col md:flex-row gap-8 p-6 md:p-12">
          <section className="flex-1">
            <div className="rounded-2xl bg-white shadow-xl p-10 mb-10 animate-fade-in animate-slide-up">
              {window.history.length > 1 && (
                <button
                  onClick={() => navigate(-1)}
                  className="mb-8 flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#ef6c13] to-[#f3701a] text-white font-bold shadow hover:from-[#e65c00] hover:to-[#f3701a]"
                >
                  &#8592; Back
                </button>
              )}
              <h1 className="text-4xl font-extrabold mb-6 text-gray-900">Welcome back, {user?.name?.split(' ')[0] || 'Student'}!</h1>
              <div className="mb-8 flex flex-wrap gap-4">
                <span className="inline-block rounded-full bg-primary/10 px-4 py-2 text-primary font-medium text-base">Verified Student</span>
                <span className="inline-block rounded-full bg-accent/10 px-4 py-2 text-accent font-medium text-base">Active Seller</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Link to="/listings/create" className="rounded-2xl bg-orange-50 p-6 shadow hover:shadow-lg transition group border-2 border-orange-100">
                  <div className="flex items-center gap-3 mb-2">
                    <ShoppingBag className="text-accent" />
                    <span className="font-semibold text-lg text-accent group-hover:underline">Post a Listing</span>
                  </div>
                  <p className="text-gray-600">Sell books, electronics, or anything else to students.</p>
                </Link>
                <Link to="/listings" className="rounded-2xl bg-green-50 p-6 shadow hover:shadow-lg transition group border-2 border-green-100">
                  <div className="flex items-center gap-3 mb-2">
                    <ShoppingBag className="text-success" />
                    <span className="font-semibold text-lg text-success group-hover:underline">My Listings</span>
                  </div>
                  <p className="text-gray-600">Manage your active and past listings.</p>
                </Link>
                <Link to="/profile" className="rounded-2xl bg-purple-50 p-6 shadow hover:shadow-lg transition group border-2 border-purple-100">
                  <div className="flex items-center gap-3 mb-2">
                    <Edit3 className="text-secondary" />
                    <span className="font-semibold text-lg text-secondary group-hover:underline">Edit Profile</span>
                  </div>
                  <p className="text-gray-600">Update your personal information and profile picture.</p>
                </Link>
              </div>
              {/* My Listings Section */}
              <div className="mt-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                  <ShoppingBag className="text-success" /> My Listings
                </h2>
                {isLoading ? (
                  <div className="flex h-40 items-center justify-center">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : userListings.length === 0 ? (
                  <div className="rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50 p-8 text-center">
                    <p className="mb-4 text-lg text-gray-600">You have not posted any listings yet.</p>
                    <Link to="/listings/create">
                      <Button variant="primary" className="text-lg px-8 py-3 rounded-2xl font-bold">Post Your First Listing</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {userListings.map((listing) => (
                      <Link
                        key={listing.id}
                        to={`/listings/${listing.id}`}
                        className="group overflow-hidden rounded-2xl bg-white shadow-md border-2 border-orange-100 transition-all hover:shadow-lg"
                      >
                        <div className="relative h-40 overflow-hidden">
                          <img
                            src={listing.images[0]}
                            alt={listing.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute bottom-0 left-0 bg-accent px-3 py-1 text-sm font-medium text-white rounded-tr-2xl">
                            {listing.category}
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="mb-2 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">{listing.title}</h3>
                            <span className="font-bold text-primary">{listing.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                          </div>
                          <p className="mb-3 text-sm text-gray-600">
                            {listing.description.length > 80 ? `${listing.description.substring(0, 80)}...` : listing.description}
                          </p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">{listing.location}</span>
                            <span className="font-medium text-secondary">
                              {new Date(listing.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Right: Profile Card */}
          <aside className="w-full md:w-80 bg-white rounded-3xl shadow-xl p-10 flex flex-col items-center border-2 border-orange-100 animate-fade-in animate-slide-up">
            <Avatar src={user?.profileImage} alt={user?.name} size="xl" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">{user?.name}</h2>
            <p className="text-gray-500 mb-2">{user?.mobile}</p>
            <p className="text-gray-500 mb-4">{user?.email}</p>
            <div className="flex gap-2 mb-6">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary font-medium">Student</span>
              <span className="rounded-full bg-accent/10 px-3 py-1 text-xs text-accent font-medium">Seller</span>
            </div>
            <div className="w-full mt-4">
              <div className="mb-4">
                <span className="block text-sm text-gray-500">Listings</span>
                <span className="text-lg font-bold text-gray-900">{userListings.length}</span>
              </div>
              <div className="mb-4">
                <span className="block text-sm text-gray-500">Messages</span>
                <span className="text-lg font-bold text-gray-900">--</span>
              </div>
              <div>
                <span className="block text-sm text-gray-500">Member since</span>
                <span className="text-lg font-bold text-gray-900">2025</span>
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;