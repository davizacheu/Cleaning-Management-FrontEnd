# Cleaning Service Management Platform

## Overview
This application is a management platform for cleaning service companies, connecting service providers with customers. It offers role-based access, order management, and company administration features in a modern React-based web application.

## Technology Stack
- **Frontend Framework**: React 18+ with Vite for fast development and optimized builds
- **Styling**: Custom CSS with responsive design principles
- **State Management**: React Context API and hooks for efficient state handling
- **API Communication**: Custom API communicator module for standardized server interactions
- **Authentication**: Token-based authentication system
- **Deployment**: Optimized for cloud deployment with minimal configuration

## Project Structure
# Project Structure

```plaintext
src/
├── assets/
├── component/
├── context/
├── hook/
├── model/
├── pages/
├── styles/
├── utils/
├── App.css
├── App.jsx
├── index.css
└── main.jsx
```

## Key Features

### Authentication System
- Secure login/logout functionality
- Token-based authentication with local storage persistence
- Error handling for authentication failures

### Role-Based Access Control
- Users can have multiple roles across different companies
- Each role has specific permissions and access levels
- Role selection interface for users with multiple roles

### Order Management
- View and manage cleaning service orders
- Order details including description, creation date, and status
- Company assignment and tracking

### Company Administration
- Create and join companies
- Manage company profiles and service offerings
- User role assignment within companies

## Development Setup

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation
1. Clone the repository
   ```
   git clone https://github.com/your-username/cleaning-service-platform.git
   cd cleaning-service-platform
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

4. Open your browser at `http://localhost:5173`

### Building for Production

The build artifacts will be stored in the `dist/` directory.

## API Integration

The application communicates with a RESTful API with endpoints for:
- Authentication (login, logout)
- User roles and profile management
- Order creation and management
- Company administration

All API requests are handled through the ApiCommunicator module which standardizes request formatting, authentication, and error handling.

## Future Enhancements
- Mobile application integration
- Real-time notifications for new orders and updates
- Advanced reporting and analytics dashboard
- Multi-language support
- Payment processing integration

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.