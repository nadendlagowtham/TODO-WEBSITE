import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Input from '../components/Input';
import Checkbox from '../components/Checkbox';
import Button from '../components/Button';
import { LogIn } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await login(data.email, data.password, data.rememberMe);
      toast.success('Logged in successfully! Welcome to your workspace.');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || 'Invalid credentials. Please try again.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold font-geist text-brand-text text-center sm:text-left">
          Sign in to your account
        </h3>
        <p className="mt-1.5 text-sm text-brand-muted text-center sm:text-left">
          Enter your workspace credentials to access your todo board.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Input */}
        <Input
          label="Email Address"
          type="email"
          placeholder="name@company.com"
          required
          error={errors.email}
          {...register('email', {
            required: 'Email address is required',
            pattern: {
              value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
              message: 'Please enter a valid email address'
            }
          })}
        />

        {/* Password Input */}
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          required
          error={errors.password}
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters'
            }
          })}
        />

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between pt-1">
          <Checkbox
            label="Remember me"
            id="rememberMe"
            {...register('rememberMe')}
          />

          <div className="text-sm">
            <Link
              to="/forgot-password"
              onClick={(e) => {
                e.preventDefault();
                toast.info('Forgot Password functionality is not active in this sandbox mock.');
              }}
              className="font-medium text-brand-primary hover:text-brand-indigo transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {/* Login Button */}
        <Button
          type="submit"
          fullWidth
          loading={submitting}
          icon={LogIn}
          className="mt-2"
        >
          Sign In
        </Button>
      </form>

      {/* Register Redirect Link */}
      <div className="text-center pt-2 border-t border-brand-border text-sm text-brand-muted">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="font-medium text-brand-primary hover:text-brand-indigo transition-colors"
        >
          Create a workspace
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
