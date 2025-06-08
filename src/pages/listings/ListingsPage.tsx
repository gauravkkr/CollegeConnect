import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Filter, Search } from 'lucide-react';
import { useListings, type Listing } from '../../hooks/useListings';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatPrice } from '../../lib/utils';

const ListingsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { listings, getListings, isLoading } = useListings();

  useEffect(() => {
    getListings({ category: selectedCategory === 'All' ? '' : selectedCategory, search: searchQuery });
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex flex-col py-10">
      <div className="container mx-auto px-4">
        <div className="rounded-2xl bg-white shadow-xl p-10 mb-10 animate-fade-in animate-slide-up">
          {window.history.length > 1 && (
            <button
              onClick={() => navigate(-1)}
              className="mb-8 flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#ef6c13] to-[#f3701a] text-white font-bold shadow hover:from-[#e65c00] hover:to-[#f3701a]"
            >
              &#8592; Back
            </button>
          )}
          <h1 className="mb-8 text-4xl font-extrabold text-gray-900">Browse Listings</h1>
          <div className="flex flex-col gap-4 md:flex-row md:items-center mb-8">
            {/* Search Bar */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search listings..."
                className="h-14 w-full rounded-2xl border-2 border-orange-200 bg-gray-50 pl-14 pr-4 text-lg shadow focus:border-orange-700 focus:ring-2 focus:ring-orange-200 focus:outline-none placeholder-gray-400 transition-all duration-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-5 top-4 h-6 w-6 text-gray-400" />
            </div>
            {/* Filter Button (Mobile) */}
            <Button
              variant="outline"
              className="flex items-center md:hidden rounded-2xl border-2 border-orange-200 text-lg font-bold bg-white hover:bg-orange-50"
              onClick={() => {/* Toggle mobile filter menu */}}
            >
              <Filter className="mr-2 h-5 w-5" />
              Filter
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Categories Sidebar */}
            <div className="hidden lg:block">
              <div className="rounded-2xl border-2 border-orange-200 bg-orange-50 p-6">
                <h2 className="mb-4 text-xl font-bold text-gray-900">Categories</h2>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`w-full rounded-xl px-4 py-3 text-left text-lg font-semibold transition-colors ${
                        selectedCategory === (category === 'All' ? '' : category)
                          ? 'bg-gradient-to-r from-orange-400 to-orange-300 text-white shadow'
                          : 'hover:bg-orange-100 text-gray-700'
                      }`}
                      onClick={() => setSelectedCategory(category)}
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
                <div className="flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50 p-8 text-center">
                  <p className="mb-4 text-lg text-gray-600">No listings found</p>
                  <Link to="/listings/create">
                    <Button variant="primary" className="text-lg px-8 py-3 rounded-2xl font-bold">Create a Listing</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {listings
                    .filter(listing => !selectedCategory || selectedCategory === 'All' || listing.category === selectedCategory)
                    .map((listing) => (
                      <ListingCard key={listing.id} listing={listing} />
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ListingCard = ({ listing }: { listing: Listing }) => {
  return (
    <Link 
      to={`/listings/${listing.id}`}
      className="group overflow-hidden rounded-2xl bg-white shadow-md border-2 border-orange-100 transition-all hover:shadow-lg animate-fade-in"
    >
      <div className="relative h-48 overflow-hidden">
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