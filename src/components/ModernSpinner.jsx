import React from 'react';

const ModernSpinner = () => {
    return (
        <div className="flex items-center justify-center">
            <div className="relative">
                <div className="w-16 h-16 rounded-full absolute border-4 border-solid border-indigo-200"></div>
                <div className="w-16 h-16 rounded-full animate-spin absolute border-4 border-solid border-indigo-600 border-t-transparent"></div>
            </div>
        </div>
    );
};

export default ModernSpinner;