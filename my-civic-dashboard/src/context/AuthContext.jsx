import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../api/client';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                try {
                    const response = await apiClient.get('/users/me/');
                    setUser(response.data);
                } catch (error) {
                    logout();
                }
            }
        };
        fetchUser();
    }, [token]);

    const login = async (email, password) => {
        try {
            const formData = new FormData();
            formData.append('username', email);
            formData.append('password', password);

            const response = await apiClient.post('/token', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const { access_token } = response.data;

            localStorage.setItem('token', access_token);
            setToken(access_token);
            navigate('/');
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const register = async (fullName, email, password, role) => {
         try {
            await apiClient.post('/users/', {
                full_name: fullName,
                email,
                password,
                role,
            });
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        navigate('/login');
    };

    const value = {
        user,
        token,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
