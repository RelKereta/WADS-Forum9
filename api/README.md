# Todo API with Sequelize ORM and Swagger

This is an implementation of a RESTful API for a todolist application using Sequelize ORM with MongoDB and Swagger documentation.

## Features

- CRUD operations for todos
- MongoDB integration with Sequelize ORM
- API documentation with Swagger
- Data validation using express-validator

## Setup

1. Make sure you have MongoDB installed and running
2. Create a `.env` file in the api directory with the following content:
```
PORT=5001
MONGO_URI=mongodb://localhost:27017/todo_app
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DB=todo_app
MONGO_USER=
MONGO_PASSWORD=
```

## Running the API

From the project root, run:

```bash
# Start the API server
npm run start-api

# Or with nodemon for development (auto-restart on changes)
npm run dev-api
```

## API Endpoints

Once the server is running, you can access:

- API Documentation: http://localhost:5001/api-docs
- API Base URL: http://localhost:5001/api

### Available Endpoints:

- `GET /api/todos?userId=<userId>` - Get all todos for a user
- `GET /api/todos/:id` - Get a single todo by ID
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update an existing todo
- `DELETE /api/todos/:id` - Delete a todo
- `PATCH /api/todos/:id/toggle` - Toggle a todo's completion status

## Technologies Used

- Sequelize ORM
- MongoDB
- Express.js
- Swagger UI
- express-validator

## Integration with Firebase

This API is designed to work alongside the existing Firebase implementation. While Firebase handles authentication and real-time updates, this API provides a more structured data layer using Sequelize ORM.

You can use both Firebase for front-end features and this API for backend operations, or gradually migrate from Firebase to this API solution. 