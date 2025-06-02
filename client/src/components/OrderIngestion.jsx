import React, { useState, useEffect } from 'react';
import { orderApi, customerApi } from '../services/api.js'; // Import API services

/**
 * OrderIngestion Component
 * Provides a form to add new order data, linking to existing customers.
 */
const OrderIngestion = () => {
  const [order, setOrder] = useState({ customerId: '', amount: '', products: [{ name: '', quantity: '', price: '' }] });
  const [message, setMessage] = useState('');
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);

  // Fetch customers on component mount
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await customerApi.getCustomers();
        console.log("customers from backend ",res.data)
        setCustomers(res.data.customers);
      } catch (err) {
        setMessage('Error fetching customers.');
        console.error('Error fetching customers:', err);
      } finally {
        setLoadingCustomers(false);
      }
    };
    fetchCustomers();
  }, []);

  /**
   * Handles changes to the main order form fields (customerId, amount).   */
  const handleChange = (e) => {
    setOrder({ ...order, [e.target.name]: e.target.value });
  };

  /**
   * Handles changes to product-specific input fields.
   */
  const handleProductChange = (index, e) => {
    const newProducts = [...order.products];
    newProducts[index][e.target.name] = e.target.value;
    setOrder({ ...order, products: newProducts });
  };

  /**
   * Adds a new empty product row to the order form.
   */
  const addProduct = () => {
    setOrder({
      ...order,
      products: [...order.products, { name: '', quantity: '', price: '' }],
    });
  };

  /**
   * Removes a product row from the order form.
   */
  const removeProduct = (index) => {
    const newProducts = order.products.filter((_, i) => i !== index);
    setOrder({ ...order, products: newProducts });
  };

  /**
   * Handles the form submission.
   * Sends the order data to the backend API.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Basic validation for products
    const hasEmptyProductFields = order.products.some(
      (p) => !p.name || !p.quantity || !p.price
    );
    if (hasEmptyProductFields) {
      setMessage('Error: All product fields (name, quantity, price) must be filled.');
      return;
    }

    try {
      const res = await orderApi.addOrder(order);
      setMessage(`Order for Customer ID "${res.data.customerId}" added successfully!`);
      // Clear form after submission
      setOrder({ customerId: '', amount: '', products: [{ name: '', quantity: '', price: '' }] });
    } catch (err) {
      setMessage(`Error: ${err.response?.data?.msg || 'Failed to add order'}`);
      console.error('Error adding order:', err);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl max-w-lg mx-auto my-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Add New Order</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer Selection */}
        <div>
          <label htmlFor="customerId" className="block text-sm font-medium text-gray-700">Select Customer</label>
          {loadingCustomers ? (
            <p className="mt-1 text-gray-600">Loading customers...</p>
          ) : (
            <select
              name="customerId"
              id="customerId"
              value={order.customerId}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">-- Select a Customer --</option>
              {customers && customers.map((customer) => (
                <option key={customer._id} value={customer._id}>
                  {customer.name} ({customer.email})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Order Amount */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Total Amount (INR)</label>
          <input
            type="number"
            name="amount"
            id="amount"
            value={order.amount}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Products Section */}
        <div className="border border-gray-200 p-4 rounded-md bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Products in Order</h3>
          {order.products.map((product, index) => (
            <div key={index} className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-3 p-2 border border-gray-100 rounded-md bg-white">
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={(e) => handleProductChange(index, e)}
                placeholder="Product Name"
                required
                className="w-full sm:flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
              />
              <input
                type="number"
                name="quantity"
                value={product.quantity}
                onChange={(e) => handleProductChange(index, e)}
                placeholder="Qty"
                required
                min="1"
                className="w-full sm:w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
              />
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={(e) => handleProductChange(index, e)}
                placeholder="Price"
                required
                min="0"
                step="0.01"
                className="w-full sm:w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
              />
              {order.products.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeProduct(index)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium px-2 py-1 rounded-md"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addProduct}
            className="mt-3 text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            Add Product
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Order
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

export default OrderIngestion;
