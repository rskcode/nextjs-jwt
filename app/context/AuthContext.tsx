'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';
import { useRef } from "react";


interface UserProfile {
    userId: string;
    email: string;
    id: string;
    firstName: string;
    lastName: string;
    accountType: string;
    membershipType: string;
    country: string;
    gender: string;
    bio: string;
    location: string;
    avatar: string;
}

interface User {
    // user_id: string;
    username: string;
    exp: string; 
}

interface AuthToken {
    access: string | null;
    refresh: string | null;
}

interface AuthContextProps {
    // profileData: UserProfile | null;
    // setProfileData: (profile: UserProfile) => void;
    // isAuthenticated: boolean;
    // login: (data: UserProfile) => void;
    // logout: () => void;
    loginUser: (e: React.FormEvent<HTMLFormElement>) => void;
    user: User | null;
    logoutUser: () => void;
    authTokens: AuthToken | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // const [profileData, setProfileData] = useState<UserProfile | null>(null);
    
    const router = useRouter();

    const [authTokens, setAuthTokens] = useState<AuthToken | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true)


    // Login function
    const loginUser = async (e: React.FormEvent<HTMLFormElement>) => {
        console.log('loginUser');
        e.preventDefault();
        const form = e.currentTarget;
        
        let response = await fetch('http://127.0.0.1:8000/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: (form.elements.namedItem('username') as HTMLInputElement).value, 
                password: (form.elements.namedItem('password') as HTMLInputElement).value
            })
        })

        let data = await response.json()

        if (response.status === 200) {
            setAuthTokens(data)
            setUser(jwtDecode(data.access))

            Cookies.set('authTokens', JSON.stringify(data), {expires: 7})
            router.push('/');
        } else {
            alert('Something goes worng')
        }
    };

    // Logout function
    const logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        Cookies.remove('authTokens')
        router.push('/login')
    };

    const updateToken = async () => {

        const currentTokens = authTokensRef.current; // Access the latest tokens from ref
        if (!currentTokens?.refresh) {
            setLoading(false)
            return
        };
        console.log("update token!")

        let response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'refresh': currentTokens.refresh
            })
        })

        let data = await response.json()

        if (response.status === 200) {
            setAuthTokens(data)
            setUser(jwtDecode(data.access))

            Cookies.set('authTokens', JSON.stringify(data), {expires: 7})
        } else {
            logoutUser();
        }

        if (loading) {
            setLoading(false);
        }
    }

    // Add a ref for authTokens
    const authTokensRef = useRef(authTokens);

    // Update the ref whenever authTokens changes
    useEffect(() => {
        if (loading) {
            console.log('condition for loading')
            updateToken();
        }
        authTokensRef.current = authTokens;
    }, [authTokens]);

    // On component mount, retrieve authTokens from cookies if available
    useEffect(() => {

        const storedAuthTokens = Cookies.get('authTokens');
        if (storedAuthTokens) {
            const parsedTokens = JSON.parse(storedAuthTokens);
            setAuthTokens(parsedTokens);
            setUser(jwtDecode(parsedTokens.access)); // Decode the access token to get user info
        }

        let fourMinutes = 1000 * 60 * 4;
        // Start an interval to refresh the token every 60 minutes (3600000 ms)
        const interval = setInterval(() => {
            updateToken();
        }, fourMinutes); // 4 minutes

        // Clean up the interval on component unmount
        return () => clearInterval(interval);

    }, []);

    return (
        <AuthContext.Provider value={{loginUser, user, logoutUser, authTokens}} >
            {loading ? null : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
