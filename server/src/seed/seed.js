import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import env from '../config/env.js';
import User from '../models/User.js';
import Link from '../models/Link.js';
import Click from '../models/Click.js';
import BioProfile from '../models/BioProfile.js';
import logger from '../utils/logger.js';

const seedDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    logger.info('Connected to DB for Seeding...');

    // Clear existing data
    await User.deleteMany();
    await Link.deleteMany();
    await Click.deleteMany();
    await BioProfile.deleteMany();
    
    logger.info('Cleared existing data.');

    // 1. Create a Demo User
    const demoUser = await User.create({
      username: 'demouser',
      email: 'demo@example.com',
      password: 'password123',
      isVerified: true
    });

    // 2. Create Bio Profile
    await BioProfile.create({
      userId: demoUser._id,
      displayName: 'Demo Creator',
      bio: 'Welcome to my seeded bio page!',
      theme: 'Gradient',
      socialLinks: [
        { platform: 'Twitter', url: 'https://twitter.com' },
        { platform: 'GitHub', url: 'https://github.com' }
      ]
    });

    // 3. Create Links
    const link1 = await Link.create({
      userId: demoUser._id,
      destinationUrl: 'https://react.dev',
      shortCode: 'react-docs',
      isVanity: true
    });

    const link2 = await Link.create({
      userId: demoUser._id,
      destinationUrl: 'https://vitejs.dev',
      shortCode: 'viTe23',
      isVanity: false
    });

    // 4. Create Historical Clicks (simulating past 7 days)
    const clicks = [];
    const now = Date.now();
    
    // Helper to generate a random timestamp within the last 7 days
    const getRandomTimestamp = () => new Date(now - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000));
    const referrers = ['Direct', 'https://twitter.com', 'https://google.com'];
    const devices = ['Desktop', 'Mobile', 'Tablet'];

    for (let i = 0; i < 50; i++) {
      clicks.push({
        linkId: link1._id,
        timestamp: getRandomTimestamp(),
        referrer: referrers[Math.floor(Math.random() * referrers.length)],
        deviceType: devices[Math.floor(Math.random() * devices.length)],
        ipHash: 'hashedip' + i
      });
    }

    for (let i = 0; i < 30; i++) {
      clicks.push({
        linkId: link2._id,
        timestamp: getRandomTimestamp(),
        referrer: referrers[Math.floor(Math.random() * referrers.length)],
        deviceType: devices[Math.floor(Math.random() * devices.length)],
        ipHash: 'hashedip' + i
      });
    }

    await Click.insertMany(clicks);

    logger.info('Seeding complete! You can login with: demo@example.com / password123');
    process.exit();
  } catch (err) {
    logger.error('Error during seeding:', err);
    process.exit(1);
  }
};

seedDB();
