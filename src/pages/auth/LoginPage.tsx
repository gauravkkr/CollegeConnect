import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn, Send } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }).optional(),
  mobile: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{10,}$/.test(val), {
      message: 'Mobile number must be at least 10 digits and contain only numbers',
    }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  rememberMe: z.boolean().optional(),
}).refine((data) => data.email || data.mobile, {
  message: 'Please enter either email or mobile number',
  path: ['email'],
});

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type ForgotFormValues = z.infer<typeof forgotPasswordSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, resetPassword } = useAuth(); // ensure resetPassword is defined
  const [authError, setAuthError] = useState<string | null>(null);
  const [loginMethod, setLoginMethod] = useState<'email' | 'mobile'>('email');

  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
      mobile: '',
    },
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    try {
      setAuthError(null);
      if (loginMethod === 'email') {
        await login(data.email || '', data.password, '');
      } else {
        await login('', data.password, data.mobile || '');
      }
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
          <div className="flex justify-center mb-6">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="24" fill="#D35400" />
              <text x="50%" y="56%" textAnchor="middle" fill="white" fontSize="22" fontWeight="bold" fontFamily="Arial, sans-serif" dy=".3em">
                CC
              </text>
            </svg>
          </div>
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
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

        <form className="space-y-6" onSubmit={handleSubmit(onLoginSubmit)}>
          <div className="flex justify-center gap-4 mb-6">
            <button
              type="button"
              className={`px-4 py-2 rounded-lg font-semibold border transition-all ${loginMethod === 'email' ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-orange-600 border-orange-300'}`}
              onClick={() => setLoginMethod('email')}
            >
              Login with Email
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-lg font-semibold border transition-all ${loginMethod === 'mobile' ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-orange-600 border-orange-300'}`}
              onClick={() => setLoginMethod('mobile')}
            >
              Login with Mobile
            </button>
          </div>
          {loginMethod === 'email' && (
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={`mt-0 block w-full rounded-md bg-white text-gray-900 font-semibold shadow-sm border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:border-orange-700 focus:ring-orange-700 px-4 py-3 placeholder-gray-400`}
                placeholder="Email Address"
                {...register('email')}
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>
          )}
          {loginMethod === 'mobile' && (
            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                id="mobile"
                type="tel"
                autoComplete="tel"
                className={`mt-0 block w-full rounded-md bg-white text-gray-900 font-semibold shadow-sm border ${errors.mobile ? 'border-red-500' : 'border-gray-300'} focus:border-orange-700 focus:ring-orange-700 px-4 py-3 placeholder-gray-400`}
                placeholder="Mobile Number"
                {...register('mobile')}
              />
              {errors.mobile && <p className="mt-1 text-xs text-red-600">{errors.mobile.message}</p>}
            </div>
          )}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              className={`mt-0 block w-full rounded-md bg-white text-gray-900 font-semibold shadow-sm border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:border-orange-700 focus:ring-orange-700 px-4 py-3 placeholder-gray-400`}
              placeholder="Password"
              {...register('password')}
            />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
          </div>

          <div className="flex items-center justify-between mt-2">
            <div></div>
            <Link to="/reset-password" className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-orange-700 focus:ring-orange-700"
              {...register('rememberMe')}
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>

          <Button type="submit" variant="primary" className="w-full text-lg font-bold rounded-2xl py-3 mt-6" isLoading={isLoading}>
            <LogIn className="mr-2 h-5 w-5" />
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
