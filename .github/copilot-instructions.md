# GitHub Copilot Instructions for Pregmed MERN Application

## Project Overview

Pregmed is a comprehensive healthcare application designed to provide support and guidance to pregnant women, especially in rural areas. The application is built using the MERN stack (MongoDB, Express.js, React.js, Node.js) and provides features including personalized healthcare guidance, appointment scheduling, health record management, and community support.

## Tech Stack

### Frontend
- **Framework**: React 18.2.0
- **Router**: React Router DOM 6.14.1
- **HTTP Client**: Axios 1.6.5
- **Build Tool**: React Scripts 5.0.1
- **Styling**: CSS (styles directory)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 4.18.2
- **Database**: MongoDB with Mongoose 7.3.1
- **Authentication**: JWT (JSON Web Tokens) with jsonwebtoken 9.0.3
- **Password Hashing**: bcryptjs 3.0.3
- **Validation**: express-validator 7.3.1
- **CORS**: cors 2.8.5
- **Environment**: dotenv 16.3.1

### Development Tools
- **Backend Dev Server**: nodemon 3.0.1
- **Concurrent Execution**: concurrently 8.2.0
- **Data Generation**: @faker-js/faker 8.0.2

## Project Structure

```
pregmed-mern/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page-level components
│   │   ├── services/      # API service layer (Axios)
│   │   ├── context/       # React Context API for state
│   │   ├── styles/        # CSS stylesheets
│   │   ├── App.js         # Main App component
│   │   └── index.js       # Entry point
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── server/                # Node.js Backend
│   ├── models/            # Mongoose schemas/models
│   ├── routes/            # Express route definitions
│   ├── controllers/       # Route controller logic
│   ├── middleware/        # Express middleware (auth, validation)
│   ├── server.js          # Server entry point
│   ├── seed.js            # Database seeding script
│   └── package.json       # Backend dependencies
├── package.json           # Root package for concurrent scripts
└── README.md              # Project documentation
```

## Development Setup

### Running the Application

From the root directory:
```bash
npm install              # Install concurrently
npm run dev             # Run both client and server concurrently
```

### Backend Only
```bash
cd server
npm install
npm start               # Production mode
npm run dev            # Development mode with nodemon
npm run seed           # Seed database with test data
```

### Frontend Only
```bash
cd client
npm install
npm start              # Development server on port 3000
npm run build          # Production build
npm test               # Run tests
```

## Environment Variables

### Backend (.env in server/)
```
MONGODB_URI=mongodb://localhost:27017/pregmed
JWT_SECRET=your_secret_key
PORT=5000
```

### Frontend (.env in client/)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Database Models

### User Model
- Personal information (name, email, password)
- Pregnancy details (due date, current week)
- Emergency contact information
- Medical history
- Role (patient/provider/admin)

### Appointment Model
- Date and time
- Reason and description
- Status (scheduled/completed/cancelled)
- Type (routine/emergency/follow-up)
- Provider reference

### Health Record Model
- Record type (blood pressure, weight, glucose, etc.)
- Value and unit of measurement
- Date recorded
- Medical notes
- Provider reference

### Community Post Model
- Title and content
- Category (experience/question/advice/announcement)
- Likes array
- Comments array with author information
- Author reference

### Guidance Model
- Week of pregnancy
- Expected symptoms
- Recommended activities
- Nutrition guidelines
- Safe exercises
- Medical precautions

## API Structure

### Authentication Routes (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user and receive JWT token

### User Routes (`/api/users`)
- `GET /profile` - Get authenticated user profile (protected)
- `PUT /profile` - Update user profile (protected)
- `GET /` - Get all users (admin only)

### Appointment Routes (`/api/appointments`)
- `GET /` - Get user's appointments (protected)
- `POST /` - Create new appointment (protected)
- `PUT /:id` - Update appointment (protected)
- `DELETE /:id` - Cancel appointment (protected)

### Health Record Routes (`/api/health-records`)
- `GET /` - Get user's health records (protected)
- `POST /` - Create new record (protected)
- `PUT /:id` - Update record (protected)
- `DELETE /:id` - Delete record (protected)

