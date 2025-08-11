const mongoose = require('mongoose');
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

// Seeder for Part 4: Decisions & Loops
const seedPart4 = async () => {
  try {
    await connectDB();

    // Find the course
    const course = await Course.findOne({ title: 'FULL STACK DEVELOPMENT' });
    if (!course) {
      console.error('Course not found! Please run seed-unit1-part1.cjs first.');
      process.exit(1);
    }

    console.log('Found course:', course.title);

    // PART 4 TOPICS: Decisions & Loops
    const part4Topics = [
      {
        title: 'Decisions - Making Choices in Code',
        order: 9,
        contents: [
          {
            title: 'Understanding Conditional Statements',
            type: 'text',
            order: 1,
            data: {
              text: `<h2>Making Decisions in JavaScript</h2>
              
              <h3>Why Do We Need Decisions?</h3>
              <p>Programs need to make choices based on different conditions. Just like in real life, we need our code to behave differently in different situations.</p>
              
              <div class="bg-blue-50 p-4 rounded mb-4">
                <strong>Real-world example:</strong><br>
                "If it's raining, take an umbrella. Otherwise, wear sunglasses."<br>
                This is exactly how conditional statements work in programming!
              </div>
              
              <h3>The if Statement</h3>
              <p>The most basic decision-making structure:</p>
              <pre><code>if (condition) {
  // Code to run if condition is true
}</code></pre>
              
              <h4>Example:</h4>
              <pre><code>let age = 18;
if (age >= 18) {
  console.log("You can vote!");
}</code></pre>
              
              <h3>The if...else Statement</h3>
              <p>Execute one block if true, another if false:</p>
              <pre><code>if (condition) {
  // Code if true
} else {
  // Code if false
}</code></pre>
              
              <h3>The if...else if...else Chain</h3>
              <p>Check multiple conditions:</p>
              <pre><code>if (condition1) {
  // Code for condition1
} else if (condition2) {
  // Code for condition2
} else {
  // Code if all conditions are false
}</code></pre>
              
              <h3>Comparison Operators</h3>
              <ul>
                <li><code>==</code> - Equal to (loose equality)</li>
                <li><code>===</code> - Strictly equal to (recommended)</li>
                <li><code>!=</code> - Not equal to</li>
                <li><code>!==</code> - Strictly not equal to</li>
                <li><code>&gt;</code> - Greater than</li>
                <li><code>&lt;</code> - Less than</li>
                <li><code>&gt;=</code> - Greater than or equal to</li>
                <li><code>&lt;=</code> - Less than or equal to</li>
              </ul>
              
              <h3>Logical Operators</h3>
              <ul>
                <li><code>&&</code> - AND (both must be true)</li>
                <li><code>||</code> - OR (at least one must be true)</li>
                <li><code>!</code> - NOT (inverts the boolean)</li>
              </ul>
              
              <h3>The Ternary Operator</h3>
              <p>A shorthand for simple if...else statements:</p>
              <pre><code>let result = condition ? valueIfTrue : valueIfFalse;</code></pre>
              
              <h3>Switch Statements</h3>
              <p>When you have many specific values to check:</p>
              <pre><code>switch (expression) {
  case value1:
    // Code for value1
    break;
  case value2:
    // Code for value2
    break;
  default:
    // Code if no match
}</code></pre>
              
              <h3>Truthy and Falsy Values</h3>
              <p><strong>Falsy values:</strong> <code>false</code>, <code>0</code>, <code>""</code>, <code>null</code>, <code>undefined</code>, <code>NaN</code></p>
              <p><strong>Everything else is truthy!</strong></p>
              
              <div class="bg-green-100 p-4 rounded mt-4">
                <strong>💡 Best Practices:</strong>
                <ul>
                  <li>Use <code>===</code> instead of <code>==</code> for comparisons</li>
                  <li>Keep conditions simple and readable</li>
                  <li>Use descriptive variable names in conditions</li>
                  <li>Consider using switch for multiple specific values</li>
                </ul>
              </div>`
            }
          },
          {
            title: 'Conditional Statements - Complete Examples',
            type: 'code',
            order: 2,
            data: {
              language: 'javascript',
              code: `// ===== BASIC IF STATEMENTS =====

// Simple if statement
let temperature = 25;
if (temperature > 30) {
  console.log("It's hot outside!");
}

// This won't print because condition is false
if (temperature > 40) {
  console.log("Extremely hot!");
}

// ===== IF...ELSE STATEMENTS =====

let age = 20;
if (age >= 18) {
  console.log("You are an adult");
} else {
  console.log("You are a minor");
}

// Checking passwords
let password = "secret123";
if (password.length >= 8) {
  console.log("Password is long enough");
} else {
  console.log("Password too short");
}

// ===== IF...ELSE IF...ELSE CHAINS =====

let score = 85;
let grade;

if (score >= 90) {
  grade = "A";
  console.log("Excellent!");
} else if (score >= 80) {
  grade = "B";
  console.log("Good job!");
} else if (score >= 70) {
  grade = "C";
  console.log("Satisfactory");
} else if (score >= 60) {
  grade = "D";
  console.log("Needs improvement");
} else {
  grade = "F";
  console.log("Failed");
}

console.log("Your grade is:", grade);

// ===== COMPARISON OPERATORS =====

console.log("\\n=== Comparisons ===");
console.log("5 == '5':", 5 == '5');     // true (loose equality)
console.log("5 === '5':", 5 === '5');   // false (strict equality)
console.log("5 != '5':", 5 != '5');     // false
console.log("5 !== '5':", 5 !== '5');   // true

console.log("10 > 5:", 10 > 5);         // true
console.log("5 < 3:", 5 < 3);           // false
console.log("5 >= 5:", 5 >= 5);         // true
console.log("3 <= 2:", 3 <= 2);         // false

// ===== LOGICAL OPERATORS =====

console.log("\\n=== Logical Operators ===");

// AND operator (&&) - both must be true
let hasLicense = true;
let isOldEnough = true;
if (hasLicense && isOldEnough) {
  console.log("You can drive!");
}

// OR operator (||) - at least one must be true
let isMember = false;
let hasInvite = true;
if (isMember || hasInvite) {
  console.log("Welcome to the event!");
}

// NOT operator (!) - inverts the value
let isRaining = false;
if (!isRaining) {
  console.log("No need for an umbrella");
}

// Complex conditions
let userAge = 25;
let hasPermission = true;
let isAdmin = false;

if ((userAge >= 18 && hasPermission) || isAdmin) {
  console.log("Access granted");
}

// ===== NESTED IF STATEMENTS =====

let day = "Saturday";
let weather = "sunny";

if (day === "Saturday" || day === "Sunday") {
  console.log("It's the weekend!");
  
  if (weather === "sunny") {
    console.log("Perfect day for outdoor activities!");
  } else if (weather === "rainy") {
    console.log("Good day to stay inside and relax");
  }
} else {
  console.log("It's a weekday - time to work!");
}

// ===== TERNARY OPERATOR =====

console.log("\\n=== Ternary Operator ===");

// Basic ternary
let userPoints = 150;
let status = userPoints > 100 ? "Premium" : "Regular";
console.log("User status:", status);

// Using ternary for assignment
let time = 14;
let greeting = time < 12 ? "Good morning" : "Good afternoon";
console.log(greeting);

// Nested ternary (use sparingly - can be hard to read)
let examScore = 75;
let result = examScore >= 90 ? "A" : 
            examScore >= 80 ? "B" : 
            examScore >= 70 ? "C" : "F";
console.log("Exam result:", result);

// ===== SWITCH STATEMENTS =====

console.log("\\n=== Switch Statement ===");

let dayNumber = 3;
let dayName;

switch (dayNumber) {
  case 1:
    dayName = "Monday";
    break;
  case 2:
    dayName = "Tuesday";
    break;
  case 3:
    dayName = "Wednesday";
    break;
  case 4:
    dayName = "Thursday";
    break;
  case 5:
    dayName = "Friday";
    break;
  case 6:
    dayName = "Saturday";
    break;
  case 7:
    dayName = "Sunday";
    break;
  default:
    dayName = "Invalid day";
}

console.log("Day", dayNumber, "is", dayName);

// Switch with multiple cases
let month = "January";
let season;

switch (month) {
  case "December":
  case "January":
  case "February":
    season = "Winter";
    break;
  case "March":
  case "April":
  case "May":
    season = "Spring";
    break;
  case "June":
  case "July":
  case "August":
    season = "Summer";
    break;
  case "September":
  case "October":
  case "November":
    season = "Fall";
    break;
  default:
    season = "Unknown";
}

console.log(month, "is in", season);

// ===== TRUTHY AND FALSY VALUES =====

console.log("\\n=== Truthy/Falsy ===");

// Falsy values
if (!false) console.log("false is falsy");
if (!0) console.log("0 is falsy");
if (!"") console.log("empty string is falsy");
if (!null) console.log("null is falsy");
if (!undefined) console.log("undefined is falsy");
if (!NaN) console.log("NaN is falsy");

// Truthy values
if (true) console.log("true is truthy");
if (1) console.log("1 is truthy");
if ("hello") console.log("non-empty string is truthy");
if ([]) console.log("empty array is truthy");
if ({}) console.log("empty object is truthy");

// Using truthy/falsy for validation
let userName = "";
if (userName) {
  console.log("Welcome, " + userName);
} else {
  console.log("Please enter your name");
}

// ===== PRACTICAL EXAMPLES =====

// 1. Age-based access control
console.log("\\n=== Age Verification ===");
function checkAccess(age) {
  if (age < 13) {
    return "Sorry, you must be 13 or older";
  } else if (age < 18) {
    return "Parental consent required";
  } else if (age < 21) {
    return "Limited access granted";
  } else {
    return "Full access granted";
  }
}

console.log("Age 10:", checkAccess(10));
console.log("Age 15:", checkAccess(15));
console.log("Age 19:", checkAccess(19));
console.log("Age 25:", checkAccess(25));

// 2. Grade calculator with feedback
console.log("\\n=== Grade Calculator ===");
function getGradeFeedback(score) {
  let grade, feedback;
  
  if (score >= 90) {
    grade = "A";
    feedback = "Outstanding work!";
  } else if (score >= 80) {
    grade = "B";
    feedback = "Great job!";
  } else if (score >= 70) {
    grade = "C";
    feedback = "Good effort!";
  } else if (score >= 60) {
    grade = "D";
    feedback = "You can do better!";
  } else {
    grade = "F";
    feedback = "Please see me for help.";
  }
  
  return { grade, feedback, passed: score >= 60 };
}

let result1 = getGradeFeedback(95);
console.log(\`Score 95: Grade \${result1.grade}, \${result1.feedback}\`);

let result2 = getGradeFeedback(58);
console.log(\`Score 58: Grade \${result2.grade}, \${result2.feedback}\`);

// 3. Shopping discount calculator
console.log("\\n=== Discount Calculator ===");
function calculateDiscount(total, isMember, couponCode) {
  let discount = 0;
  let reason = [];
  
  // Member discount
  if (isMember) {
    discount += 10;
    reason.push("Member discount: 10%");
  }
  
  // Bulk purchase discount
  if (total > 100) {
    discount += 5;
    reason.push("Bulk discount: 5%");
  }
  
  // Coupon discount
  switch(couponCode) {
    case "SAVE20":
      discount += 20;
      reason.push("Coupon SAVE20: 20%");
      break;
    case "WELCOME10":
      discount += 10;
      reason.push("Coupon WELCOME10: 10%");
      break;
  }
  
  // Maximum discount cap
  if (discount > 30) {
    discount = 30;
    reason.push("(Capped at maximum 30%)");
  }
  
  let finalPrice = total - (total * discount / 100);
  
  return {
    originalPrice: total,
    discountPercent: discount,
    finalPrice: finalPrice,
    savings: total - finalPrice,
    reasons: reason
  };
}

let purchase1 = calculateDiscount(150, true, "SAVE20");
console.log("Purchase 1:", purchase1);

let purchase2 = calculateDiscount(50, false, "WELCOME10");
console.log("Purchase 2:", purchase2);`
            }
          }
        ]
      },
      {
        title: 'Loops - Repeating Actions',
        order: 10,
        contents: [
          {
            title: 'Understanding Loops in JavaScript',
            type: 'text',
            order: 1,
            data: {
              text: `<h2>Loops - Repeating Actions Efficiently</h2>
              
              <h3>Why Do We Need Loops?</h3>
              <p>Loops allow us to repeat code multiple times without writing it over and over. They're essential for processing lists, repeating tasks, and creating efficient programs.</p>
              
              <div class="bg-blue-50 p-4 rounded mb-4">
                <strong>Real-world analogy:</strong><br>
                Think of washing dishes:
                <ul>
                  <li>While there are dirty dishes → Keep washing</li>
                  <li>For each dish → Wash, rinse, dry</li>
                  <li>Repeat until all dishes are clean</li>
                </ul>
              </div>
              
              <h3>The for Loop</h3>
              <p>Best when you know how many times to repeat:</p>
              <pre><code>for (initialization; condition; update) {
  // Code to repeat
}</code></pre>
              
              <h4>Example:</h4>
              <pre><code>for (let i = 0; i < 5; i++) {
  console.log("Count:", i);
}</code></pre>
              
              <h3>The while Loop</h3>
              <p>Repeats while a condition is true:</p>
              <pre><code>while (condition) {
  // Code to repeat
  // Make sure to update condition!
}</code></pre>
              
              <h3>The do...while Loop</h3>
              <p>Always runs at least once, then checks condition:</p>
              <pre><code>do {
  // Code to repeat
} while (condition);</code></pre>
              
              <h3>The for...of Loop</h3>
              <p>Easy way to loop through arrays:</p>
              <pre><code>let fruits = ["apple", "banana", "orange"];
for (let fruit of fruits) {
  console.log(fruit);
}</code></pre>
              
              <h3>The for...in Loop</h3>
              <p>Loop through object properties:</p>
              <pre><code>let person = {name: "John", age: 30};
for (let key in person) {
  console.log(key + ": " + person[key]);
}</code></pre>
              
              <h3>Loop Control Statements</h3>
              <ul>
                <li><code>break</code> - Exit the loop immediately</li>
                <li><code>continue</code> - Skip to next iteration</li>
              </ul>
              
              <h3>Nested Loops</h3>
              <p>Loops inside loops - useful for 2D data:</p>
              <pre><code>for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    console.log(i, j);
  }
}</code></pre>
              
              <h3>Common Loop Patterns</h3>
              <ul>
                <li>Counting up: <code>for (let i = 0; i < n; i++)</code></li>
                <li>Counting down: <code>for (let i = n; i > 0; i--)</code></li>
                <li>Skip counting: <code>for (let i = 0; i < n; i += 2)</code></li>
                <li>Array traversal: <code>for (let i = 0; i < arr.length; i++)</code></li>
              </ul>
              
              <div class="bg-yellow-100 p-4 rounded">
                <strong>⚠️ Avoid Infinite Loops!</strong><br>
                Always ensure your loop condition will eventually become false, or use break to exit.
              </div>
              
              <div class="bg-green-100 p-4 rounded mt-4">
                <strong>💡 Best Practices:</strong>
                <ul>
                  <li>Use descriptive variable names (not just i, j, k)</li>
                  <li>Choose the right loop for your task</li>
                  <li>Be careful with loop conditions</li>
                  <li>Consider array methods like map(), filter() for arrays</li>
                </ul>
              </div>`
            }
          },
          {
            title: 'Loops - Comprehensive Examples',
            type: 'code',
            order: 2,
            data: {
              language: 'javascript',
              code: `// ===== FOR LOOP =====

console.log("=== Basic For Loop ===");
// Count from 0 to 4
for (let i = 0; i < 5; i++) {
  console.log("Iteration", i);
}

// Count from 1 to 5
console.log("\\nCounting 1 to 5:");
for (let count = 1; count <= 5; count++) {
  console.log(count);
}

// Count backwards
console.log("\\nCountdown:");
for (let i = 5; i > 0; i--) {
  console.log(i);
}
console.log("Blast off! 🚀");

// Skip counting (by 2s)
console.log("\\nEven numbers 0-10:");
for (let i = 0; i <= 10; i += 2) {
  console.log(i);
}

// ===== LOOPING THROUGH ARRAYS =====

let fruits = ["apple", "banana", "orange", "mango", "grape"];

console.log("\\n=== Array Loops ===");

// Traditional for loop with array
console.log("Using traditional for:");
for (let i = 0; i < fruits.length; i++) {
  console.log(i + ":", fruits[i]);
}

// for...of loop (easier for arrays)
console.log("\\nUsing for...of:");
for (let fruit of fruits) {
  console.log(fruit);
}

// Processing array elements
let numbers = [10, 25, 30, 45, 50];
let sum = 0;

for (let num of numbers) {
  sum += num;
}
console.log("\\nNumbers:", numbers);
console.log("Sum:", sum);
console.log("Average:", sum / numbers.length);

// ===== WHILE LOOP =====

console.log("\\n=== While Loop ===");

// Basic while loop
let counter = 0;
while (counter < 5) {
  console.log("Counter:", counter);
  counter++;
}

// User input simulation
let password = "";
let attempts = 0;
let maxAttempts = 3;

// Simulating password attempts
let passwords = ["wrong", "incorrect", "secret123"];
let currentAttempt = 0;

while (attempts < maxAttempts && password !== "secret123") {
  password = passwords[currentAttempt];
  attempts++;
  currentAttempt++;
  
  if (password === "secret123") {
    console.log("\\nAccess granted!");
  } else {
    console.log(\`Attempt \${attempts}: Wrong password\`);
  }
}

if (password !== "secret123") {
  console.log("Access denied - too many attempts");
}

// ===== DO...WHILE LOOP =====

console.log("\\n=== Do...While Loop ===");

// Always runs at least once
let number = 10;
do {
  console.log("Number:", number);
  number -= 2;
} while (number > 0);

// Menu simulation
let choice;
let menuCount = 0;
do {
  console.log("\\nMenu (simulation):");
  console.log("1. Option 1");
  console.log("2. Option 2");
  console.log("3. Exit");
  
  // Simulating user choices
  choice = menuCount < 2 ? menuCount + 1 : 3;
  menuCount++;
  
  console.log("You chose:", choice);
} while (choice !== 3);

// ===== BREAK AND CONTINUE =====

console.log("\\n=== Break Statement ===");

// Find first number divisible by 7
for (let i = 1; i <= 50; i++) {
  if (i % 7 === 0) {
    console.log("First number divisible by 7:", i);
    break; // Exit loop
  }
}

// Search in array
let names = ["Alice", "Bob", "Charlie", "David"];
let searchName = "Charlie";
let found = false;

for (let i = 0; i < names.length; i++) {
  if (names[i] === searchName) {
    console.log(\`Found \${searchName} at index \${i}\`);
    found = true;
    break;
  }
}

console.log("\\n=== Continue Statement ===");

// Skip even numbers
console.log("Odd numbers 1-10:");
for (let i = 1; i <= 10; i++) {
  if (i % 2 === 0) {
    continue; // Skip to next iteration
  }
  console.log(i);
}

// ===== NESTED LOOPS =====

console.log("\\n=== Nested Loops ===");

// Multiplication table
console.log("Multiplication table (1-5):");
for (let i = 1; i <= 5; i++) {
  let row = "";
  for (let j = 1; j <= 5; j++) {
    row += (i * j).toString().padStart(4, " ");
  }
  console.log(row);
}

// Pattern printing
console.log("\\nTriangle pattern:");
for (let i = 1; i <= 5; i++) {
  let stars = "";
  for (let j = 1; j <= i; j++) {
    stars += "* ";
  }
  console.log(stars);
}

// ===== FOR...IN LOOP (OBJECTS) =====

console.log("\\n=== For...In Loop ===");

let person = {
  name: "John Doe",
  age: 30,
  city: "New York",
  occupation: "Developer"
};

console.log("Person details:");
for (let property in person) {
  console.log(property + ": " + person[property]);
}

// ===== PRACTICAL LOOP EXAMPLES =====

// 1. Finding maximum and minimum
console.log("\\n=== Find Max/Min ===");
let scores = [85, 92, 78, 95, 88, 72, 90];
let max = scores[0];
let min = scores[0];

for (let score of scores) {
  if (score > max) max = score;
  if (score < min) min = score;
}

console.log("Scores:", scores);
console.log("Maximum:", max);
console.log("Minimum:", min);

// 2. Filtering array elements
console.log("\\n=== Filtering ===");
let allNumbers = [12, 5, 8, 21, 15, 3, 18, 7];
let evenNumbers = [];
let oddNumbers = [];

for (let num of allNumbers) {
  if (num % 2 === 0) {
    evenNumbers.push(num);
  } else {
    oddNumbers.push(num);
  }
}

console.log("All numbers:", allNumbers);
console.log("Even numbers:", evenNumbers);
console.log("Odd numbers:", oddNumbers);

// 3. String manipulation
console.log("\\n=== String Processing ===");
let text = "Hello World";
let reversed = "";
let vowelCount = 0;

// Reverse string
for (let i = text.length - 1; i >= 0; i--) {
  reversed += text[i];
}

// Count vowels
for (let char of text.toLowerCase()) {
  if ("aeiou".includes(char)) {
    vowelCount++;
  }
}

console.log("Original:", text);
console.log("Reversed:", reversed);
console.log("Vowel count:", vowelCount);

// 4. Prime number checker
console.log("\\n=== Prime Numbers ===");
function isPrime(n) {
  if (n <= 1) return false;
  
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      return false;
    }
  }
  return true;
}

console.log("Prime numbers between 1 and 20:");
for (let num = 1; num <= 20; num++) {
  if (isPrime(num)) {
    console.log(num);
  }
}

// 5. Shopping cart total
console.log("\\n=== Shopping Cart ===");
let cart = [
  { item: "Book", price: 15.99, quantity: 2 },
  { item: "Pen", price: 2.50, quantity: 5 },
  { item: "Notebook", price: 5.99, quantity: 3 }
];

let total = 0;
console.log("Cart items:");
for (let item of cart) {
  let itemTotal = item.price * item.quantity;
  console.log(\`\${item.item}: $\${item.price} x \${item.quantity} = $\${itemTotal.toFixed(2)}\`);
  total += itemTotal;
}
console.log(\`Total: $\${total.toFixed(2)}\`);

// 6. Password generator
console.log("\\n=== Password Generator ===");
function generatePassword(length) {
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
  let password = "";
  
  for (let i = 0; i < length; i++) {
    let randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }
  
  return password;
}

console.log("Generated passwords:");
for (let i = 0; i < 3; i++) {
  console.log(\`Password \${i + 1}: \${generatePassword(12)}\`);
}

// 7. Fibonacci sequence
console.log("\\n=== Fibonacci Sequence ===");
let n = 10;
let fib = [0, 1];

for (let i = 2; i < n; i++) {
  fib[i] = fib[i-1] + fib[i-2];
}

console.log(\`First \${n} Fibonacci numbers:\`);
console.log(fib.join(", "));

// 8. Array search with multiple criteria
console.log("\\n=== Product Search ===");
let products = [
  { name: "Laptop", price: 999, category: "Electronics" },
  { name: "Book", price: 20, category: "Education" },
  { name: "Phone", price: 699, category: "Electronics" },
  { name: "Pen", price: 2, category: "Stationery" },
  { name: "Tablet", price: 399, category: "Electronics" }
];

// Find all electronics under $500
console.log("Electronics under $500:");
for (let product of products) {
  if (product.category === "Electronics" && product.price < 500) {
    console.log(\`- \${product.name}: $\${product.price}\`);
  }
}

// ===== INFINITE LOOP PREVENTION =====

console.log("\\n=== Safe Loop Example ===");
let safeCounter = 0;
let maxIterations = 100;

// Always have a safety check
while (true) {
  safeCounter++;
  
  if (safeCounter > 10) {
    console.log("Breaking at iteration", safeCounter);
    break;
  }
  
  // Safety net
  if (safeCounter > maxIterations) {
    console.log("Safety limit reached!");
    break;
  }
}

// ===== PERFORMANCE TIPS =====

console.log("\\n=== Loop Performance ===");

// Cache array length (minor optimization)
let bigArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let arrayLength = bigArray.length;

console.log("Efficient array loop:");
for (let i = 0; i < arrayLength; i++) {
  // Process bigArray[i]
}

// Avoid unnecessary calculations in loop condition
console.log("Calculate once, use many times");

// ===== COMBINING LOOPS AND CONDITIONS =====

console.log("\\n=== FizzBuzz Example ===");
for (let i = 1; i <= 15; i++) {
  let output = "";
  
  if (i % 3 === 0) output += "Fizz";
  if (i % 5 === 0) output += "Buzz";
  
  console.log(i + ": " + (output || i));
}

console.log("\\n=== Loop Practice Complete! ===");`