// src/components/CampaignCreation.jsx
import React, { useState, useEffect } from 'react';
import { campaignApi } from '../services/api.js'; // Import campaign API service

/**
 * CampaignCreation Component
 * Allows users to create new campaigns, select audience segments,
 * define message templates, and get AI-powered message suggestions.
 */
const CampaignCreation = () => {
    // State for campaign form data
    const [campaignName, setCampaignName] = useState('');
    const [selectedSegment, setSelectedSegment] = useState('');
    const [messageTemplate, setMessageTemplate] = useState('');
    // State to store available segments fetched from the API
    const [segments, setSegments] = useState([]);
    // State for displaying messages (success/error)
    const [message, setMessage] = useState('');
    // State for AI-generated message suggestions
    const [aiSuggestions, setAiSuggestions] = useState([]);
    // State for the campaign objective used for AI suggestions
    const [objective, setObjective] = useState('');
    // State for loading AI suggestions
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    // State for loading segments
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
     * @param {Object} e - The event object from the form submission.
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
            setMessage(`Campaign "${res.data.name}" initiated successfully!`); // Display success message
            // Reset form fields
            setCampaignName('');
            setSelectedSegment('');
            setMessageTemplate('');
            setAiSuggestions([]); // Clear AI suggestions
            setObjective(''); // Clear objective
        } catch (err) {
            setMessage(`Error creating campaign: ${err.response?.data?.msg || 'Failed to create campaign'}`);
            console.error('Error creating campaign:', err);
        }
    };

    /**
     * Fetches AI-generated message suggestions based on the provided objective.
     */
    const getAISuggestions = async () => {
        setMessage(''); // Clear previous messages
        setAiSuggestions([]); // Clear existing suggestions
        if (!objective.trim()) {
            setMessage('Please enter a campaign objective to get AI suggestions.');
            return;
        }

        setLoadingSuggestions(true); // Set loading state
        try {
            // Call the AI suggestion API
            const res = await campaignApi.suggestMessages(objective);
            setAiSuggestions(res.data.suggestions); // Set the received suggestions
        } catch (err) {
            setMessage(`Error getting AI suggestions: ${err.response?.data?.msg || 'Failed to get suggestions'}`);
            console.error('Error getting AI suggestions:', err);
        } finally {
            setLoadingSuggestions(false); // Clear loading state
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

                {/* AI Integration for Message Suggestions */}
                <div className="border border-purple-200 p-4 rounded-lg bg-purple-50">
                    <h3 className="text-lg font-semibold text-purple-700 mb-3">AI Message Suggestions</h3>
                    <div className="mb-3">
                        <label htmlFor="objective" className="block text-sm font-medium text-gray-700">Campaign Objective (for AI)</label>
                        <input
                            type="text"
                            id="objective"
                            value={objective}
                            onChange={(e) => setObjective(e.target.value)}
                            placeholder="e.g., bring back inactive users"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={getAISuggestions}
                        disabled={loadingSuggestions} // Disable button while loading
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loadingSuggestions ? 'Generating...' : 'Get AI Suggestions'}
                    </button>
                    {aiSuggestions.length > 0 && (
                        <div className="mt-4 space-y-2">
                            <p className="text-sm font-medium text-gray-700">Suggested Messages:</p>
                            {aiSuggestions.map((suggestion, index) => (
                                <div key={index} className="flex items-center p-2 bg-purple-100 rounded-md">
                                    <p className="text-sm text-purple-800 flex-grow">{suggestion}</p>
                                    <button
                                        type="button"
                                        onClick={() => setMessageTemplate(suggestion)}
                                        className="ml-2 text-xs text-purple-600 hover:text-purple-900 font-medium"
                                    >
                                        Use
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
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
