import { useAuth } from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl animate-fade-in">
      <div className="mb-8 flex items-center gap-6 rounded-lg bg-white p-6 shadow-md">
        <Avatar src={user?.profileImage} alt={user?.name} size="xl" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
          <p className="text-gray-600">{user?.email}</p>
          <Button onClick={handleLogout} variant="outline" className="mt-3">Logout</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Link to="/profile" className="group rounded-lg border border-gray-200 bg-white p-6 shadow-md transition hover:border-primary hover:shadow-lg">
          <h3 className="mb-2 text-lg font-semibold text-primary group-hover:underline">Edit Profile</h3>
          <p className="text-gray-600">Update your personal information and profile picture.</p>
        </Link>
        <Link to="/listings/create" className="group rounded-lg border border-gray-200 bg-white p-6 shadow-md transition hover:border-primary hover:shadow-lg">
          <h3 className="mb-2 text-lg font-semibold text-primary group-hover:underline">Post a Listing</h3>
          <p className="text-gray-600">Sell books, electronics, or anything else to students.</p>
        </Link>
        <Link to="/messages" className="group rounded-lg border border-gray-200 bg-white p-6 shadow-md transition hover:border-primary hover:shadow-lg">
          <h3 className="mb-2 text-lg font-semibold text-primary group-hover:underline">Messages</h3>
          <p className="text-gray-600">View and reply to your conversations.</p>
        </Link>
        <Link to="/listings" className="group rounded-lg border border-gray-200 bg-white p-6 shadow-md transition hover:border-primary hover:shadow-lg">
          <h3 className="mb-2 text-lg font-semibold text-primary group-hover:underline">My Listings</h3>
          <p className="text-gray-600">Manage your active and past listings.</p>
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;