import { create } from 'zustand';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

// Types
export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor';
  images: string[];
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  ownerName: string;
  ownerImage?: string | null;
  location: string;
  isFeatured?: boolean;
}

export type ListingFormData = Omit<
  Listing,
  'id' | 'createdAt' | 'updatedAt' | 'ownerId' | 'ownerName' | 'ownerImage'
>;

interface ListingsState {
  listings: Listing[];
  userListings: Listing[];
  featuredListings: Listing[];
  currentListing: Listing | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  getListings: (filters?: any) => Promise<Listing[]>;
  getUserListings: () => Promise<Listing[]>;
  getFeaturedListings: () => Promise<Listing[]>;
  getListing: (id: string) => Promise<Listing | null>;
  createListing: (data: ListingFormData) => Promise<Listing>;
  updateListing: (id: string, data: Partial<ListingFormData>) => Promise<Listing>;
  deleteListing: (id: string) => Promise<boolean>;
}

// Mock data
const mockCategories = [
  'Textbooks',
  'Electronics',
  'Furniture',
  'Clothing',
  'Appliances',
  'Services',
  'Other'
];

const mockConditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

const mockLocations = [
  'North Campus',
  'South Campus',
  'West Dorms',
  'East Dorms',
  'Off Campus'
];

// Generate mock listings
const generateMockListings = (count: number): Listing[] => {
  return Array.from({ length: count }, (_, i) => {
    const category = mockCategories[Math.floor(Math.random() * mockCategories.length)];
    const condition = mockConditions[Math.floor(Math.random() * mockConditions.length)] as Listing['condition'];
    const location = mockLocations[Math.floor(Math.random() * mockLocations.length)];
    const price = Math.floor(Math.random() * 200) + 5;
    const isFeatured = Math.random() > 0.8;
    
    return {
      id: `listing-${i}`,
      title: `${category} Item ${i + 1}`,
      description: `This is a detailed description for item ${i + 1}. It's a ${condition.toLowerCase()} condition item available for purchase.`,
      price,
      category,
      condition,
      images: [
        `https://images.pexels.com/photos/${1000000 + i * 10}/pexels-photo-${1000000 + i * 10}.jpeg`,
        `https://images.pexels.com/photos/${1000000 + i * 10 + 1}/pexels-photo-${1000000 + i * 10 + 1}.jpeg`
      ],
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      ownerId: `user-${Math.floor(Math.random() * 10)}`,
      ownerName: `User ${Math.floor(Math.random() * 10)}`,
      ownerImage: Math.random() > 0.5 ? `https://i.pravatar.cc/150?u=${i}` : null,
      location,
      isFeatured
    };
  });
};

