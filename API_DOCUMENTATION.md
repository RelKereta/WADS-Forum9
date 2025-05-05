# API Documentation

This document describes the RESTful API endpoints available in the Todo application that uses MongoDB.

## Base URL

All API endpoints are relative to:

```
http://localhost:5001/api
```

## Authentication Endpoints

### Register a new user

**Endpoint**: `POST /auth/register`

**Description**: Creates a new user account in MongoDB.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "displayName": "John Doe"
}
```

**Response**:
```json
{
  "user": {
    "_id": "65c7e2d3a12b3e56789f0d1e",
    "email": "user@example.com",
    "displayName": "John Doe",
    "fullName": "John Doe",
    "createdAt": "2023-08-25T12:00:00.000Z",
    "updatedAt": "2023-08-25T12:00:00.000Z"
  }
}
```

### Login

**Endpoint**: `POST /auth/login`

**Description**: Logs in an existing user.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "user": {
    "_id": "65c7e2d3a12b3e56789f0d1e",
    "email": "user@example.com",
    "displayName": "John Doe",
    "fullName": "John Doe",
    "createdAt": "2023-08-25T12:00:00.000Z",
    "updatedAt": "2023-08-25T12:00:00.000Z"
  }
}
```

### Get current user profile

**Endpoint**: `GET /auth/me`

**Description**: Returns the profile of the currently logged in user.

**Authentication**: Session cookie required

**Response**:
```json
{
  "_id": "65c7e2d3a12b3e56789f0d1e",
  "email": "user@example.com",
  "displayName": "John Doe",
  "fullName": "John Doe",
  "age": 25,
  "createdAt": "2023-08-25T12:00:00.000Z",
  "updatedAt": "2023-08-25T12:00:00.000Z"
}
```

### Logout

**Endpoint**: `POST /auth/logout`

**Description**: Logs out the currently authenticated user by destroying the session.

**Authentication**: Session cookie required

**Response**:
```json
{
  "message": "Logged out successfully"
}
```

## Todo Endpoints

### Get all todos for current user

**Endpoint**: `GET /todos`

**Description**: Returns all todos belonging to the authenticated user.

**Authentication**: Session cookie required

**Response**:
```json
[
  {
    "_id": "65c7e2d3a12b3e56789f0d1f",
    "task": "Complete project documentation",
    "completed": false,
    "userId": "65c7e2d3a12b3e56789f0d1e",
    "priority": "high",
    "dueDate": "2023-09-01T00:00:00.000Z",
    "createdAt": "2023-08-25T12:00:00.000Z",
    "updatedAt": "2023-08-25T12:00:00.000Z"
  },
  {
    "_id": "65c7e2d3a12b3e56789f0d20",
    "task": "Buy groceries",
    "completed": true,
    "userId": "65c7e2d3a12b3e56789f0d1e",
    "priority": "medium",
    "dueDate": "2023-08-26T00:00:00.000Z",
    "createdAt": "2023-08-25T12:00:00.000Z",
    "updatedAt": "2023-08-25T12:00:00.000Z"
  }
]
```

### Get a specific todo

**Endpoint**: `GET /todos/:id`

**Description**: Returns a specific todo by ID.

**Authentication**: Session cookie required

**Parameters**:
- `id`: The MongoDB ObjectId of the todo to retrieve

**Response**:
```json
{
  "_id": "65c7e2d3a12b3e56789f0d1f",
  "task": "Complete project documentation",
  "completed": false,
  "userId": "65c7e2d3a12b3e56789f0d1e",
  "priority": "high",
  "dueDate": "2023-09-01T00:00:00.000Z",
  "createdAt": "2023-08-25T12:00:00.000Z",
  "updatedAt": "2023-08-25T12:00:00.000Z"
}
```

### Create a new todo

**Endpoint**: `POST /todos`

**Description**: Creates a new todo for the authenticated user.

**Authentication**: Session cookie required

**Request Body**:
```json
{
  "task": "Learn MongoDB",
  "priority": "high",
  "dueDate": "2023-09-05T00:00:00.000Z"
}
```

**Response**:
```json
{
  "_id": "65c7e2d3a12b3e56789f0d21",
  "task": "Learn MongoDB",
  "completed": false,
  "userId": "65c7e2d3a12b3e56789f0d1e",
  "priority": "high",
  "dueDate": "2023-09-05T00:00:00.000Z",
  "createdAt": "2023-08-25T12:00:00.000Z",
  "updatedAt": "2023-08-25T12:00:00.000Z"
}
```

### Update a todo

**Endpoint**: `PUT /todos/:id`

**Description**: Updates an existing todo.

**Authentication**: Session cookie required

**Parameters**:
- `id`: The MongoDB ObjectId of the todo to update

**Request Body**:
```json
{
  "task": "Learn MongoDB and Mongoose",
  "completed": true,
  "priority": "medium"
}
```

**Response**:
```json
{
  "_id": "65c7e2d3a12b3e56789f0d21",
  "task": "Learn MongoDB and Mongoose",
  "completed": true,
  "userId": "65c7e2d3a12b3e56789f0d1e",
  "priority": "medium",
  "dueDate": "2023-09-05T00:00:00.000Z",
  "createdAt": "2023-08-25T12:00:00.000Z",
  "updatedAt": "2023-08-25T13:00:00.000Z"
}
```

### Delete a todo

**Endpoint**: `DELETE /todos/:id`

**Description**: Deletes a specific todo.

**Authentication**: Session cookie required

**Parameters**:
- `id`: The MongoDB ObjectId of the todo to delete

**Response**:
```json
{
  "message": "Todo deleted successfully",
  "todoId": "65c7e2d3a12b3e56789f0d21"
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "message": "Bad request",
  "errors": [
    {
      "param": "email",
      "msg": "Please include a valid email"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "message": "Not authenticated"
}
```

### 404 Not Found
```json
{
  "message": "Todo not found"
}
```

### 500 Server Error
```json
{
  "message": "Internal server error",
  "error": "Error message details"
}
``` 