import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-gray-50 px-4 py-16 text-center">
      <div className="animate-fade-in animate-slide-up">
        <h1 className="mb-2 text-9xl font-bold text-primary">404</h1>
        <h2 className="mb-8 text-2xl font-semibold text-gray-700">Page Not Found</h2>
        <p className="mb-8 max-w-md text-gray-600">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button variant="primary" className="flex items-center">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;