const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Assignment = require('./models/Assignment');
const User = require('./models/User');

// Load env vars
dotenv.config();

// Connect to database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await Assignment.deleteMany();
    await User.deleteMany();

    // Create sample users
    const users = await User.insertMany([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: password123
        role: 'provider',
        bio: 'Experienced project manager with 5+ years in tech',
        skills: ['Project Management', 'Agile', 'Scrum'],
        rating: 4.8,
        wallet: {
          balance: 2450.50,
          earned: 8950.50,
          pending: 780.00,
          withdrawn: 6500.00
        }
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role: 'provider',
        bio: 'Full-stack developer specializing in React and Node.js',
        skills: ['React', 'Node.js', 'MongoDB'],
        rating: 4.9,
        wallet: {
          balance: 1200.00,
          earned: 3200.00,
          pending: 200.00,
          withdrawn: 1800.00
        }
      },
      {
        name: 'Alex Johnson',
        email: 'alex@example.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role: 'worker',
        bio: 'UI/UX designer with a passion for creating beautiful interfaces',
        skills: ['Figma', 'Adobe XD', 'Sketch'],
        rating: 4.7,
        wallet: {
          balance: 850.00,
          earned: 2150.00,
          pending: 150.00,
          withdrawn: 1150.00
        }
      }
    ]);

    // Create sample assignments
    const assignments = await Assignment.insertMany([
      {
        title: 'Machine Learning Model Development',
        description: 'Develop a machine learning model for predicting customer churn using Python and scikit-learn. The model should achieve at least 85% accuracy.',
        subject: 'AI/ML',
        difficulty: 'Hard',
        budget: 500,
        deadline: new Date('2026-04-15'),
        provider: users[0]._id,
        status: 'Open',
        applications: []
      },
      {
        title: 'WordPress Blog Setup',
        description: 'Set up a complete WordPress blog with custom theme, essential plugins, and SEO optimization. Include contact forms and social media integration.',
        subject: 'Web Development',
        difficulty: 'Easy',
        budget: 150,
        deadline: new Date('2026-03-25'),
        provider: users[1]._id,
        status: 'Open',
        applications: []
      },
      {
        title: 'Mobile App UI Design',
        description: 'Design a modern, intuitive mobile app interface for a fitness tracking application. Include wireframes, mockups, and design system.',
        subject: 'Design',
        difficulty: 'Medium',
        budget: 300,
        deadline: new Date('2026-04-10'),
        provider: users[0]._id,
        status: 'Open',
        applications: []
      },
      {
        title: 'Content Writing - 20 Blog Posts',
        description: 'Write 20 high-quality blog posts (800-1200 words each) on digital marketing topics. Posts should be SEO-optimized and engaging.',
        subject: 'Writing',
        difficulty: 'Easy',
        budget: 400,
        deadline: new Date('2026-05-01'),
        provider: users[1]._id,
        status: 'Open',
        applications: []
      },
      {
        title: 'Data Analysis Report',
        description: 'Analyze sales data from the past year and create a comprehensive report with insights, trends, and recommendations using Python and Tableau.',
        subject: 'Data Science',
        difficulty: 'Medium',
        budget: 250,
        deadline: new Date('2026-04-05'),
        provider: users[0]._id,
        status: 'Open',
        applications: []
      },
      {
        title: 'E-commerce Platform Development',
        description: 'Build a full-stack e-commerce platform with React frontend, Node.js backend, MongoDB database, and Stripe payment integration.',
        subject: 'Web Development',
        difficulty: 'Hard',
        budget: 800,
        deadline: new Date('2026-06-01'),
        provider: users[1]._id,
        status: 'Open',
        applications: []
      }
    ]);

    console.log('Data seeded successfully!');
    console.log(`Created ${users.length} users and ${assignments.length} assignments`);
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

const runSeeder = async () => {
  await connectDB();
  await seedData();
};

runSeeder();