// src/components/CampaignHistory.jsx
import React, { useState, useEffect } from 'react';
import { campaignApi } from '../services/api.js'; // Import campaign API service

/**
 * CampaignHistory Component
 * Displays a list of past campaigns with their delivery statistics.
 */
const CampaignHistory = () => {
  // State to store the list of campaigns
  const [campaigns, setCampaigns] = useState([]);
  // State for loading indicator
  const [loading, setLoading] = useState(true);
  // State for error messages
  const [error, setError] = useState(null);

  // Effect to fetch campaigns when the component mounts
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await campaignApi.getCampaigns();
        // Sort campaigns by creation date, with the most recent at the top
        console.log("in campaugn history ",res.data)
        const sortedCampaigns = res.data.campaigns.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setCampaigns(sortedCampaigns);
      } catch (err) {
        setError('Failed to fetch campaigns. Please try again.');
        console.error('Error fetching campaigns:', err);
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };
    fetchCampaigns();
  }, []); // Empty dependency array ensures this runs once on mount

  // Display loading message while data is being fetched
  if (loading) {
    return (
      <p className="text-center text-gray-600 text-lg mt-8">Loading campaign history...</p>
    );
  }

  // Display error message if fetching fails
  if (error) {
    return (
      <p className="text-center text-red-500 text-lg mt-8">{error}</p>
    );
  }

  // Display message if no campaigns are found
  if (campaigns.length === 0) {
    return (
      <p className="text-center text-gray-600 text-lg mt-8">No campaigns found. Create one to see history!</p>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl max-w-3xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Campaign History</h2>
      <div className="space-y-4">
        {campaigns.map((campaign) => (
          <div key={campaign._id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <h3 className="text-xl font-semibold text-indigo-700 mb-2">{campaign.name}</h3>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Segment:</span> {campaign.segmentId?.name || 'N/A'}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Status:</span> <span className={`font-semibold ${
                campaign.status === 'Completed' ? 'text-green-700' :
                campaign.status === 'InProgress' ? 'text-blue-700' :
                'text-yellow-700'
              }`}>{campaign.status}</span>
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 mt-3">
              <p><span className="font-medium">Audience Size:</span> {campaign.deliveryStats.audienceSize}</p>
              <p><span className="font-medium">Messages Sent:</span> {campaign.deliveryStats.sent}</p>
              <p><span className="font-medium">Messages Failed:</span> {campaign.deliveryStats.failed}</p>
              <p><span className="font-medium">Created On:</span> {new Date(campaign.createdAt).toLocaleDateString()}</p>
            </div>
            {campaign.completedAt && (
                <p className="text-sm text-gray-600 mt-2">
                    <span className="font-medium">Completed On:</span> {new Date(campaign.completedAt).toLocaleDateString()}
                </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignHistory;
