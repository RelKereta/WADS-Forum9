# Todo Application with MongoDB

A Todo list application with MongoDB integration. This application provides RESTful API endpoints for managing todos and users.

## Features

- User Authentication (Register, Login, Logout)
- CRUD operations for Todo items
- MongoDB integration for data storage
- RESTful API with Express.js

## MongoDB Schema

### Users Collection
```javascript
{
  email: String,
  password: String, // In production, this should be hashed
  displayName: String,
  fullName: String,
  age: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Todos Collection
```javascript
{
  task: String,
  completed: Boolean,
  userId: ObjectId, // Reference to User
  dueDate: Date,
  priority: String, // 'low', 'medium', or 'high'
  createdAt: Date,
  updatedAt: Date
}
```

## Getting Started

### Prerequisites
- Node.js
- MongoDB Atlas account or local MongoDB installation

### Installation

1. Clone the repository
```
git clone <repository-url>
```

2. Install dependencies
```
npm install
```

3. Set up MongoDB
   - Create a MongoDB Atlas cluster or use a local MongoDB installation
   - Update the MongoDB URI in `api/config/db.js` if needed

4. Start the server
```
npm run server
```

5. Start the frontend
```
npm run dev
```

## API Endpoints

### Auth Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user data

### Todo Endpoints
- `GET /api/todos` - Get all todos for the current user
- `GET /api/todos/:id` - Get a specific todo
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

## MongoDB Connection Testing

You can test your MongoDB connection by running:
```
node api/connect-mongodb.js
```

## Seeding the Database

To seed the database with sample data:
```
npm run seed
```

This will create sample users and todos in your MongoDB database.

## License
MIT
