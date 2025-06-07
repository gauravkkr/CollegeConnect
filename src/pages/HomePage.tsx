import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { useListings, type Listing } from '../hooks/useListings';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { formatPrice } from '../lib/utils';
import { ListingCard } from './listings/ListingsPage';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { listings, getListings } = useListings();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selectedCategory = params.get('category');
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  
  useEffect(() => {
    getListings();
  }, [getListings]);
  
  useEffect(() => {
    if (selectedCategory) {
      setFilteredListings(
        listings.filter(l => l.category === selectedCategory)
      );
    } else {
      setFilteredListings(listings);
    }
  }, [selectedCategory, listings]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/listings?search=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  const handleCategoryClick = (categoryName: string) => {
    if (selectedCategory === categoryName) {
      // If already selected, remove filter
      navigate('/');
    } else {
      navigate(`/?category=${encodeURIComponent(categoryName)}`);
    }
  };
  
  const categories = [
    { name: 'Textbooks', icon: '📚', description: 'Academic books, reference materials, semester books.' },
    { name: 'Electronics', icon: '💻', description: 'Laptops, tablets, earphones, calculators, smartwatches.' },
    { name: 'Clothing', icon: '👕', description: 'Hoodies, T-shirts, traditional wear, event outfits.' },
    { name: 'Appliances', icon: '🔌', description: 'Fans, heaters, induction cookers, mini fridges.' },
    { name: 'Notes', icon: '📝', description: 'Handwritten/digital notes for exams, assignments, cheat sheets.' },
    { name: 'PYQs', icon: '📄', description: 'Previous Year Question papers sorted by subject/branch.' },
    { name: 'Hobby Gear', icon: '🎸', description: 'Musical instruments, sports items, art supplies.' },
    { name: 'Furniture', icon: '🛏️', description: 'Beds, study tables, chairs, bookshelves (for hostel use).' },
    { name: 'Personal Care', icon: '🧴', description: 'Unused items like grooming kits, perfumes, hair dryers.' },
    { name: 'College Merchandise', icon: '🎓', description: 'College-branded items like mugs, T-shirts, ID holders.' },
    { name: 'Travel Accessories', icon: '🧳', description: 'Trolley bags, backpacks, helmets, raincoats.' },
    { name: 'Event Tickets', icon: '🎫', description: 'Tickets for college events, fests, and shows.' },
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex flex-col">
      {/* Hero Section */}
      <section 
        className="relative flex min-h-[70vh] items-center justify-center bg-cover bg-center"
        style={{ 
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)' 
        }}
      >
        <div className="container mx-auto px-4 text-center text-white">
          <div className="rounded-2xl bg-white/90 shadow-xl p-10 mb-10 mx-auto max-w-2xl animate-fade-in animate-slide-up">
            <h1 className="mb-6 text-5xl font-extrabold leading-tight text-gray-900">
              Buy, Sell, Connect <span className="text-accent">on Campus</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-700">
              The marketplace exclusively for college students. Find what you need or sell what you don't.
            </p>
            <form onSubmit={handleSearch} className="mx-auto mb-8 max-w-lg">
              <div className="relative">
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  className="h-14 w-full rounded-2xl border-2 border-orange-200 bg-gray-50 pl-14 pr-4 text-lg shadow focus:border-orange-700 focus:ring-2 focus:ring-orange-200 focus:outline-none placeholder-gray-400 transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-5 top-4 h-6 w-6 text-gray-400" />
                <button
                  type="submit"
                  className="absolute right-2 top-2 rounded-full bg-gradient-to-r from-orange-600 to-orange-400 p-3 text-white shadow-lg hover:from-orange-700 hover:to-orange-500 transition-all"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </form>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/listings">
                <Button variant="primary" size="lg" className="rounded-2xl font-bold px-8 py-3">Browse Listings</Button>
              </Link>
              <Link to="/listings/create">
                <Button variant="outline" size="lg" className="rounded-2xl font-bold px-8 py-3 bg-transparent text-primary border-2 border-orange-400 hover:bg-orange-50">Post an Item</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Categories Section */}
      <section className="bg-orange-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Browse by Category</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {categories.map((category) => (
              <button
                key={category.name}
                type="button"
                onClick={() => handleCategoryClick(category.name)}
                className={`animate-fade-in flex flex-col items-center rounded-2xl bg-white p-6 text-center shadow-md border-2 border-orange-100 transition-transform hover:scale-105 focus:outline-none ${selectedCategory === category.name ? 'ring-2 ring-orange-400' : ''}`}
              >
                <span className="mb-3 text-4xl">{category.icon}</span>
                <h3 className="font-medium text-lg text-gray-900">{category.name}</h3>
              </button>
            ))}
          </div>
        </div>
      </section>
      {/* Listings Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold">{selectedCategory ? `${selectedCategory} Listings` : 'All Listings'}</h2>
          </div>
          {filteredListings.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-2xl text-gray-400 font-bold">Not available</div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </section>
      {/* CTA Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-400 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold">Ready to sell your items?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg">
            Join thousands of students who are buying and selling on campus. It takes less than a minute to post your first item.
          </p>
          <Link to="/listings/create">
            <Button 
              variant="accent" 
              size="lg"
              className="animate-pulse rounded-2xl font-bold px-8 py-3 bg-white text-orange-600 border-2 border-white hover:bg-orange-50"
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

export default HomePage;