### Community Routes (`/api/community`)
- `GET /` - Get all community posts
- `POST /` - Create new post (protected)
- `POST /:id/like` - Like/unlike post (protected)
- `POST /:id/comment` - Add comment to post (protected)

### Guidance Routes (`/api/guidance`)
- `GET /current` - Get guidance for user's current week (protected)
- `GET /` - Get all guidance entries
- `POST /` - Create/update guidance (admin only)

## Coding Standards and Best Practices

### General Guidelines
- Write clean, readable code with meaningful variable and function names
- Follow the existing code structure and patterns in the repository
- Keep components and functions small and focused on a single responsibility
- Use async/await for asynchronous operations instead of promise chains

### React/Frontend
- Use functional components with hooks
- Implement proper error handling for API calls
- Store authentication tokens in localStorage
- Use React Context for global state management
- Keep components modular and reusable
- Follow component structure: imports, component definition, exports
- Use proper prop-types or TypeScript for type safety where applicable

### Node.js/Backend
- Use async/await with try-catch blocks for error handling
- Implement proper validation using express-validator
- Use middleware for authentication and authorization
- Keep route handlers thin; move business logic to controllers
- Always hash passwords using bcryptjs before storing
- Use JWT for stateless authentication
- Implement proper error responses with status codes

### Database (MongoDB/Mongoose)
- Define clear schemas with proper validation
- Use Mongoose middleware (pre/post hooks) when needed
- Index frequently queried fields
- Use populate() for referencing related documents
- Handle database errors gracefully

### Security
- Never commit sensitive data (API keys, secrets) to the repository
- Use environment variables for configuration
- Validate and sanitize all user inputs
- Implement proper authentication on protected routes
- Use HTTPS in production
- Set appropriate CORS policies

### API Design
- Follow RESTful conventions
- Use appropriate HTTP methods (GET, POST, PUT, DELETE)
- Return consistent response structures
- Include proper status codes
- Provide meaningful error messages
- Use JWT middleware to protect routes that require authentication

### Testing
- Write tests for critical functionality
- Test both success and error cases
- Use React Testing Library for frontend tests
- Mock external dependencies and API calls

## Common Patterns

### Protected Route Middleware (Backend)
```javascript
const auth = require('./middleware/auth');
router.get('/profile', auth, controller.getProfile);
```

### API Service Pattern (Frontend)
```javascript
// services/api.js
const API_URL = process.env.REACT_APP_API_URL;
const token = localStorage.getItem('token');
const config = { headers: { Authorization: `Bearer ${token}` } };
```

### Error Handling
```javascript
// Backend
try {
  // logic
} catch (error) {
  res.status(500).json({ error: error.message });
}

// Frontend
try {
  const response = await axios.get(url);
  // handle success
} catch (error) {
  // handle error
  console.error(error);
}
```

## Testing Strategy

- Frontend tests use React Scripts test runner (Jest)
- Test user interactions and component rendering
- Mock API calls in frontend tests
- Test API endpoints for expected responses
- Validate data models and database operations

## Deployment Considerations

- Build frontend with `npm run build` in client directory
- Set NODE_ENV=production for backend
- Use production-ready MongoDB instance
- Configure proper CORS settings
- Implement rate limiting for API endpoints
- Use HTTPS and secure headers
- Set up proper logging and monitoring

## Contributing Guidelines

1. Follow the existing code style and structure
2. Write clear commit messages
3. Test changes before submitting
4. Update documentation when adding features
5. Keep pull requests focused and minimal
6. Use feature branches for development

## Key Features to Understand

1. **Week-by-Week Guidance**: Dynamically calculates current pregnancy week from due date
2. **JWT Authentication**: Stateless authentication with token expiration
3. **Health Tracking**: Time-series health data with provider annotations
4. **Community Support**: Social features with likes and comments
5. **Appointment Management**: Full CRUD with status tracking

## When Making Changes

- Always maintain backward compatibility
- Update related documentation
- Consider mobile responsiveness for frontend changes
- Ensure proper error handling
- Test with different user roles (patient/provider/admin)
- Validate database migrations if schema changes
- Update API documentation if endpoints change
