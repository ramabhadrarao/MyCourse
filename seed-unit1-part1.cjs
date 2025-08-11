const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Import models
const User = require('./server/models/User');
const Course = require('./server/models/Course');
const Topic = require('./server/models/Topic');
const Content = require('./server/models/Content');

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mycourse');
    console.log('MongoDB Connected for seeding...');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

// Seeder for Part 1: JavaScript Basics
const seedPart1 = async () => {
  try {
    await connectDB();

    // Create or find instructor
    let instructor = await User.findOne({ email: 'maddu.ramabhadrarao@gmail.com' });
    if (!instructor) {
      instructor = await User.create({
        name: 'Maddu Rama bhadra Rao',
        email: 'maddu.ramabhadrarao@gmail.com',
        password: 'nihita1981',
        role: 'instructor'
      });
      console.log('Instructor created:', instructor.email);
    } else {
      console.log('Instructor found:', instructor.email);
    }

    // Create some students if they don't exist
    const studentEmails = ['student1@test.com', 'student2@test.com', 'student3@test.com'];
    const students = [];
    
    for (const email of studentEmails) {
      let student = await User.findOne({ email });
      if (!student) {
        student = await User.create({
          name: email.split('@')[0],
          email: email,
          password: 'Student@123',
          role: 'student'
        });
      }
      students.push(student);
    }

    // Create or find the course
    let course = await Course.findOne({ title: 'FULL STACK DEVELOPMENT' });
    if (!course) {
      course = await Course.create({
        title: 'FULL STACK DEVELOPMENT',
        description: 'Comprehensive course covering JavaScript fundamentals, Bootstrap, ReactJS, and NoSQL databases. Perfect for beginners with no prior programming knowledge.',
        price: 149.99,
        category: 'Programming',
        level: 'Beginner',
        published: true,
        instructor: instructor._id,
        students: students.map(s => s._id),
        rating: 4.9,
        numReviews: 156
      });
      console.log('Course created:', course.title);
      
      // Update instructor's created courses
      instructor.createdCourses.push(course._id);
      await instructor.save();
      
      // Update students' enrolled courses
      for (const student of students) {
        student.enrolledCourses.push(course._id);
        await student.save();
      }
    } else {
      console.log('Course found:', course.title);
    }

    // PART 1 TOPICS: Introduction, Statements, Comments, Variables
    const part1Topics = [
      {
        title: 'Unit-I: Introduction to JavaScript & Basic Instructions',
        order: 1,
        contents: [
          {
            title: 'Welcome to JavaScript Programming',
            type: 'text',
            order: 1,
            data: {
              text: `<h2>Welcome to JavaScript Programming</h2>
              <p><strong>What is JavaScript?</strong></p>
              <p>JavaScript is the programming language of the web. It's what makes websites interactive and dynamic. Think of it as the "brain" of a website - while HTML is the structure (skeleton) and CSS is the appearance (skin), JavaScript is what makes things happen!</p>
              
              <h3>Why Learn JavaScript?</h3>
              <ul>
                <li><strong>It's everywhere:</strong> Every website uses JavaScript</li>
                <li><strong>It's beginner-friendly:</strong> Easy to start, no complex setup needed</li>
                <li><strong>It's powerful:</strong> Can build websites, mobile apps, desktop apps, and even server applications</li>
                <li><strong>Great career opportunities:</strong> High demand for JavaScript developers</li>
              </ul>
              
              <h3>What You'll Learn in This Unit</h3>
              <ol>
                <li>Basic JavaScript syntax and instructions</li>
                <li>How to use statements and comments</li>
                <li>Working with variables and data types</li>
                <li>Understanding arrays and strings</li>
                <li>Creating and using functions</li>
                <li>Working with methods and objects</li>
                <li>Making decisions with conditional statements</li>
                <li>Repeating tasks with loops</li>
              </ol>
              
              <h3>Your First JavaScript Code</h3>
              <p>Let's start with the traditional "Hello, World!" program. Don't worry if you don't understand everything yet - we'll explain each part in detail.</p>
              
              <pre><code>console.log("Hello, World!");
console.log("Welcome to JavaScript!");</code></pre>
              
              <p>This code displays messages in the browser's console. It's like saying "print this message for me to see".</p>
              
              <h3>How to Run JavaScript Code</h3>
              <p>You have several options:</p>
              <ol>
                <li><strong>Browser Console:</strong> Press F12 in your browser, go to Console tab, and type JavaScript directly</li>
                <li><strong>HTML File:</strong> Create an HTML file and add JavaScript inside &lt;script&gt; tags</li>
                <li><strong>Online Editors:</strong> Use CodePen, JSFiddle, or Replit for quick testing</li>
              </ol>
              
              <p class="bg-blue-100 p-4 rounded"><strong>💡 Tip:</strong> Start with the browser console - it's the quickest way to experiment with JavaScript!</p>`
            }
          },
          {
            title: 'Introduction Video - Getting Started with JavaScript',
            type: 'video',
            order: 2,
            data: {
              video: {
                url: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
                duration: 2400
              }
            }
          },
          {
            title: 'Your First JavaScript Program - Hands-On',
            type: 'code',
            order: 3,
            data: {
              language: 'javascript',
              code: `// This is your first JavaScript program!
// Lines starting with // are comments - they help explain the code

// 1. Displaying messages
console.log("Hello, World!");
console.log("I'm learning JavaScript!");

// 2. Simple calculations
console.log(5 + 3);  // Addition: outputs 8
console.log(10 - 4); // Subtraction: outputs 6
console.log(3 * 4);  // Multiplication: outputs 12
console.log(20 / 5); // Division: outputs 4

// 3. Working with text (strings)
console.log("Hello" + " " + "World"); // Joining text

// 4. Creating an alert (popup message)
alert("Welcome to JavaScript!");

// Try it yourself:
// 1. Change the messages in console.log
// 2. Try different math operations
// 3. Create your own alert message`
            }
          }
        ]
      },
      {
        title: 'Statements and Comments',
        order: 2,
        contents: [
          {
            title: 'Understanding Statements and Comments',
            type: 'text',
            order: 1,
            data: {
              text: `<h2>JavaScript Statements and Comments</h2>
              
              <h3>What are Statements?</h3>
              <p>A statement is a single instruction that tells JavaScript to do something. Think of it like a sentence in English - it expresses a complete thought or action.</p>
              
              <p><strong>Key Points about Statements:</strong></p>
              <ul>
                <li>Each statement typically ends with a semicolon (;)</li>
                <li>JavaScript executes statements one by one, from top to bottom</li>
                <li>Statements can span multiple lines</li>
                <li>Multiple statements can be on one line (but it's not recommended)</li>
              </ul>
              
              <h3>Types of Statements</h3>
              <ol>
                <li><strong>Expression Statements:</strong> Perform calculations or assignments
                  <pre><code>x = 5 + 3;
console.log("Hello");</code></pre>
                </li>
                
                <li><strong>Declaration Statements:</strong> Create variables or functions
                  <pre><code>let age = 25;
const name = "John";</code></pre>
                </li>
                
                <li><strong>Control Flow Statements:</strong> Control which code runs
                  <pre><code>if (age > 18) {
  console.log("Adult");
}</code></pre>
                </li>
              </ol>
              
              <h3>What are Comments?</h3>
              <p>Comments are notes in your code that JavaScript ignores. They're like sticky notes for programmers!</p>
              
              <h4>Why Use Comments?</h4>
              <ul>
                <li>Explain what your code does</li>
                <li>Leave notes for yourself or other developers</li>
                <li>Temporarily disable code without deleting it</li>
                <li>Document complex logic</li>
              </ul>
              
              <h4>Types of Comments</h4>
              <ol>
                <li><strong>Single-line Comments:</strong> Use // for short notes
                  <pre><code>// This is a single-line comment
let x = 5; // You can also put comments at the end of a line</code></pre>
                </li>
                
                <li><strong>Multi-line Comments:</strong> Use /* */ for longer explanations
                  <pre><code>/* This is a multi-line comment
   It can span several lines
   Great for detailed explanations */
let y = 10;</code></pre>
                </li>
              </ol>
              
              <h3>Best Practices</h3>
              <ul>
                <li>✅ Write clear, meaningful comments</li>
                <li>✅ Update comments when you change code</li>
                <li>✅ Use comments to explain WHY, not just WHAT</li>
                <li>❌ Don't over-comment obvious code</li>
                <li>❌ Don't leave outdated comments</li>
              </ul>
              
              <div class="bg-yellow-100 p-4 rounded mt-4">
                <strong>⚠️ Important:</strong> Good code is self-explanatory, but good comments make it even better!
              </div>`
            }
          },
          {
            title: 'Statements and Comments - Practice Examples',
            type: 'code',
            order: 2,
            data: {
              language: 'javascript',
              code: `// ===== STATEMENTS EXAMPLES =====

// 1. Simple statements
console.log("This is a statement");     // Output statement
let userName = "Alice";                  // Declaration statement
userName = "Bob";                        // Assignment statement

// 2. Multiple statements on separate lines (recommended)
let x = 5;
let y = 10;
let sum = x + y;
console.log("Sum is: " + sum);

// 3. Multiple statements on one line (not recommended, but possible)
let a = 1; let b = 2; console.log(a + b);

// 4. Statement spanning multiple lines
let longMessage = "This is a very long message " +
                  "that spans multiple lines " +
                  "for better readability";

// ===== COMMENTS EXAMPLES =====

// Single-line comment: Calculate the area of a rectangle
let length = 10;
let width = 5;
let area = length * width; // Area = length × width

/* 
   Multi-line comment:
   This function calculates the price after discount
   Parameters:
   - originalPrice: the price before discount
   - discountPercent: the discount percentage (0-100)
*/
let originalPrice = 100;
let discountPercent = 20;
let finalPrice = originalPrice - (originalPrice * discountPercent / 100);

// TODO: Add validation for negative prices
// FIXME: Handle division by zero
// NOTE: This uses the latest ES6 syntax

// Commenting out code temporarily
// console.log("This won't run");
console.log("This will run");

/* You can also comment out
   multiple lines of code
   like this:
let oldCode = "not needed";
console.log(oldCode);
*/

// ===== GOOD vs BAD COMMENTS =====

// BAD: Obvious comment
let age = 25; // Set age to 25

// GOOD: Explains the why
let age = 25; // Default age for new users in the system

// BAD: Outdated comment
let userStatus = "active"; // Set status to inactive

// GOOD: Accurate and helpful
let userStatus = "active"; // New users start with active status

// Practice Exercise:
// 1. Add meaningful comments to explain what this code does
let temperature = 32;
let celsius = (temperature - 32) * 5/9;
console.log(temperature + "°F = " + celsius.toFixed(2) + "°C");`
            }
          }
        ]
      },
      {
        title: 'Variables - Storing Information',
        order: 3,
        contents: [
          {
            title: 'Understanding Variables in JavaScript',
            type: 'text',
            order: 1,
            data: {
              text: `<h2>Variables - Your Data Containers</h2>
              
              <h3>What are Variables?</h3>
              <p>Variables are like labeled boxes where you store information. Just like you might have a box labeled "toys" or "books", in programming we have variables with names that store data.</p>
              
              <div class="bg-blue-50 p-4 rounded mb-4">
                <strong>Think of it this way:</strong><br>
                - A variable is like a labeled container<br>
                - The label is the variable name<br>
                - The contents are the value stored in it<br>
                - You can change what's inside the container
              </div>
              
              <h3>Creating Variables in JavaScript</h3>
              <p>JavaScript gives us three ways to create variables:</p>
              
              <h4>1. let - The Modern Way (Recommended)</h4>
              <pre><code>let age = 25;
let name = "John";
let isStudent = true;</code></pre>
              <ul>
                <li>Can be changed later</li>
                <li>Block-scoped (we'll learn about this later)</li>
                <li>Cannot be redeclared</li>
              </ul>
              
              <h4>2. const - For Values That Don't Change</h4>
              <pre><code>const PI = 3.14159;
const WEBSITE_NAME = "MyApp";
const MAX_USERS = 100;</code></pre>
              <ul>
                <li>Cannot be changed once set</li>
                <li>Must be initialized when declared</li>
                <li>Use for values that should remain constant</li>
              </ul>
              
              <h4>3. var - The Old Way (Avoid)</h4>
              <pre><code>var oldVariable = "I'm old style";
var count = 0;</code></pre>
              <ul>
                <li>Can be changed</li>
                <li>Function-scoped</li>
                <li>Can be redeclared (confusing!)</li>
                <li>Has some quirky behaviors</li>
              </ul>
              
              <h3>Variable Naming Rules</h3>
              <p><strong>Must follow these rules:</strong></p>
              <ol>
                <li>Start with a letter, underscore (_), or dollar sign ($)</li>
                <li>Can contain letters, numbers, underscores, or dollar signs</li>
                <li>Cannot use reserved keywords (like 'let', 'if', 'for')</li>
                <li>Case-sensitive (age and Age are different)</li>
              </ol>
              
              <h4>Good Variable Names:</h4>
              <pre><code>let firstName = "Alice";
let userAge = 30;
let isLoggedIn = false;
let total_amount = 100;
let $price = 29.99;</code></pre>
              
              <h4>Bad Variable Names:</h4>
              <pre><code>let 2fast = "Wrong";      // Cannot start with number
let my-name = "Wrong";    // Cannot use hyphens
let let = "Wrong";        // Cannot use keywords
let user name = "Wrong";  // Cannot have spaces</code></pre>
              
              <h3>Variable Naming Conventions</h3>
              <ul>
                <li><strong>camelCase:</strong> firstName, userAge (recommended for variables)</li>
                <li><strong>PascalCase:</strong> FirstName, UserAge (for classes)</li>
                <li><strong>snake_case:</strong> first_name, user_age (less common in JS)</li>
                <li><strong>UPPER_CASE:</strong> MAX_SIZE, PI (for constants)</li>
              </ul>
              
              <h3>Changing Variable Values</h3>
              <pre><code>let score = 0;    // Initial value
score = 10;       // Changed to 10
score = score + 5; // Now it's 15
score += 3;       // Now it's 18 (shorthand)</code></pre>
              
              <div class="bg-green-100 p-4 rounded mt-4">
                <strong>💡 Best Practice:</strong> Use descriptive names that explain what the variable contains. 
                <code>userEmail</code> is better than <code>e</code> or <code>data</code>.
              </div>`
            }
          },
          {
            title: 'Variables - Practical Examples',
            type: 'code',
            order: 2,
            data: {
              language: 'javascript',
              code: `// ===== CREATING VARIABLES =====

// Using let (can be changed)
let playerScore = 0;
console.log("Initial score:", playerScore);

playerScore = 100;  // Changing the value
console.log("New score:", playerScore);

playerScore = playerScore + 50;  // Adding to current value
console.log("Updated score:", playerScore);

// Using const (cannot be changed)
const GAME_NAME = "Super Adventure";
console.log("Game:", GAME_NAME);

// This would cause an error:
// GAME_NAME = "Different Game";  // Error! Cannot change const

// Must initialize const when declaring
// const PLAYER_NAME;  // Error! Must have a value

// Using var (old way - avoid)
var oldStyle = "This works but use let instead";
console.log(oldStyle);

// ===== VARIABLE NAMING EXAMPLES =====

// Good variable names - descriptive and clear
let userFirstName = "Alice";
let userAge = 25;
let isUserLoggedIn = true;
let accountBalance = 1500.50;
let numberOfItems = 10;

// Constants in UPPER_CASE
const MAX_PASSWORD_LENGTH = 20;
const MIN_AGE = 18;
const API_KEY = "abc123xyz";

// Bad variable names (these won't work)
// let 123abc = "wrong";        // Can't start with number
// let my-var = "wrong";        // Can't use hyphen
// let my var = "wrong";        // Can't have spaces
// let class = "wrong";         // Can't use reserved words

// ===== WORKING WITH VARIABLES =====

// 1. Simple operations
let apples = 5;
let oranges = 3;
let totalFruit = apples + oranges;
console.log("Total fruit:", totalFruit);

// 2. Updating variables
let counter = 0;
counter = counter + 1;  // Add 1
counter += 1;           // Shorthand for adding 1
counter++;              // Even shorter way to add 1
console.log("Counter:", counter);  // Shows 3

// 3. Working with text
let firstName = "John";
let lastName = "Doe";
let fullName = firstName + " " + lastName;
console.log("Full name:", fullName);

// 4. Swapping values
let a = 10;
let b = 20;
console.log("Before swap - a:", a, "b:", b);

let temp = a;  // Store a in temporary variable
a = b;         // Put b's value in a
b = temp;      // Put temp (original a) in b
console.log("After swap - a:", a, "b:", b);

// 5. Multiple variables at once
let x = 1, y = 2, z = 3;
console.log("x:", x, "y:", y, "z:", z);

// ===== VARIABLE SCOPE PREVIEW =====
{
  let blockVariable = "I exist only in this block";
  console.log(blockVariable);  // This works
}
// console.log(blockVariable);  // This would cause an error

// ===== PRACTICE EXERCISE =====
// Create variables for:
// 1. Your name
// 2. Your age
// 3. Whether you're a student (true/false)
// 4. Your favorite number
// 5. Calculate your age in months

let myName = "Your Name Here";
let myAge = 20;
let amIStudent = true;
const FAVORITE_NUMBER = 7;
let ageInMonths = myAge * 12;

console.log("My Profile:");
console.log("Name:", myName);
console.log("Age:", myAge);
console.log("Age in months:", ageInMonths);
console.log("Student?", amIStudent);
console.log("Favorite number:", FAVORITE_NUMBER);`
            }
          }
        ]
      }
    ];

    // Create topics and content for Part 1
    for (const topicData of part1Topics) {
      // Check if topic already exists
      let topic = await Topic.findOne({ 
        title: topicData.title, 
        course: course._id 
      });

      if (!topic) {
        topic = await Topic.create({
          title: topicData.title,
          course: course._id,
          order: topicData.order
        });

        // Add topic to course
        course.topics.push(topic._id);
        
        console.log(`Created topic: ${topic.title}`);
      } else {
        console.log(`Topic exists: ${topic.title}`);
      }

      // Create contents for this topic
      for (const contentData of topicData.contents) {
        // Check if content already exists
        const existingContent = await Content.findOne({
          title: contentData.title,
          topic: topic._id
        });

        if (!existingContent) {
          const content = await Content.create({
            ...contentData,
            topic: topic._id
          });

          // Add content to topic
          topic.contents.push(content._id);
          
          console.log(`  - Added content: ${content.title}`);
        } else {
          console.log(`  - Content exists: ${contentData.title}`);
        }
      }

      await topic.save();
    }

    await course.save();

    console.log('\n=== Part 1 Seeding Completed! ===');
    console.log('Topics covered:');
    console.log('- Introduction to JavaScript');
    console.log('- Statements and Comments');
    console.log('- Variables');
    
    console.log('\nNext: Run seed-unit1-part2.cjs for Data Types, Arrays, and Strings');

  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

// Run the seeder
seedPart1();