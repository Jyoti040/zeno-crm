import axios from 'axios';

const API_URL = 'http://localhost:5000'; 
const API_URL_DEPLOYED =''

// Create an Axios instance with a base URL and default headers.
const api = axios.create({
    baseURL: API_URL_DEPLOYED || API_URL,
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
     */
    addCustomer: (customerData) => api.post('/api/customers', customerData),
    /**
     * Retrieves all customers from the database.
     */
    getCustomers: () => api.get('/api/customers'),
};

// API functions for Order management
export const orderApi = {
    /**
     * Adds a new order to the database.
     */
    addOrder: (orderData) => api.post('/api/orders', orderData),
    /**
     * Retrieves all orders from the database.
     */
    getOrders: () => api.get('/api/orders'),
};

// API functions for Campaign and Segment management
export const campaignApi = {
    /**
     * Creates a new audience segment.
     */
    createSegment: (segmentData) => api.post('/api/campaigns/segments', segmentData),
    /**
     * Previews the audience size based on provided rules.
     */
    previewAudience: (rules) => api.post('/api/campaigns/segments/preview', { rules }),
    /**
     * Retrieves all existing segments.
     */
    getSegments: () => api.get('/api/campaigns/segments'),
    /**
     * Creates and initiates a new campaign.
     */
    createCampaign: (campaignData) => api.post('/api/campaigns', campaignData),
    /**
     * Retrieves all existing campaigns.
     */
};

// New API functions for Authentication (session-based)
export const authApi = {
    /**
     * Checks the current authentication status with the backend.
     * This relies on the browser sending the session cookie.
     */
    checkStatus: () => api.get('/auth/status'),
    /**
     * Logs out the user by invalidating the session on the backend.
     */
    logout: () => api.get('/auth/logout'),
};
