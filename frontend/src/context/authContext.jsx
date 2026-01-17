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
