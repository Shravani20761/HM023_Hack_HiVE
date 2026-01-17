import React, { useState, useEffect, createContext } from 'react'
import authService from '../appwrite/auth'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)

    useEffect(() => {
        authService.getCurrentUser()
            .then((userData) => {
                if (userData) {
                    setUser(userData)
                } else {
                    setUser(null)
                }
            })
            .catch((error) => {
                console.error("Auth Context :: getCurrentUser :: error", error);
                setUser(null);
            })
            .finally(() => setLoading(false))
    }, [])

    const login = async (userData) => {
        setUser(userData)
    }

    const logout = async () => {
        await authService.logout();
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
