import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, LogOut, User as UserIcon, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get initials for profile placeholder
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <nav className="sticky top-0 z-40 w-full blur-header hairline-border border-t-0 border-x-0 bg-opacity-80 border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2 text-brand-primary">
              <CheckSquare className="w-6 h-6 stroke-[2.5]" />
              <span className="font-geist font-bold text-xl tracking-tight text-brand-text hover:text-brand-primary transition-colors">
                TaskSpace
              </span>
            </Link>
          </div>

          {/* User Actions Section */}
          <div className="flex items-center space-x-4">
            {user && (
              <span className="hidden sm:inline-block text-sm font-medium text-brand-muted">
                Welcome back, <span className="font-semibold text-brand-text font-geist">{user.name}</span>
              </span>
            )}

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-1.5 focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-geist font-semibold text-xs border border-transparent shadow-soft-sm hover:bg-brand-indigo transition-colors select-none">
                  {user ? getInitials(user.name) : 'U'}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-brand-muted hover:text-brand-text transition-colors" />
              </button>

              {dropdownOpen && (
                <div className="
                  absolute right-0 mt-2 w-56 bg-white border border-brand-border rounded shadow-soft-xl
                  py-1 animate-fadeIn origin-top-right focus:outline-none z-50
                ">
                  {/* User Profile Info */}
                  <div className="px-4 py-2.5 border-b border-brand-border">
                    <p className="text-xs font-semibold text-brand-muted font-geist uppercase tracking-wider">
                      Signed in as
                    </p>
                    <p className="text-sm font-bold text-brand-text truncate font-geist mt-0.5">
                      {user?.name || 'Guest User'}
                    </p>
                    <p className="text-xs text-brand-muted truncate mt-0.5">
                      {user?.email || 'guest@taskspace.com'}
                    </p>
                  </div>

                  {/* Dropdown Options */}
                  <Link
                    to="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-sm text-brand-muted hover:text-brand-text hover:bg-brand-canvas transition-colors"
                  >
                    <UserIcon className="w-4 h-4 mr-2.5 stroke-[2]" />
                    Dashboard
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-2 text-sm text-brand-error hover:bg-brand-error-bg hover:text-brand-error-text transition-colors border-t border-brand-border"
                  >
                    <LogOut className="w-4 h-4 mr-2.5 stroke-[2]" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
