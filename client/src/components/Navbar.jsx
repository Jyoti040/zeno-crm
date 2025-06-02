import React from 'react';
import { useAuth } from '../context/AuthContext'

/**
 * Navbar Component
 * Provides navigation links and a logout button for the CRM application.
 * It dynamically shows the logged-in user ID.
 */
const Navbar = ({ setCurrentPage }) => {
  const { userId, logout } = useAuth(); // Get userId and logout function from AuthContext

  return (
    <nav className="bg-white shadow-md p-4 flex flex-col sm:flex-row justify-between items-center">
      {/* Application Title */}
      <div className="text-xl font-bold text-indigo-600 mb-2 sm:mb-0">Mini CRM</div>

      {/* Navigation Links */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 sm:mt-0 justify-center">
        <button
          onClick={() => setCurrentPage('customer-ingestion')}
          className="text-gray-700 hover:text-indigo-600 font-medium px-3 py-1 rounded-md transition-colors duration-200"
        >
          Add Customer
        </button>
        <button
          onClick={() => setCurrentPage('order-ingestion')}
          className="text-gray-700 hover:text-indigo-600 font-medium px-3 py-1 rounded-md transition-colors duration-200"
        >
          Add Order
        </button>
        <button
          onClick={() => setCurrentPage('segment-builder')}
          className="text-gray-700 hover:text-indigo-600 font-medium px-3 py-1 rounded-md transition-colors duration-200"
        >
          Define Segment
        </button>
        <button
          onClick={() => setCurrentPage('campaign-creation')}
          className="text-gray-700 hover:text-indigo-600 font-medium px-3 py-1 rounded-md transition-colors duration-200"
        >
          Create Campaign
        </button>
        <button
          onClick={() => setCurrentPage('campaign-history')}
          className="text-gray-700 hover:text-indigo-600 font-medium px-3 py-1 rounded-md transition-colors duration-200"
        >
          Campaign History
        </button>
      </div>

      {/* User ID and Logout Button */}
      <div className="flex items-center mt-4 sm:mt-0">
        {userId && (
          <span className="text-sm text-gray-500 mr-4 hidden md:block">
            Logged in as: <span className="font-mono text-xs break-all">{userId}</span>
          </span>
        )}
        <button
          onClick={logout} // Call the logout function from context
          className="text-red-600 hover:text-red-800 font-medium px-3 py-1 rounded-md transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