// Create the store
export const useListings = create<ListingsState>()((set, get) => {
  // Generate initial mock data
  const mockListings = generateMockListings(20);
  
  return {
    listings: mockListings,
    userListings: [],
    featuredListings: mockListings.filter(listing => listing.isFeatured),
    currentListing: null,
    isLoading: false,
    error: null,
    
    getListings: async (filters) => {
      set({ isLoading: true, error: null });
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Apply filters if any
        let filteredListings = [...mockListings];
        
        if (filters) {
          if (filters.category) {
            filteredListings = filteredListings.filter(
              listing => listing.category.toLowerCase() === filters.category.toLowerCase()
            );
          }
          
          if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filteredListings = filteredListings.filter(
              listing => 
                listing.title.toLowerCase().includes(searchTerm) || 
                listing.description.toLowerCase().includes(searchTerm)
            );
          }
          
          if (filters.minPrice) {
            filteredListings = filteredListings.filter(
              listing => listing.price >= filters.minPrice
            );
          }
          
          if (filters.maxPrice) {
            filteredListings = filteredListings.filter(
              listing => listing.price <= filters.maxPrice
            );
          }
        }
        
        set({ listings: filteredListings, isLoading: false });
        return filteredListings;
      } catch (error) {
        set({ 
          isLoading: false, 
          error: error instanceof Error ? error.message : 'Failed to fetch listings'
        });
        toast.error('Failed to load listings');
        return [];
      }
    },
    
    getUserListings: async () => {
      set({ isLoading: true, error: null });
      try {
        // Get current user
        const { user } = useAuth.getState();
        if (!user) {
          throw new Error('Not authenticated');
        }
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        // Filter listings by the actual logged-in user's ID
        const userListings = get().listings.filter(listing => listing.ownerId === user.id);
        set({ userListings, isLoading: false });
        return userListings;
      } catch (error) {
        set({ 
          isLoading: false, 
          error: error instanceof Error ? error.message : 'Failed to fetch user listings'
        });
        toast.error('Failed to load your listings');
        return [];
      }
    },
    
    getFeaturedListings: async () => {
      set({ isLoading: true, error: null });
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const featuredListings = mockListings.filter(listing => listing.isFeatured);
        
        set({ featuredListings, isLoading: false });
        return featuredListings;
      } catch (error) {
        set({ 
          isLoading: false, 
          error: error instanceof Error ? error.message : 'Failed to fetch featured listings'
        });
        toast.error('Failed to load featured listings');
        return [];
      }
    },
    
    getListing: async (id: string) => {
      set({ isLoading: true, error: null, currentListing: null });
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const listing = mockListings.find(listing => listing.id === id) || null;
        
        if (!listing) {
          throw new Error('Listing not found');
        }
        
        set({ currentListing: listing, isLoading: false });
        return listing;
      } catch (error) {
        set({ 
          isLoading: false, 
          error: error instanceof Error ? error.message : 'Failed to fetch listing'
        });
        toast.error('Failed to load listing details');
        return null;
      }
    },
    
    createListing: async (data: ListingFormData) => {
      set({ isLoading: true, error: null });
      
      try {
        // Get current user
        const { user } = useAuth.getState();
        
        if (!user) {
          throw new Error('Not authenticated');
        }
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create new listing
        const newListing: Listing = {
          ...data,
          id: `listing-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ownerId: user.id,
          ownerName: user.name,
          ownerImage: user.profileImage,
        };
        
        // Update listings state
        const updatedListings = [newListing, ...get().listings];
        const updatedUserListings = [newListing, ...get().userListings];
        
        set({ 
          listings: updatedListings,
          userListings: updatedUserListings,
          isLoading: false 
        });
        
        toast.success('Listing created successfully!');
        return newListing;
      } catch (error) {
        set({ 
          isLoading: false, 
          error: error instanceof Error ? error.message : 'Failed to create listing'
        });
        toast.error('Failed to create listing');
        throw error;
      }
    },
    
    updateListing: async (id: string, data: Partial<ListingFormData>) => {
      set({ isLoading: true, error: null });
      
      try {
        // Get current user
        const { user } = useAuth.getState();
        
        if (!user) {
          throw new Error('Not authenticated');
        }
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Find listing
        const existingListing = get().listings.find(listing => listing.id === id);
        
        if (!existingListing) {
          throw new Error('Listing not found');
        }
        
        // Check ownership
        if (existingListing.ownerId !== user.id && user.role !== 'admin') {
          throw new Error('Not authorized to update this listing');
        }
        
        // Update listing
        const updatedListing: Listing = {
          ...existingListing,
          ...data,
          updatedAt: new Date().toISOString(),
        };
        
        // Update state
        const updatedListings = get().listings.map(listing => 
          listing.id === id ? updatedListing : listing
        );
        
        const updatedUserListings = get().userListings.map(listing => 
          listing.id === id ? updatedListing : listing
        );
        
        set({ 
          listings: updatedListings,
          userListings: updatedUserListings,
          currentListing: updatedListing,
          isLoading: false 
        });
        
        toast.success('Listing updated successfully!');
        return updatedListing;
      } catch (error) {
        set({ 
          isLoading: false, 
          error: error instanceof Error ? error.message : 'Failed to update listing'
        });
        toast.error('Failed to update listing');
        throw error;
      }
    },
    
    deleteListing: async (id: string) => {
      set({ isLoading: true, error: null });
      
      try {
        // Get current user
        const { user } = useAuth.getState();
        
        if (!user) {
          throw new Error('Not authenticated');
        }
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Find listing
        const existingListing = get().listings.find(listing => listing.id === id);
        
        if (!existingListing) {
          throw new Error('Listing not found');
        }
        
        // Check ownership
        if (existingListing.ownerId !== user.id && user.role !== 'admin') {
          throw new Error('Not authorized to delete this listing');
        }
        
        // Update state by filtering out the deleted listing
        const updatedListings = get().listings.filter(listing => listing.id !== id);
        const updatedUserListings = get().userListings.filter(listing => listing.id !== id);
        const updatedFeaturedListings = get().featuredListings.filter(listing => listing.id !== id);
        
        set({ 
          listings: updatedListings,
          userListings: updatedUserListings,
          featuredListings: updatedFeaturedListings,
          currentListing: null,
          isLoading: false 
        });
        
        toast.success('Listing deleted successfully!');
        return true;
      } catch (error) {
        set({ 
          isLoading: false, 
          error: error instanceof Error ? error.message : 'Failed to delete listing'
        });
        toast.error('Failed to delete listing');
        return false;
      }
    },
  };
});