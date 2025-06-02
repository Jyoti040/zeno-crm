import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import Navbar from './components/Navbar.jsx'; 
import GoogleAuthButton from './components/Auth.jsx';
import CustomerIngestion from './components/CustomerIngestion.jsx';
import OrderIngestion from './components/OrderIngestion.jsx';
import SegmentBuilder from './components/SegmentBuilder.jsx';
import CampaignCreation from './components/CampaignCreation.jsx';
import CampaignHistory from './components/CampaignHistory.jsx';

/**
 * Main App Component
 * Manages global routing and authentication state.
 */
function AppContent() {
  // State to manage the currently displayed page
  const [currentPage, setCurrentPage] = useState('home');
  // Use the authentication hook to get user ID and loading state
  const { userId, loading: authLoading, error: authError } = useAuth();

  // If authentication is still loading, display a loading message
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Loading authentication...</p>
      </div>
    );
  }

  // If there's an authentication error, display it
  if (authError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <p className="text-lg text-red-600 mb-4">Authentication Error: {authError}</p>
        <p className="text-md text-gray-700">Please try refreshing the page or logging in again.</p>
        <GoogleAuthButton />
      </div>
    );
  }

  // If no user is logged in, display the Google Auth button
  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Welcome to Mini CRM</h1>
        <p className="text-lg text-gray-700 mb-6">Please sign in to access the platform.</p>
        <GoogleAuthButton /> {/* GoogleAuthButton now handles login via context */}
      </div>
    );
  }

  // Render the appropriate page based on `currentPage` state
  const renderPage = () => {
    switch (currentPage) {
      case 'customer-ingestion':
        return <CustomerIngestion />;
      case 'order-ingestion':
        return <OrderIngestion />;
      case 'segment-builder':
        return <SegmentBuilder />;
      case 'campaign-creation':
        return <CampaignCreation />;
      case 'campaign-history':
        return <CampaignHistory />;
      case 'home':
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50 p-4">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Mini CRM Dashboard</h1>
            <p className="text-lg text-gray-700 mb-6 text-center">Select an option from the navigation to get started.</p>
            {userId && (
                <p className="text-sm text-gray-500">Logged in as User ID: <span className="font-mono text-xs break-all">{userId}</span></p>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar is always visible when logged in */}
      <Navbar setCurrentPage={setCurrentPage} />
      <main className="p-4">
        {renderPage()}
      </main>
    </div>
  );
}

/**
 * Root App Component
 * Wraps the AppContent with AuthProvider to make authentication context available.
 */
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
