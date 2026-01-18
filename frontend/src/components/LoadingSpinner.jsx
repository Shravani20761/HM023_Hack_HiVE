import React from 'react';

const LoadingSpinner = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="relative">
                <div className="w-16 h-16 rounded-full absolute border-4 border-solid border-gray-200"></div>
                <div className="w-16 h-16 rounded-full animate-spin absolute border-4 border-solid border-login-btn-primary border-t-transparent shadow-md"></div>
            </div>
        </div>
    );
};

export default LoadingSpinner;
