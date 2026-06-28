import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckSquare } from 'lucide-react';

const AuthLayout = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-brand-muted font-geist font-medium">Verifying session...</span>
        </div>
      </div>
    );
  }

  // Redirect to dashboard if already logged in
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center space-x-2 text-brand-primary">
          <CheckSquare className="w-9 h-9 stroke-[2.5]" />
          <span className="text-3xl font-geist font-bold tracking-tight select-none">
            TaskSpace
          </span>
        </div>
        <h2 className="mt-4 text-center text-sm font-geist font-medium text-brand-muted uppercase tracking-wider">
          Digital calm for high performance
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 border border-brand-border shadow-soft-lg rounded-lg sm:px-10">
          <Outlet />
        </div>
      </div>
      
      <div className="mt-8 text-center text-xs text-brand-muted font-sans">
        &copy; {new Date().getFullYear()} TaskSpace Inc. All rights reserved.
      </div>
    </div>
  );
};

export default AuthLayout;
