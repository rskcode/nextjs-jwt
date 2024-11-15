'use client';

// components/ProtectedRoute.tsx
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            router.push('/login'); // Redirect to login if not authenticated
        }
    }, [router]);

    // Only render the children if the user is authenticated
    return <>{user ? children : null}</>;
};

export default ProtectedRoute;
