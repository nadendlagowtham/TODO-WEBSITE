import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Input from '../components/Input';
import Button from '../components/Button';
import { UserPlus } from 'lucide-react';

const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const passwordVal = watch('password');

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await registerUser(data.name, data.email, data.password);
      toast.success('Workspace created successfully! Welcome to TaskSpace.');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || 'Failed to create workspace. Try a different email.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold font-geist text-brand-text text-center sm:text-left">
          Create your workspace
        </h3>
        <p className="mt-1.5 text-sm text-brand-muted text-center sm:text-left">
          Register now to organize objectives and optimize workflows.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          required
          error={errors.name}
          {...register('name', {
            required: 'Full name is required'
          })}
        />

        {/* Email Address */}
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

        {/* Password */}
        <Input
          label="Password"
          type="password"
          placeholder="Min. 6 characters"
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

        {/* Confirm Password */}
        <Input
          label="Confirm Password"
          type="password"
          placeholder="Repeat password"
          required
          error={errors.confirmPassword}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (val) => val === passwordVal || 'Passwords do not match'
          })}
        />

        {/* Register Button */}
        <Button
          type="submit"
          fullWidth
          loading={submitting}
          icon={UserPlus}
          className="mt-2"
        >
          Create Workspace
        </Button>
      </form>

      {/* Login Redirect Link */}
      <div className="text-center pt-2 border-t border-brand-border text-sm text-brand-muted">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-medium text-brand-primary hover:text-brand-indigo transition-colors"
        >
          Sign in instead
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
