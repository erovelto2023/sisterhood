
import mongoose from 'mongoose';
import User from '../src/models/User';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
}

async function setAdmin() {
    try {
        await mongoose.connect(MONGODB_URI as string);
        console.log('Connected to MongoDB');

        // Find the first user and make them admin
        // In a real scenario, we might want to specify the email or clerkId
        const user = await User.findOne({});

        if (!user) {
            console.log('No users found.');
            return;
        }

        console.log(`Found user: ${user.firstName} ${user.lastName} (${user.email})`);

        user.role = 'admin';
        await user.save();

        console.log(`Successfully updated user ${user.email} to admin.`);

    } catch (error) {
        console.error('Error updating user:', error);
    } finally {
        await mongoose.disconnect();
    }
}

setAdmin();
