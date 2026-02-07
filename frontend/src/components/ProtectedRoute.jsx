
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
    const { currentUser, userRole, loading } = useAuth();

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    // If user has no role, force them to role selection (handled in Login usually, but good safeguard)
    // For this simplified flow, we might redirect to a role selection page or handle it in Login

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // User authorized but not for this role
        return <Navigate to="/dashboard" replace />; // or an Unauthorized page
    }

    return children;
};
