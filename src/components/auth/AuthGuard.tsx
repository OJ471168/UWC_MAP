import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-400 text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/join" replace />;
  }

  const hasAccess = profile?.membershipStatus === 'active' || profile?.role === 'admin';
  if (!hasAccess) {
    return <Navigate to="/join" replace />;
  }

  return <>{children}</>;
};

export { AuthGuard };
