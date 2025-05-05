# API Server Guide

A simplified guide to running the MongoDB API server.

## Starting the API Server

1. **Start the API Server**
   ```
   npm run api
   ```

2. **Development Mode (with auto-reload)**
   ```
   npm run api-dev
   ```

3. **Test MongoDB Connection**
   ```
   npm run test-mongodb
   ```

## Server Files

- `api/server.js` - Main Express server setup
- `api/runApi.js` - Simple API server wrapper
- `start-api.js` - Launcher script (recommended)

## Troubleshooting

- **Port Already in Use**: Change the port in `.env` file or close the existing server
- **MongoDB Connection Issues**: Run `npm run test-mongodb` to test connection

## Best Practices

- Use `npm run api` to start the server
- For development with auto-reload, use `npm run api-dev` 