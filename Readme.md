# JWT Authentication API

A secure REST API implementation using JSON Web Tokens (JWT) for authentication.

## Architecture

This project consists of two separate server applications:

### Authentication Server
Handles all authentication-related operations:
- User registration
- User login
- User logout
- Refresh token management
- Health check endpoint

### Application Server
Contains the main application logic and protected routes:
- Requires valid access tokens from the Auth Server
- Protected routes can only be accessed with valid JWT tokens
- Communicates with Auth Server for token validation

The separation of authentication and application logic provides better security and scalability. The Auth Server acts as a centralized authentication service while the Application Server focuses on business logic implementation.


## Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- MongoDB (v4.0.0 or higher)

## Setup Steps

1. Clone the Project

git clone [repository-url]
cd [project-directory]

2. Install Dependencies

npm install

3. Configure Environment Variables

Navigate to the config folder
Create a new file named .env
Use the sample.env file as a reference
Add your environment-specific values to the .env file
Add other required variables as specified in sample.env

4. Start the Servers

For the main application server:
npm start

For the authentication server:
npm run startAuth

### Verification

Main server should be running on the port specified in your .env file (default: 5001)
Authentication server should be running on the AUTH_SERVER_PORT (default: 4000)

### Troubleshooting

If you encounter any issues with dependencies, try running npm install again
Ensure all required environment variables are properly set in the .env file
Check console outputs for any error messages

