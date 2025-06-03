// src/components/CustomerIngestion.jsx
import React, { useState } from 'react';
import { customerApi } from '../services/api.js'; // Import the customer API service

/**
 * CustomerIngestion Component
 * Provides a form to add new customer data to the CRM.
 */
const CustomerIngestion = () => {
  // State to hold customer form data
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '', address: '' });
  // State for displaying messages (success/error) to the user
  const [message, setMessage] = useState('');

  /**
   * Handles changes to the form input fields.
   * Updates the `customer` state with the new input value.
   * @param {Object} e - The event object from the input change.
   */
  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  /**
   * Handles the form submission.
   * Sends the customer data to the backend API.
   * @param {Object} e - The event object from the form submission.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setMessage(''); // Clear any previous messages

    try {
      // Call the API to add a new customer
      const res = await customerApi.addCustomer(customer);
      setMessage(`Customer added successfully!`); // Display success message
      // Clear the form fields after successful submission
      setCustomer({ name: '', email: '', phone: '', address: '' });
    } catch (err) {
      // Display error message if API call fails
      setMessage(`Error: ${err.response?.data?.msg || 'Failed to add customer'}`);
      console.error('Error adding customer:', err); // Log the error for debugging
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl max-w-md mx-auto my-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Add New Customer</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={customer.name}
            onChange={handleChange}
            required // Make this field mandatory
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={customer.email}
            onChange={handleChange}
            required // Make this field mandatory
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        {/* Phone Input */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="text"
            name="phone"
            id="phone"
            value={customer.phone}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        {/* Address Input */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            name="address"
            id="address"
            value={customer.address}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Customer
        </button>
      </form>
      {/* Display messages */}
      {message && (
        <p className={`mt-4 text-center text-sm font-medium ${message.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default CustomerIngestion;
