const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Define schemas directly in the seeder to avoid import issues
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'instructor', 'admin'], default: 'student' },
  enrolledCourses: [{ type: mongoose.Schema.ObjectId, ref: 'Course' }],
  createdCourses: [{ type: mongoose.Schema.ObjectId, ref: 'Course' }],
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, { timestamps: true });

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  thumbnail: { type: String, default: '' },
  instructor: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  students: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  topics: [{ type: mongoose.Schema.ObjectId, ref: 'Topic' }],
  published: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 }
}, { timestamps: true });

const topicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  course: { type: mongoose.Schema.ObjectId, ref: 'Course', required: true },
  order: { type: Number, required: true },
  contents: [{ type: mongoose.Schema.ObjectId, ref: 'Content' }]
}, { timestamps: true });

const contentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['text', 'code', 'video', 'pdf'], required: true },
  data: {
    text: String,
    code: { language: String, code: String },
    video: { url: String, duration: Number },
    pdf: { filename: String, originalName: String, size: Number }
  },
  topic: { type: mongoose.Schema.ObjectId, ref: 'Topic', required: true },
  order: { type: Number, required: true }
}, { timestamps: true });

// Hash password before saving
const bcrypt = require('bcryptjs');
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Create models
const User = mongoose.model('User', userSchema);
const Course = mongoose.model('Course', courseSchema);
const Topic = mongoose.model('Topic', topicSchema);
const Content = mongoose.model('Content', contentSchema);

async function seedDatabase() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mycourse', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Course.deleteMany({});
    await Topic.deleteMany({});
    await Content.deleteMany({});
    console.log('Data cleared');

    // Create admin user
    console.log('Creating users...');
    const adminUser = new User({
      name: 'System Administrator',
      email: 'admin@mycourse.com',
      password: 'Admin@123',
      role: 'admin'
    });
    await adminUser.save();
    console.log('Admin created:', adminUser.email);

    // Create instructors
    const instructor1 = new User({
      name: 'John Doe',
      email: 'john.instructor@mycourse.com',
      password: 'Instructor@123',
      role: 'instructor'
    });
    await instructor1.save();

    const instructor2 = new User({
      name: 'Jane Smith',
      email: 'jane.instructor@mycourse.com',
      password: 'Instructor@123',
      role: 'instructor'
    });
    await instructor2.save();
    console.log('Instructors created');

    // Create students
    const student1 = new User({
      name: 'Alice Johnson',
      email: 'alice.student@mycourse.com',
      password: 'Student@123',
      role: 'student'
    });
    await student1.save();

    const student2 = new User({
      name: 'Bob Williams',
      email: 'bob.student@mycourse.com',
      password: 'Student@123',
      role: 'student'
    });
    await student2.save();
    console.log('Students created');

    // Create sample courses
    console.log('Creating courses...');
    const coursesData = [
      {
        title: 'Complete JavaScript Mastery',
        description: 'Master JavaScript from basics to advanced concepts including ES6+, async programming, and modern frameworks',
        price: 89.99,
        category: 'Programming',
        level: 'Beginner',
        published: true,
        instructor: instructor1._id,
        students: [student1._id, student2._id],
        rating: 4.7,
        numReviews: 42
      },
      {
        title: 'React & Redux Bootcamp',
        description: 'Build modern web applications with React, Redux, and advanced state management patterns',
        price: 94.99,
        category: 'Programming',
        level: 'Intermediate',
        published: true,
        instructor: instructor2._id,
        students: [student1._id, student2._id],
        rating: 4.8,
        numReviews: 38
      },
      {
        title: 'UI/UX Design Fundamentals',
        description: 'Learn the principles of user interface and user experience design with practical projects',
        price: 79.99,
        category: 'Design',
        level: 'Beginner',
        published: true,
        instructor: instructor1._id,
        students: [student1._id],
        rating: 4.6,
        numReviews: 27
      }
    ];

    for (const courseData of coursesData) {
      const course = new Course(courseData);
      await course.save();
      
      // Update instructor's created courses
      await User.findByIdAndUpdate(
        courseData.instructor,
        { $push: { createdCourses: course._id } }
      );
      
      // Update students' enrolled courses
      for (const studentId of courseData.students) {
        await User.findByIdAndUpdate(
          studentId,
          { $push: { enrolledCourses: course._id } }
        );
      }
      
      console.log(`Course created: ${course.title}`);
      
      // Create topics for the course
      const topicsData = [
        { title: 'Introduction & Setup', order: 1 },
        { title: 'Core Concepts', order: 2 },
        { title: 'Advanced Topics', order: 3 },
        { title: 'Real-World Projects', order: 4 }
      ];
      
      for (const topicData of topicsData) {
        const topic = new Topic({
          ...topicData,
          course: course._id
        });
        await topic.save();
        
        // Update course with topic
        await Course.findByIdAndUpdate(
          course._id,
          { $push: { topics: topic._id } }
        );
        
        // Create sample content for each topic
        const contents = [
          {
            title: `${topicData.title} - Video Lesson`,
            type: 'video',
            data: {
              video: {
                url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                duration: 600
              }
            },
            topic: topic._id,
            order: 1
          },
          {
            title: `${topicData.title} - Reading Material`,
            type: 'text',
            data: {
              text: `<h2>Welcome to ${topicData.title}</h2>
                     <p>This section covers important concepts that you need to understand.</p>
                     <ul>
                       <li>Key Point 1: Understanding the basics</li>
                       <li>Key Point 2: Practical applications</li>
                       <li>Key Point 3: Best practices</li>
                     </ul>
                     <p>Make sure to complete all exercises before moving to the next section.</p>`
            },
            topic: topic._id,
            order: 2
          }
        ];
        
        for (const contentData of contents) {
          const content = new Content(contentData);
          await content.save();
          
          // Update topic with content
          await Topic.findByIdAndUpdate(
            topic._id,
            { $push: { contents: content._id } }
          );
        }
      }
    }

    console.log('\n=== Seeding completed successfully! ===');
    console.log('\nLogin Credentials:');
    console.log('\nAdmin:');
    console.log('Email: admin@mycourse.com');
    console.log('Password: Admin@123');
    console.log('\nInstructors:');
    console.log('Email: john.instructor@mycourse.com');
    console.log('Email: jane.instructor@mycourse.com');
    console.log('Password: Instructor@123');
    console.log('\nStudents:');
    console.log('Email: alice.student@mycourse.com');
    console.log('Email: bob.student@mycourse.com');
    console.log('Password: Student@123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDatabase connection closed');
    process.exit(0);
  }
}

// Run the seeder
seedDatabase();