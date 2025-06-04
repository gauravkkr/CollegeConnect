import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';

// Form validation schema
const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Get the return URL from location state or default to home
  const from = location.state?.from?.pathname || '/';
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });
  
  const onSubmit = async (data: LoginFormValues) => {
    try {
      setAuthError(null);
      await login(data.email, data.password);
      navigate(from, { replace: true });
    } catch (error) {
      setAuthError('Login failed. Please check your credentials.');
    }
  };
  
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md animate-fade-in animate-slide-up">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <div className="text-center">
            <h2 className="mb-6 text-center text-3xl font-bold text-gray-900">
              Welcome Back
            </h2>
            <p className="mb-6 text-gray-600">
              Sign in to access your account and continue buying and selling on campus.
            </p>
          </div>
          
          {authError && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{authError}</div>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="text-sm">
                  <Link to="#" className="font-medium text-primary hover:text-primary-dark">
                    Forgot your password?
                  </Link>
                </div>
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('password')}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  {...register('rememberMe')}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>
            </div>
            
            <div>
              <Button
                type="submit"
                variant="primary"
                className="w-full flex justify-center"
                isLoading={isLoading}
              >
                {!isLoading && <LogIn className="mr-2 h-4 w-4" />}
                Sign in
              </Button>
            </div>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or</span>
              </div>
            </div>
            
            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600">
                Don't have an account yet?{' '}
                <Link to="/signup" className="font-medium text-primary hover:text-primary-dark">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;