# Xeno Mini CRM Platform

## Overview

This project is a Mini CRM Platform . It enables customer and order data ingestion, audience segmentation with a dynamic rule builder, personalized campaign delivery, and campaign history tracking.

## Features Implemented

* **Data Ingestion APIs:**
    * REST APIs for ingesting customer and order data.
    * Data validation implemented in the API layer.

* **Campaign Creation UI:**
    * Web application for defining audience segments.
    * Dynamic rule builder allowing users to combine conditions with AND/OR logic (e.g., spend > INR 10,000 AND visits < 3 OR inactive for 90 days).
    * Preview of audience size before saving a segment.
    * Campaign history page displaying:
        * List of past campaigns.
        * Delivery statistics (sent, failed, audience size).
        * Most recent campaign at the top.

* **Campaign Delivery & Logging:**
    * Campaign delivery mechanism (e.g., simulated or integrated with a messaging service).
    * Logging of campaign delivery status and statistics.

* **Authentication:**
    * Google OAuth 2.0 integration for user authentication.

## Tech Stack

* **Frontend:** React.js
* **Backend:** Node.js with Express.js
* **Database:** MongoDB
* **Authentication:** Passport.js with passport-google-oauth20
* **HTTP Client:** Axios
* **ORM/ODM:** Mongoose

## Local Setup Instructions

1.  **Clone the repository:**

    ```bash
    git clone <your_repository_url>
    cd zeno-crm
    ```

2.  **Backend Setup:**

    ```bash
    cd server
    npm install
    ```

    * Create a `.env` file in the `server` directory and add the following environment variables:

        ```dotenv
        PORT=5000
        MONGODB_URI=mongodb://localhost:27017/zeno-crm  # Your MongoDB connection string
        GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID>
        GOOGLE_CLIENT_SECRET=<YOUR_GOOGLE_CLIENT_SECRET>
        GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
        SESSION_SECRET=<YOUR_SESSION_SECRET> # Or JWT secret
        ```

    * Start the backend server:

        ```bash
        npm start
        ```

3.  **Frontend Setup:**

    ```bash
    cd ../client
    npm install
    ```

    * Start the frontend development server:

        ```bash
        npm run dev
        ```

4.  **Access the application:**

    * Frontend: `http://localhost:5173` (or the port your frontend server is running on)
    * Backend: `http://localhost:5000`

