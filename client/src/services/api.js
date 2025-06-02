import axios from 'axios';

const API_URL = 'http://localhost:5000'; 

// Create an Axios instance with a base URL and default headers.
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // This tells Axios to send cookies with cross-origin requests.
    // This is crucial for session-based authentication.
    withCredentials: true,
});


// The browser automatically handles sending the session cookie.

// API functions for Customer management
export const customerApi = {
    /**
     * Adds a new customer to the database.
     * @param {object} customerData - The customer data to be added.
     * @returns {Promise} Axios promise.
     */
    addCustomer: (customerData) => api.post('/api/customers', customerData),
    /**
     * Retrieves all customers from the database.
     * @returns {Promise} Axios promise.
     */
    getCustomers: () => api.get('/api/customers'),
};

// API functions for Order management
export const orderApi = {
    /**
     * Adds a new order to the database.
     * @param {object} orderData - The order data to be added.
     * @returns {Promise} Axios promise.
     */
    addOrder: (orderData) => api.post('/api/orders', orderData),
    /**
     * Retrieves all orders from the database.
     * @returns {Promise} Axios promise.
     */
    getOrders: () => api.get('/api/orders'),
};

// API functions for Campaign and Segment management
export const campaignApi = {
    /**
     * Creates a new audience segment.
     * @param {object} segmentData - The segment data (name, rules).
     * @returns {Promise} Axios promise.
     */
    createSegment: (segmentData) => api.post('/api/campaigns/segments', segmentData),
    /**
     * Previews the audience size based on provided rules.
     * @param {array} rules - The rules for audience segmentation.
     * @returns {Promise} Axios promise.
     */
    previewAudience: (rules) => api.post('/api/campaigns/segments/preview', { rules }),
    /**
     * Retrieves all existing segments.
     * @returns {Promise} Axios promise.
     */
    getSegments: () => api.get('/api/campaigns/segments'),
    /**
     * Creates and initiates a new campaign.
     * @param {object} campaignData - The campaign data (name, segmentId, messageTemplate).
     * @returns {Promise} Axios promise.
     */
    createCampaign: (campaignData) => api.post('/api/campaigns', campaignData),
    /**
     * Retrieves all existing campaigns.
     * @returns {Promise} Axios promise.
     */
    getCampaigns: () => api.get('/api/campaigns'),
    /**
     * Requests AI-generated message suggestions based on an objective.
     * @param {string} objective - The objective for message generation.
     * @returns {Promise} Axios promise.
     */
    suggestMessages: (objective) => api.post('/ai/suggest-messages', { objective }),
};

// New API functions for Authentication (session-based)
export const authApi = {
    /**
     * Checks the current authentication status with the backend.
     * This relies on the browser sending the session cookie.
     * @returns {Promise} Axios promise resolving to { isAuthenticated: boolean, user: object }
     */
    checkStatus: () => api.get('/auth/status'),
    /**
     * Logs out the user by invalidating the session on the backend.
     * @returns {Promise} Axios promise.
     */
    logout: () => api.get('/auth/logout'),
};
