import React, { useState, useEffect, createContext } from 'react'
// TEMPORARY: Using mock auth for demo - switch back to '../appwrite/auth' when backend is ready
import authService from '../appwrite/mockAuth'

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
            .finally(() => setLoading(false))
    }, [])

    const login = (userData) => {
        setUser(userData)
    }

    const logout = () => {
        setUser(null)
        authService.logout()
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
