import React, { useState } from 'react';
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-8">
        {window.history.length > 1 && (
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#ef6c13] to-[#f3701a] text-white font-bold shadow hover:from-[#e65c00] hover:to-[#f3701a]"
          >
            &#8592; Back
          </button>
        )}
        <div className="text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="24" fill="#D35400"/>
              <text x="50%" y="56%" textAnchor="middle" fill="white" fontSize="22" fontWeight="bold" fontFamily="Arial, sans-serif" dy=".3em">
                CC
              </text>
            </svg>
          </div>
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
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              className={`mt-0 block w-full rounded-md bg-white text-gray-900 font-semibold shadow-sm border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:border-orange-700 focus:ring-orange-700 hover:border-orange-500 transition-all duration-200 sm:text-base px-4 py-3 placeholder-gray-400`}
              placeholder="Email Address"
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="text-sm">
                <Link to="#" className="font-medium text-orange-700 hover:text-orange-800">
                  Forgot your password?
                </Link>
              </div>
            </div>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              className={`mt-0 block w-full rounded-md bg-white text-gray-900 font-semibold shadow-sm border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:border-orange-700 focus:ring-orange-700 hover:border-orange-500 transition-all duration-200 sm:text-base px-4 py-3 placeholder-gray-400`}
              placeholder="Password"
              {...register('password')}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-orange-700 focus:ring-orange-700 transition-all duration-200"
              {...register('rememberMe')}
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 select-none cursor-pointer">
              Remember mee
            </label>
          </div>

          {/* Submit Button */}
          <div>
            <Button
              type="submit"
              variant="primary"
              className="w-full text-lg font-bold rounded-2xl py-3 mt-6"
              isLoading={isLoading}
            >
              <LogIn className="mr-2 h-5 w-5" />
              Login
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Don't have an account yet?{' '}
            <Link
              to="/signup"
              className="font-medium text-primary text-orange-700 hover:underline hover:text-orange-900 transition"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;