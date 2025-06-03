import React, { useState, useEffect } from 'react';
import { campaignApi } from '../services/api.js'; 

/**
 * CampaignCreation Component
 * Allows users to create new campaigns, select audience segments,
 * define message templates, and get AI-powered message suggestions.
 */
const CampaignCreation = () => {
    const [campaignName, setCampaignName] = useState('');
    const [selectedSegment, setSelectedSegment] = useState('');
    const [messageTemplate, setMessageTemplate] = useState('');
    const [segments, setSegments] = useState([]);
    const [message, setMessage] = useState('');
    const [loadingSegments, setLoadingSegments] = useState(true);


    // Effect to fetch segments when the component mounts
    useEffect(() => {
        const fetchSegments = async () => {
            try {
                const res = await campaignApi.getSegments();
                console.log("segment creation ",res.data)
                setSegments(res.data.segments);
            } catch (err) {
                console.error('Error fetching segments:', err);
                setMessage('Error loading segments.');
            } finally {
                setLoadingSegments(false);
            }
        };
        fetchSegments();
    }, []);

    /**
     * Handles the creation of a new campaign.
     */
    const handleCreateCampaign = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setMessage(''); // Clear previous messages

        // Basic validation
        if (!campaignName.trim() || !selectedSegment || !messageTemplate.trim()) {
            setMessage('Error: Please fill in all campaign details.');
            return;
        }

        try {
            // Call the API to create a new campaign
            const res = await campaignApi.createCampaign({
                name: campaignName,
                segmentId: selectedSegment,
                messageTemplate,
            });
            setMessage(`Campaign initiated successfully!`); // Display success message
            // Reset form fields
            setCampaignName('');
            setSelectedSegment('');
            setMessageTemplate('');
        } catch (err) {
            setMessage(`Error creating campaign: ${err.response?.data?.msg || 'Failed to create campaign'}`);
            console.error('Error creating campaign:', err);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-xl max-w-md mx-auto my-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Create New Campaign</h2>
            <form onSubmit={handleCreateCampaign} className="space-y-4">
                {/* Campaign Name Input */}
                <div>
                    <label htmlFor="campaignName" className="block text-sm font-medium text-gray-700">Campaign Name</label>
                    <input
                        type="text"
                        id="campaignName"
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                    />
                </div>
                {/* Audience Segment Selector */}
                <div>
                    <label htmlFor="segment" className="block text-sm font-medium text-gray-700">Select Audience Segment</label>
                    {loadingSegments ? (
                        <p className="mt-1 text-gray-600">Loading segments...</p>
                    ) : (
                        <select
                            id="segment"
                            value={selectedSegment}
                            onChange={(e) => setSelectedSegment(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                        >
                            <option value="">-- Select a Segment --</option>
                            {segments.map((segment) => (
                                <option key={segment._id} value={segment._id}>
                                    {segment.name} (Audience: {segment.audienceSize})
                                </option>
                            ))}
                        </select>
                    )}
                </div>
                {/* Message Template Input */}
                <div>
                    <label htmlFor="messageTemplate" className="block text-sm font-medium text-gray-700">Message Template</label>
                    <textarea
                        id="messageTemplate"
                        value={messageTemplate}
                        onChange={(e) => setMessageTemplate(e.target.value)}
                        rows="4"
                        placeholder="e.g., Hi {customerName}, here's 10% off on your next order!"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                    ></textarea>
                </div>

                {/* Create Campaign Button */}
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Create Campaign
                </button>
            </form>
            {message && (
                <p className={`mt-4 text-center text-sm font-medium ${message.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default CampaignCreation;
