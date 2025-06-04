import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { useListings, type Listing } from '../hooks/useListings';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { formatPrice } from '../lib/utils';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { featuredListings, getFeaturedListings, isLoading } = useListings();
  const navigate = useNavigate();
  
  useEffect(() => {
    getFeaturedListings();
  }, [getFeaturedListings]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/listings?search=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  const categories = [
    { name: 'Textbooks', icon: '📚' },
    { name: 'Electronics', icon: '💻' },
    { name: 'Furniture', icon: '🪑' },
    { name: 'Clothing', icon: '👕' },
    { name: 'Appliances', icon: '🔌' },
    { name: 'Services', icon: '🛠️' },
  ];
  
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section 
        className="relative flex min-h-[70vh] items-center justify-center bg-cover bg-center"
        style={{ 
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)' 
        }}
      >
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Buy, Sell, Connect <span className="text-accent">on Campus</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-200">
            The marketplace exclusively for college students. Find what you need or sell what you don't.
          </p>
          
          <form onSubmit={handleSearch} className="mx-auto mb-8 max-w-lg">
            <div className="relative">
              <input
                type="text"
                placeholder="What are you looking for?"
                className="h-14 w-full rounded-full border-0 bg-white pl-14 pr-4 text-gray-900 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-5 top-4 h-6 w-6 text-gray-400" />
              <button
                type="submit"
                className="absolute right-2 top-2 rounded-full bg-primary p-2.5 text-white transition-colors hover:bg-primary/90"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </form>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/listings">
              <Button variant="primary" size="lg">
                Browse Listings
              </Button>
            </Link>
            <Link to="/listings/create">
              <Button variant="outline" size="lg" className="bg-transparent text-white hover:bg-white/10">
                Post an Item
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Browse by Category</h2>
          
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/listings?category=${category.name}`}
                className="animate-fade-in flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-md transition-transform hover:scale-105"
              >
                <span className="mb-3 text-4xl">{category.icon}</span>
                <h3 className="font-medium">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Listings */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold">Featured Listings</h2>
            <Link to="/listings" className="flex items-center text-primary hover:underline">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {featuredListings.slice(0, 8).map((listing) => (
                <FeaturedListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-primary py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold">Ready to sell your items?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg">
            Join thousands of students who are buying and selling on campus. It takes less than a minute to post your first item.
          </p>
          <Link to="/listings/create">
            <Button 
              variant="accent" 
              size="lg"
              className="animate-pulse"
            >
              Post Your First Item
            </Button>
          </Link>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">How It Works</h2>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="animate-fade-in text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">1</div>
              <h3 className="mb-2 text-xl font-semibold">Create an Account</h3>
              <p className="text-gray-600">Sign up with your college email and set up your profile in seconds.</p>
            </div>
            
            <div className="animate-fade-in text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">2</div>
              <h3 className="mb-2 text-xl font-semibold">Post or Browse</h3>
              <p className="text-gray-600">List your items for sale or browse what other students are offering.</p>
            </div>
            
            <div className="animate-fade-in text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">3</div>
              <h3 className="mb-2 text-xl font-semibold">Connect & Exchange</h3>
              <p className="text-gray-600">Message buyers or sellers and meet up on campus to complete the transaction.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Featured Listing Card Component
const FeaturedListingCard = ({ listing }: { listing: Listing }) => {
  return (
    <Link 
      to={`/listings/${listing.id}`}
      className="animate-fade-in group overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 bg-accent px-3 py-1 text-sm font-medium text-white">
          {listing.category}
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{listing.title}</h3>
          <span className="font-bold text-primary">{formatPrice(listing.price)}</span>
        </div>
        
        <p className="mb-3 text-sm text-gray-600">
          {listing.description.length > 80 
            ? `${listing.description.substring(0, 80)}...` 
            : listing.description}
        </p>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">{listing.location}</span>
          <span className="font-medium text-secondary">
            {new Date(listing.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default HomePage;