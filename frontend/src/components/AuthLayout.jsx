import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../context/authContext'
import LoadingSpinner from './LoadingSpinner'
import TopBar from './TopBar'

export default function AuthLayout({ children, authentication = true }) {
    const navigate = useNavigate()
    const [loader, setLoader] = useState(true)
    const { user, loading } = useContext(AuthContext)

    useEffect(() => {
        // If loading from context is finished
        if (!loading) {
            // authentication == true : pages that need login (Protected)
            // authentication == false : pages that don't need login (Public like Login/Signup)

            if (authentication && !user) {
                navigate("/login")
            } else if (!authentication && user) {
                navigate("/") // Redirect logged in users away from login/signup
            }
            setLoader(false)
        }
    }, [user, navigate, authentication, loading])

    return loader ? (
        <LoadingSpinner />
    ) : (
        <div className="min-h-screen bg-gray-50/50">
            {authentication && <TopBar />}
            {children}
        </div>
    )
}
