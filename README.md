# Pregmed - Healthcare Application for Pregnant Women

A comprehensive MERN stack application designed to provide healthcare guidance and support to pregnant women, especially in rural areas.

## Features

### 1. **Personalized Healthcare Guidance**
- Week-by-week pregnancy guidance based on current pregnancy stage
- Nutritional recommendations and foods to avoid
- Safe exercises and activities
- Medical precautions and tips
- Expected symptoms and body changes

### 2. **Appointment Scheduling**
- Schedule and manage doctor appointments
- Track appointment history
- Cancel or reschedule appointments
- Receive appointment notifications
- Multiple appointment types (routine, emergency, follow-up)

### 3. **Health Record Management**
- Store and organize health metrics
- Track blood pressure, weight, glucose levels
- Upload and manage medical reports
- View health history over time
- Export health records

### 4. **Community Support**
- Connect with other expectant mothers
- Share experiences and stories
- Ask questions and get advice
- Support groups by pregnancy stage
- Like and comment on posts

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **API Client**: Axios

## Project Structure

```
pregmed/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── context/       # React context
│   │   ├── styles/        # CSS styles
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── server/                # Node.js Backend
    ├── models/            # MongoDB schemas
    ├── routes/            # API routes
    ├── controllers/       # Route controllers
    ├── middleware/        # Express middleware
    ├── server.js
    └── package.json
```

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB
- npm or yarn

### Backend Setup

```bash
cd server
npm install
# Create .env file with:
# MONGODB_URI=mongodb://localhost:27017/pregmed
# JWT_SECRET=your_secret_key
# PORT=5000
npm start
```

### Frontend Setup

```bash
cd client
npm install
# Create .env file with:
# REACT_APP_API_URL=http://localhost:5000/api
npm start
```

### Run Both Concurrently

From the root directory:
```bash
npm install
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - Get all users

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Health Records
- `GET /api/health-records` - Get all records
- `POST /api/health-records` - Create record
- `PUT /api/health-records/:id` - Update record
- `DELETE /api/health-records/:id` - Delete record

### Community
- `GET /api/community` - Get all posts
- `POST /api/community` - Create post
- `POST /api/community/:id/like` - Like/unlike post
- `POST /api/community/:id/comment` - Add comment

### Guidance
- `GET /api/guidance/current` - Get guidance for week
- `GET /api/guidance` - Get all guidance
- `POST /api/guidance` - Create/update guidance

## Database Models

### User
- Personal information
- Due date
- Emergency contact
- Medical history
- Role (patient/provider/admin)

### Appointment
- Appointment date/time
- Reason and description
- Status (scheduled/completed/cancelled)
- Provider reference

### Health Record
- Record type (blood pressure, weight, glucose, etc.)
- Value and unit
- Date recorded
- Medical notes
- Provider reference

### Community Post
- Title and content
- Category (experience, question, advice, announcement)
- Likes and comments
- Author information

### Guidance
- Week of pregnancy
- Symptoms
- Recommended activities
- Nutrition guidelines
- Safe exercises
- Precautions

## Features Implementation

### 1. Authentication
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes
- Token stored in localStorage

### 2. User Profiles
- Store pregnancy-related information
- Track due date and current week
- Emergency contact details
- Medical history

### 3. Health Tracking
- Multiple record types
- Time-series health data
- Provider annotations
- Attachment support

### 4. Appointment Management
- Schedule and manage appointments
- Status tracking
- Appointment types
- Notification system

### 5. Community Features
- Create discussion posts
- Like and comment functionality
- Categorized discussions
- User-generated support

### 6. Personalized Guidance
- Week-specific recommendations
- Nutritional guidance
- Exercise recommendations
- Safety precautions

## Security Features

- Password hashing with bcrypt
- JWT authentication
- Protected API routes
- Input validation
- CORS enabled

## Future Enhancements

- Video consultation with healthcare providers
- Medication reminders
- Fetal development tracking with images
- Dietary tracking and meal plans
- Mental health support resources
- Push notifications
- Mobile app version
- Multilingual support
- Offline mode

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Support

For support, email support@pregmed.com or create an issue in the GitHub repository.
