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

1. Install dependencies
```
npm install
```

2. Set up MongoDB
   - Create a MongoDB Atlas cluster or use a local MongoDB installation
   - Update the MongoDB URI in `api/config/db.js` if needed

3. Start the server
```
npm run api
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

## Common Issues and Troubleshooting

During the development of this application, several challenges were encountered:

### Authentication Issues
- **401 Unauthorized Errors**: These occurred when the application wasn't properly sending authentication cookies with API requests. The solution was to configure Axios with `withCredentials: true` in the apiService.js file.
- **Session vs Token Authentication**: The application was initially configured for token-based authentication but later switched to session-based auth, requiring updates to the authentication flow.

### Sequelize and MongoDB Integration Challenges
- **Connection Issues**: Problems connecting to MongoDB through Sequelize due to incorrect URI format or missing authentication credentials.
- **Model Definition Conflicts**: Schema validation errors when Sequelize models didn't match the expected MongoDB document structure.
- **Synchronization Problems**: Difficulties with Sequelize's `sync()` method which works differently with MongoDB compared to SQL databases.
- **Query Performance**: Some complex Sequelize queries performed poorly with MongoDB, requiring optimization or direct use of MongoDB queries.

### Component Integration Challenges
- **API Data Format Mismatches**: The Todo and EditTodoForm components expected different data formats than what the API was providing. This required updates to handle both API data (`todo.task`) and local storage data formats.
- **Function Name Mismatches**: There were inconsistencies between function names in the components (e.g., `getAllTodos()`) and the actual API service methods (e.g., `getAll()`).

### React-Specific Issues
- **Missing Key Warnings**: When rendering lists of todos, each item needed a unique "key" prop using either `_id` or `id` properties depending on the data source.
- **Null Property Access**: The "Cannot read properties of null" error occurred when components tried to access properties before data was loaded.

When troubleshooting this application, ensure that:
1. Authentication is properly configured with session cookies
2. API requests include the `withCredentials: true` option
3. Components correctly handle the data structure returned from the API
4. API service function names match what components are calling
5. MongoDB connection string is properly formatted and includes correct credentials
6. Sequelize models are properly defined to work with MongoDB's document structure
