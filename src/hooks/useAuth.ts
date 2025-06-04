import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string | null;
  role: 'user' | 'admin';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

// Mock authentication for demo purposes
// In a real application, this would call an API
export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      
      login: async (email: string, password: string) => {
        // Reset any previous errors
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // For demo purposes, accept any credentials with proper format
          const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
          const isValidPassword = password.length >= 6;
          
          if (!isValidEmail || !isValidPassword) {
            throw new Error('Invalid credentials');
          }
          
          // Create mock user data (in real app, this would come from the API)
          const mockUser: User = {
            id: '123456',
            name: email.split('@')[0],
            email,
            profileImage: null,
            role: 'user',
          };
          
          const mockToken = 'mock-jwt-token';
          
          set({ 
            user: mockUser,
            token: mockToken,
            isLoading: false,
          });
          
          toast.success('Successfully logged in!');
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'An unknown error occurred' 
          });
          toast.error('Login failed. Please check your credentials.');
        }
      },
      
      signup: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Validate input
          const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
          const isValidPassword = password.length >= 6;
          
          if (!name || !isValidEmail || !isValidPassword) {
            throw new Error('Invalid signup information');
          }
          
          // Create mock user data
          const mockUser: User = {
            id: '123456',
            name,
            email,
            profileImage: null,
            role: 'user',
          };
          
          const mockToken = 'mock-jwt-token';
          
          set({ 
            user: mockUser,
            token: mockToken,
            isLoading: false,
          });
          
          toast.success('Account created successfully!');
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'An unknown error occurred' 
          });
          toast.error('Signup failed. Please try again.');
        }
      },
      
      logout: () => {
        set({ user: null, token: null });
        toast.success('You have been logged out');
      },
      
      updateProfile: async (userData: Partial<User>) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const currentUser = get().user;
          
          if (!currentUser) {
            throw new Error('Not authenticated');
          }
          
          // Update user data
          const updatedUser = {
            ...currentUser,
            ...userData,
          };
          
          set({ 
            user: updatedUser,
            isLoading: false,
          });
          
          toast.success('Profile updated successfully!');
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'An unknown error occurred' 
          });
          toast.error('Failed to update profile');
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);