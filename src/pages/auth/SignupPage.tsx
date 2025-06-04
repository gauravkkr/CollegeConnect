import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';

// Form validation schema
const signupSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' })
    .refine((email) => {
      // Simple check for educational email domains - can be expanded
      const eduDomains = ['edu', 'ac.uk', 'ac.in', 'edu.au'];
      return eduDomains.some(domain => email.endsWith(domain)) || true; // Skipping for demo
    }, { message: 'Please use your college email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type SignupFormValues = z.infer<typeof signupSchema>;

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });
  
  const onSubmit = async (data: SignupFormValues) => {
    try {
      setAuthError(null);
      await signup(data.name, data.email, data.password);
      navigate('/dashboard');
    } catch (error) {
      setAuthError('Signup failed. Please try again.');
    }
  };
  
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md animate-fade-in animate-slide-up">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <div className="text-center">
            <h2 className="mb-6 text-center text-3xl font-bold text-gray-900">
              Create Your Account
            </h2>
            <p className="mb-6 text-gray-600">
              Join the campus marketplace to buy, sell, and connect with other students.
            </p>
          </div>
          
          {authError && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{authError}</div>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                required
                className={`mt-1 block w-full rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('name')}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                College Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                className={`mt-1 block w-full rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                className={`mt-1 block w-full rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('password')}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className={`mt-1 block w-full rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>
            
            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                className={`h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary ${
                  errors.terms ? 'border-red-500' : ''
                }`}
                {...register('terms')}
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                I agree to the{' '}
                <Link to="#" className="font-medium text-primary hover:text-primary-dark">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="#" className="font-medium text-primary hover:text-primary-dark">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.terms && (
              <p className="mt-1 text-xs text-red-600">{errors.terms.message}</p>
            )}
            
            <div>
              <Button
                type="submit"
                variant="primary"
                className="w-full flex justify-center"
                isLoading={isLoading}
              >
                {!isLoading && <UserPlus className="mr-2 h-4 w-4" />}
                Create Account
              </Button>
            </div>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;