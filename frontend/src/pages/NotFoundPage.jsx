import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center animate-fadeIn">
      {/* 404 Icon Container */}
      <div className="w-20 h-20 rounded-full bg-white border border-brand-border flex items-center justify-center text-brand-primary mb-6 shadow-soft-sm">
        <HelpCircle className="w-10 h-10 stroke-[1.5] animate-bounce" />
      </div>

      {/* 404 Text headers */}
      <h1 className="text-5xl font-extrabold font-geist text-brand-text tracking-tight select-none">
        404
      </h1>
      <h3 className="text-xl font-bold font-geist text-brand-text mt-3">
        Workspace Route Not Found
      </h3>
      <p className="text-sm text-brand-muted mt-2 max-w-sm leading-relaxed mb-8">
        The destination you are trying to access does not exist, has been archived, or is restricted in this session context.
      </p>

      {/* Return home button */}
      <Link to="/dashboard">
        <Button variant="primary" icon={ArrowLeft}>
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
