import mongoose from 'mongoose';
import User from './models/User.js';

// Sample user data
const sampleUsers = [
    {
        name: "John Doe",
        email: "john.doe@example.com",
        password: "$2b$10$yourhashedpassword1", // Replace with actual hashed password
        address: "123 Main St, City, Country",
        avatar: {
            public_id: "user_avatar_1",
            secure_url: "https://example.com/avatars/1.jpg"
        }
    },
    {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        password: "$2b$10$yourhashedpassword2", // Replace with actual hashed password
        address: "456 Elm St, City, Country",
        avatar: {
            public_id: "user_avatar_2",
            secure_url: "https://example.com/avatars/2.jpg"
        }
    },
    {
        name: "Bob Johnson",
        email: "bob.johnson@example.com",
        password: "$2b$10$yourhashedpassword3", // Replace with actual hashed password
        address: "789 Oak St, City, Country",
        avatar: {
            public_id: "user_avatar_3",
            secure_url: "https://example.com/avatars/3.jpg"
        }
    }
];

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/your_database_name');
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Insert sample data
const insertSampleData = async () => {
    try {
        // Clear existing users
        await User.deleteMany({});
        console.log('Existing users cleared');

        // Insert new users
        await User.insertMany(sampleUsers);
        console.log('Sample users inserted successfully');
    } catch (error) {
        console.error('Error inserting sample data:', error);
    } finally {
        mongoose.connection.close();
    }
};

// Main function
const main = async () => {
    await connectDB();
    await insertSampleData();
};

// Run the script
main();
