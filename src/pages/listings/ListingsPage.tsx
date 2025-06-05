import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Search } from 'lucide-react';
import { useListings, type Listing } from '../../hooks/useListings';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatPrice } from '../../lib/utils';

const ListingsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { listings, getListings, isLoading } = useListings();
  
  useEffect(() => {
    getListings({ category: selectedCategory, search: searchQuery });
  }, [getListings, selectedCategory, searchQuery]);
  
  const categories = [
    'All',
    'Textbooks',
    'Electronics',
    'Clothing',
    'Appliances',
    'Notes',
    'PYQ',
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search and Filter Section */}
      <div className="mb-8">
        <h1 className="mb-6 text-3xl font-bold">Browse Listings</h1>
        
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          {/* Search Bar */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search listings..."
              className="h-12 w-full rounded-lg border border-gray-300 pl-12 pr-4 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          </div>
          
          {/* Filter Button (Mobile) */}
          <Button
            variant="outline"
            className="flex items-center md:hidden"
            onClick={() => {/* Toggle mobile filter menu */}}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Categories Sidebar */}
        <div className="hidden lg:block">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Categories</h2>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`w-full rounded-md px-4 py-2 text-left transition-colors ${
                    selectedCategory === (category === 'All' ? '' : category)
                      ? 'bg-primary text-white'
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedCategory(category === 'All' ? '' : category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Listings Grid */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : listings.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
              <p className="mb-4 text-lg text-gray-600">No listings found</p>
              <Link to="/listings/create">
                <Button variant="primary">Create a Listing</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ListingCard = ({ listing }: { listing: Listing }) => {
  return (
    <Link 
      to={`/listings/${listing.id}`}
      className="group overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg"
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

export default ListingsPage;