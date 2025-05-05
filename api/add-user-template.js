// Script to add a user template to MongoDB
import { MongoClient } from 'mongodb';

// MongoDB connection URI
const uri = 'mongodb+srv://RelKereta:Sevillen0801@cluster0.tecvskj.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri);

async function addUserTemplate() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB Atlas...');
    await client.connect();
    console.log('Connected to MongoDB Atlas');

    // Select the database and collection
    const database = client.db('todolist');
    const users = database.collection('users');

    // User template to add (based on provided template)
    const userTemplate = {
      email: "user@example.com",
      password: "password123", // Note: In a real app, this should be hashed
      displayName: "John Doe",
      fullName: "John Doe",
      age: 25,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert the user template
    const result = await users.insertOne(userTemplate);
    
    console.log(`User template inserted with ID: ${result.insertedId}`);
    console.log('User template successfully added to the users collection!');
    
    return result;
  } catch (error) {
    console.error('Error adding user template:', error);
  } finally {
    // Close the connection
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the function
addUserTemplate().catch(console.error); 