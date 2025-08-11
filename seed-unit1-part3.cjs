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

// Seeder for Part 3: Functions, Methods & Objects
const seedPart3 = async () => {
  try {
    await connectDB();

    // Find the course
    const course = await Course.findOne({ title: 'FULL STACK DEVELOPMENT' });
    if (!course) {
      console.error('Course not found! Please run seed-unit1-part1.cjs first.');
      process.exit(1);
    }

    console.log('Found course:', course.title);

    // PART 3 TOPICS: Functions, Methods & Objects
    const part3Topics = [
      {
        title: 'Functions - Reusable Code Blocks',
        order: 7,
        contents: [
          {
            title: 'Understanding Functions in JavaScript',
            type: 'text',
            order: 1,
            data: {
              text: `<h2>Functions - Building Blocks of Programs</h2>
              
              <h3>What are Functions?</h3>
              <p>Functions are reusable blocks of code that perform specific tasks. Think of them as recipes or instructions that you can use over and over again.</p>
              
              <div class="bg-blue-50 p-4 rounded mb-4">
                <strong>Real-world analogy:</strong><br>
                A function is like a recipe:
                <ul>
                  <li>The recipe name = Function name</li>
                  <li>Ingredients = Parameters/Arguments</li>
                  <li>Instructions = Function body</li>
                  <li>Final dish = Return value</li>
                </ul>
              </div>
              
              <h3>Why Use Functions?</h3>
              <ul>
                <li><strong>Reusability:</strong> Write once, use many times</li>
                <li><strong>Organization:</strong> Break complex problems into smaller parts</li>
                <li><strong>Maintainability:</strong> Easy to update and debug</li>
                <li><strong>Abstraction:</strong> Hide complex details</li>
              </ul>
              
              <h3>Function Declaration</h3>
              <pre><code>function functionName(parameters) {
  // Code to execute
  return result; // Optional
}</code></pre>
              
              <h4>Example:</h4>
              <pre><code>function greet(name) {
  return "Hello, " + name + "!";
}</code></pre>
              
              <h3>Calling Functions</h3>
              <pre><code>let message = greet("Alice"); // "Hello, Alice!"
console.log(message);</code></pre>
              
              <h3>Parameters vs Arguments</h3>
              <ul>
                <li><strong>Parameters:</strong> Variables listed in function definition</li>
                <li><strong>Arguments:</strong> Actual values passed when calling</li>
              </ul>
              
              <h3>Types of Functions</h3>
              
              <h4>1. Function Declaration</h4>
              <pre><code>function add(a, b) {
  return a + b;
}</code></pre>
              
              <h4>2. Function Expression</h4>
              <pre><code>const multiply = function(a, b) {
  return a * b;
};</code></pre>
              
              <h4>3. Arrow Functions (ES6)</h4>
              <pre><code>const divide = (a, b) => {
  return a / b;
};

// Shorter syntax for single expressions
const square = x => x * x;</code></pre>
              
              <h3>Return Statement</h3>
              <ul>
                <li>Specifies the value to return</li>
                <li>Exits the function immediately</li>
                <li>If no return, function returns <code>undefined</code></li>
              </ul>
              
              <h3>Function Scope</h3>
              <p>Variables declared inside a function are only accessible within that function:</p>
              <pre><code>function myFunction() {
  let localVar = "I'm local";
  console.log(localVar); // Works
}

// console.log(localVar); // Error! Not accessible</code></pre>
              
              <h3>Default Parameters</h3>
              <pre><code>function greet(name = "Guest") {
  return "Hello, " + name;
}

greet();        // "Hello, Guest"
greet("John");  // "Hello, John"</code></pre>
              
              <h3>Functions as Values</h3>
              <p>In JavaScript, functions are "first-class citizens" - they can be:</p>
              <ul>
                <li>Stored in variables</li>
                <li>Passed as arguments</li>
                <li>Returned from other functions</li>
              </ul>
              
              <div class="bg-green-100 p-4 rounded mt-4">
                <strong>💡 Best Practices:</strong>
                <ul>
                  <li>Give functions descriptive names</li>
                  <li>Keep functions small and focused</li>
                  <li>Use parameters instead of global variables</li>
                  <li>Always consider what to return</li>
                </ul>
              </div>`
            }
          },
          {
            title: 'Functions - Complete Examples',
            type: 'code',
            order: 2,
            data: {
              language: 'javascript',
              code: `// ===== BASIC FUNCTION SYNTAX =====

// Function declaration
function sayHello() {
  console.log("Hello, World!");
}

// Calling the function
sayHello(); // Output: Hello, World!
sayHello(); // Can call multiple times

// ===== FUNCTIONS WITH PARAMETERS =====

// Single parameter
function greetPerson(name) {
  console.log("Hello, " + name + "!");
}

greetPerson("Alice");
greetPerson("Bob");

// Multiple parameters
function introduce(name, age, city) {
  console.log(\`My name is \${name}, I'm \${age} years old, from \${city}.\`);
}

introduce("John", 25, "New York");
introduce("Sarah", 30, "London");

// ===== RETURN VALUES =====

// Function that returns a value
function add(a, b) {
  return a + b;
}

let sum = add(5, 3);
console.log("5 + 3 =", sum);

// Using returned value in expressions
let total = add(10, 20) + add(5, 5);
console.log("Total:", total);

// Multiple returns (exits at first return)
function checkNumber(num) {
  if (num > 0) {
    return "Positive";
  }
  if (num < 0) {
    return "Negative";
  }
  return "Zero";
}

console.log("Check 5:", checkNumber(5));
console.log("Check -3:", checkNumber(-3));
console.log("Check 0:", checkNumber(0));

// ===== FUNCTION EXPRESSIONS =====

// Storing function in a variable
const multiply = function(a, b) {
  return a * b;
};

console.log("3 × 4 =", multiply(3, 4));

// Anonymous function (no name)
const divide = function(a, b) {
  if (b === 0) {
    return "Cannot divide by zero!";
  }
  return a / b;
};

console.log("10 ÷ 2 =", divide(10, 2));
console.log("10 ÷ 0 =", divide(10, 0));

// ===== ARROW FUNCTIONS =====

// Basic arrow function
const subtract = (a, b) => {
  return a - b;
};

console.log("10 - 3 =", subtract(10, 3));

// Shorter syntax for single expression
const square = x => x * x;  // No parentheses for single parameter
const cube = x => x * x * x;

console.log("5 squared:", square(5));
console.log("3 cubed:", cube(3));

// Multiple parameters, single expression
const area = (length, width) => length * width;
console.log("Area of 5×3:", area(5, 3));

// ===== DEFAULT PARAMETERS =====

function greetUser(name = "Guest", time = "day") {
  return \`Good \${time}, \${name}!\`;
}

console.log(greetUser());                    // Uses both defaults
console.log(greetUser("Alice"));            // Uses time default
console.log(greetUser("Bob", "morning"));   // No defaults used

// ===== FUNCTIONS WITH VARIABLE ARGUMENTS =====

// Rest parameters (...args)
function sum(...numbers) {
  let total = 0;
  for (let num of numbers) {
    total += num;
  }
  return total;
}

console.log("Sum of 1,2,3:", sum(1, 2, 3));
console.log("Sum of 1,2,3,4,5:", sum(1, 2, 3, 4, 5));

// ===== FUNCTION SCOPE =====

let globalVar = "I'm global";

function demonstrateScope() {
  let localVar = "I'm local";
  console.log("Inside function:");
  console.log("- Global:", globalVar);  // Can access global
  console.log("- Local:", localVar);    // Can access local
}

demonstrateScope();
console.log("Outside function:");
console.log("- Global:", globalVar);    // Can access global
// console.log("- Local:", localVar);   // ERROR! Can't access local

// ===== PRACTICAL FUNCTION EXAMPLES =====

// 1. Temperature converter
function celsiusToFahrenheit(celsius) {
  return (celsius * 9/5) + 32;
}

function fahrenheitToCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5/9;
}

console.log("\\n=== Temperature Converter ===");
console.log("25°C =", celsiusToFahrenheit(25), "°F");
console.log("77°F =", fahrenheitToCelsius(77).toFixed(2), "°C");

// 2. Grade calculator
function calculateGrade(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

console.log("\\n=== Grade Calculator ===");
console.log("Score 95:", calculateGrade(95));
console.log("Score 82:", calculateGrade(82));
console.log("Score 58:", calculateGrade(58));

// 3. Password validator
function isValidPassword(password) {
  if (password.length < 8) {
    return { valid: false, message: "Password too short" };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Need uppercase letter" };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "Need a number" };
  }
  return { valid: true, message: "Password is strong" };
}

console.log("\\n=== Password Validator ===");
console.log("'pass':", isValidPassword("pass"));
console.log("'password123':", isValidPassword("password123"));
console.log("'Password123':", isValidPassword("Password123"));

// 4. Shopping cart functions
let cart = [];

function addToCart(item, price, quantity = 1) {
  cart.push({ item, price, quantity });
  console.log(\`Added \${quantity} \${item}(s) to cart\`);
}

function calculateTotal() {
  let total = 0;
  for (let item of cart) {
    total += item.price * item.quantity;
  }
  return total;
}

function displayCart() {
  console.log("\\n=== Shopping Cart ===");
  if (cart.length === 0) {
    console.log("Cart is empty");
    return;
  }
  
  for (let item of cart) {
    console.log(\`\${item.item}: $\${item.price} × \${item.quantity} = $\${item.price * item.quantity}\`);
  }
  console.log(\`Total: $\${calculateTotal()}\`);
}

// Using the shopping cart
addToCart("Book", 15.99);
addToCart("Pen", 2.50, 3);
addToCart("Notebook", 5.99, 2);
displayCart();

// 5. Higher-order functions (functions using functions)
function applyOperation(a, b, operation) {
  return operation(a, b);
}

console.log("\\n=== Higher-Order Functions ===");
console.log("5 + 3 =", applyOperation(5, 3, add));
console.log("5 × 3 =", applyOperation(5, 3, multiply));
console.log("5 - 3 =", applyOperation(5, 3, (x, y) => x - y));

// 6. Function returning function
function createMultiplier(factor) {
  return function(number) {
    return number * factor;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log("\\n=== Function Factory ===");
console.log("Double 5:", double(5));
console.log("Triple 5:", triple(5));

// ===== COMMON PATTERNS =====

// 1. Guard clauses (early returns)
function processUser(user) {
  if (!user) {
    return "No user provided";
  }
  if (!user.name) {
    return "User has no name";
  }
  if (user.age < 18) {
    return "User is too young";
  }
  
  // Main logic here
  return \`Processing user: \${user.name}\`;
}

console.log("\\n=== Guard Clauses ===");
console.log(processUser(null));
console.log(processUser({ age: 16 }));
console.log(processUser({ name: "Alice", age: 25 }));

// 2. Pure functions (no side effects)
// Good - pure function
function pureAdd(a, b) {
  return a + b;  // Only depends on inputs, doesn't change anything
}

// Bad - impure function (modifies external state)
let counter = 0;
function impureAdd(a, b) {
  counter++;  // Side effect!
  return a + b;
}

// 3. Callback functions
function processArray(array, callback) {
  const result = [];
  for (let item of array) {
    result.push(callback(item));
  }
  return result;
}

console.log("\\n=== Callbacks ===");
const numbers = [1, 2, 3, 4, 5];
console.log("Original:", numbers);
console.log("Doubled:", processArray(numbers, x => x * 2));
console.log("Squared:", processArray(numbers, x => x * x));

// ===== DEBUGGING TIPS =====
console.log("\\n=== Debugging Functions ===");

function debugExample(x, y) {
  console.log("Function called with:", x, y);  // Log inputs
  
  let result = x + y;
  console.log("Calculated result:", result);    // Log intermediate values
  
  return result;
}

debugExample(10, 20);`
            }
          }
        ]
      },
      {
        title: 'Methods & Objects - Organizing Data',
        order: 8,
        contents: [
          {
            title: 'Understanding Objects and Methods',
            type: 'text',
            order: 1,
            data: {
              text: `<h2>Objects and Methods in JavaScript</h2>
              
              <h3>What are Objects?</h3>
              <p>Objects are collections of related data and functionality. They group together variables (called properties) and functions (called methods) that belong together.</p>
              
              <div class="bg-blue-50 p-4 rounded mb-4">
                <strong>Think of objects like real-world things:</strong><br>
                A car object might have:
                <ul>
                  <li>Properties: color, model, year</li>
                  <li>Methods: start(), stop(), accelerate()</li>
                </ul>
              </div>
              
              <h3>Creating Objects</h3>
              
              <h4>Object Literal Syntax</h4>
              <pre><code>const person = {
  name: "John",
  age: 30,
  city: "New York"
};</code></pre>
              
              <h3>Accessing Object Properties</h3>
              
              <h4>Dot Notation</h4>
              <pre><code>console.log(person.name); // "John"
person.age = 31; // Update property</code></pre>
              
              <h4>Bracket Notation</h4>
              <pre><code>console.log(person["city"]); // "New York"
let prop = "name";
console.log(person[prop]); // "John"</code></pre>
              
              <h3>What are Methods?</h3>
              <p>Methods are functions that belong to an object. They can access and modify the object's properties.</p>
              
              <pre><code>const calculator = {
  add: function(a, b) {
    return a + b;
  },
  multiply: function(a, b) {
    return a * b;
  }
};

console.log(calculator.add(5, 3)); // 8</code></pre>
              
              <h3>The 'this' Keyword</h3>
              <p>Inside a method, <code>this</code> refers to the object that owns the method:</p>
              
              <pre><code>const user = {
  firstName: "Alice",
  lastName: "Smith",
  fullName: function() {
    return this.firstName + " " + this.lastName;
  }
};

console.log(user.fullName()); // "Alice Smith"</code></pre>
              
              <h3>Object Methods Shorthand (ES6)</h3>
              <pre><code>const person = {
  name: "Bob",
  // Method shorthand
  greet() {
    return "Hello, I'm " + this.name;
  }
};</code></pre>
              
              <h3>Built-in Object Methods</h3>
              <ul>
                <li><code>Object.keys(obj)</code> - Get array of property names</li>
                <li><code>Object.values(obj)</code> - Get array of values</li>
                <li><code>Object.entries(obj)</code> - Get array of [key, value] pairs</li>
              </ul>
              
              <h3>Objects vs Arrays</h3>
              <table class="border-collapse border border-gray-300">
                <tr>
                  <th class="border border-gray-300 p-2">Arrays</th>
                  <th class="border border-gray-300 p-2">Objects</th>
                </tr>
                <tr>
                  <td class="border border-gray-300 p-2">Ordered collection</td>
                  <td class="border border-gray-300 p-2">Unordered collection</td>
                </tr>
                <tr>
                  <td class="border border-gray-300 p-2">Access by index</td>
                  <td class="border border-gray-300 p-2">Access by property name</td>
                </tr>
                <tr>
                  <td class="border border-gray-300 p-2">Best for lists</td>
                  <td class="border border-gray-300 p-2">Best for entities</td>
                </tr>
              </table>
              
              <div class="bg-green-100 p-4 rounded mt-4">
                <strong>💡 When to use Objects:</strong>
                <ul>
                  <li>Representing real-world entities (users, products, etc.)</li>
                  <li>Grouping related data and functions</li>
                  <li>When you need named properties</li>
                  <li>Creating reusable components</li>
                </ul>
              </div>`
            }
          },
          {
            title: 'Objects and Methods - Complete Examples',
            type: 'code',
            order: 2,
            data: {
              language: 'javascript',
              code: `// ===== CREATING OBJECTS =====

// 1. Object literal - most common way
const person = {
  firstName: "John",
  lastName: "Doe",
  age: 30,
  isStudent: false
};

console.log("Person object:", person);

// 2. Empty object, then add properties
const car = {};
car.make = "Toyota";
car.model = "Camry";
car.year = 2022;
car.color = "Blue";

console.log("Car object:", car);

// 3. Using Object constructor (less common)
const book = new Object();
book.title = "JavaScript Guide";
book.author = "John Smith";
book.pages = 350;

console.log("Book object:", book);

// ===== ACCESSING PROPERTIES =====

const student = {
  name: "Alice Johnson",
  grade: 95,
  subjects: ["Math", "Science", "English"],
  contact: {
    email: "alice@email.com",
    phone: "123-456-7890"
  }
};

// Dot notation
console.log("\\nStudent name:", student.name);
console.log("Student grade:", student.grade);
console.log("Student email:", student.contact.email);

// Bracket notation
console.log("Using brackets:", student["name"]);
let prop = "grade";
console.log("Dynamic property:", student[prop]);

// Accessing nested properties
console.log("First subject:", student.subjects[0]);
console.log("Phone:", student.contact.phone);

// ===== MODIFYING OBJECTS =====

const product = {
  name: "Laptop",
  price: 999,
  inStock: true
};

console.log("\\nOriginal product:", product);

// Update properties
product.price = 899;
product.inStock = false;

// Add new properties
product.discount = 10;
product.category = "Electronics";

// Delete properties
delete product.inStock;

console.log("Modified product:", product);

// ===== OBJECT METHODS =====

const calculator = {
  // Method using function keyword
  add: function(a, b) {
    return a + b;
  },
  
  // Method shorthand (ES6)
  subtract(a, b) {
    return a - b;
  },
  
  // Arrow function (be careful with 'this')
  multiply: (a, b) => a * b,
  
  // Method that uses other methods
  calculate(a, b, operation) {
    switch(operation) {
      case '+': return this.add(a, b);
      case '-': return this.subtract(a, b);
      case '*': return this.multiply(a, b);
      default: return "Invalid operation";
    }
  }
};

console.log("\\n=== Calculator ===");
console.log("5 + 3 =", calculator.add(5, 3));
console.log("10 - 4 =", calculator.subtract(10, 4));
console.log("6 * 7 =", calculator.multiply(6, 7));
console.log("Calculate 8 + 2:", calculator.calculate(8, 2, '+'));

// ===== THE 'THIS' KEYWORD =====

const person2 = {
  firstName: "Sarah",
  lastName: "Williams",
  age: 28,
  
  // Method using 'this'
  introduce() {
    return \`Hi, I'm \${this.firstName} \${this.lastName}, \${this.age} years old.\`;
  },
  
  // Method that modifies the object
  haveBirthday() {
    this.age++;
    console.log(\`Happy birthday! Now \${this.age} years old.\`);
  },
  
  // Method calling another method
  greet(other) {
    console.log(\`\${this.firstName} says: Hello, \${other}!\`);
  }
};

console.log("\\n=== Using 'this' ===");
console.log(person2.introduce());
person2.haveBirthday();
person2.greet("Bob");

// ===== OBJECT WITH ARRAY METHODS =====

const shoppingCart = {
  items: [],
  
  addItem(name, price, quantity = 1) {
    this.items.push({ name, price, quantity });
    console.log(\`Added \${quantity} \${name}(s) to cart\`);
  },
  
  removeItem(name) {
    const index = this.items.findIndex(item => item.name === name);
    if (index > -1) {
      this.items.splice(index, 1);
      console.log(\`Removed \${name} from cart\`);
    }
  },
  
  getTotal() {
    return this.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  },
  
  displayCart() {
    if (this.items.length === 0) {
      console.log("Cart is empty");
      return;
    }
    console.log("\\nShopping Cart:");
    this.items.forEach(item => {
      console.log(\`- \${item.name}: $\${item.price} x \${item.quantity} = $\${item.price * item.quantity}\`);
    });
    console.log(\`Total: $\${this.getTotal()}\`);
  }
};

// Using the shopping cart
shoppingCart.addItem("Book", 15.99);
shoppingCart.addItem("Pen", 2.50, 3);
shoppingCart.addItem("Notebook", 5.99, 2);
shoppingCart.displayCart();
shoppingCart.removeItem("Pen");
shoppingCart.displayCart();

// ===== BUILT-IN OBJECT METHODS =====

const user = {
  username: "john_doe",
  email: "john@example.com",
  age: 25,
  active: true
};

console.log("\\n=== Object Methods ===");

// Object.keys() - get all property names
console.log("Keys:", Object.keys(user));

// Object.values() - get all values
console.log("Values:", Object.values(user));

// Object.entries() - get key-value pairs
console.log("Entries:", Object.entries(user));

// Check if property exists
console.log("Has 'email'?", 'email' in user);
console.log("Has 'phone'?", 'phone' in user);

// ===== PRACTICAL EXAMPLES =====

// 1. Bank Account Object
const bankAccount = {
  accountNumber: "123456789",
  owner: "Alice Smith",
  balance: 1000,
  
  deposit(amount) {
    if (amount > 0) {
      this.balance += amount;
      console.log(\`Deposited $\${amount}. New balance: $\${this.balance}\`);
      return true;
    }
    console.log("Invalid deposit amount");
    return false;
  },
  
  withdraw(amount) {
    if (amount > 0 && amount <= this.balance) {
      this.balance -= amount;
      console.log(\`Withdrew $\${amount}. New balance: $\${this.balance}\`);
      return true;
    }
    console.log("Insufficient funds or invalid amount");
    return false;
  },
  
  getBalance() {
    return this.balance;
  },
  
  getAccountInfo() {
    return \`Account: \${this.accountNumber}\\nOwner: \${this.owner}\\nBalance: $\${this.balance}\`;
  }
};

console.log("\\n=== Bank Account ===");
console.log(bankAccount.getAccountInfo());
bankAccount.deposit(500);
bankAccount.withdraw(200);
bankAccount.withdraw(2000); // Should fail

// 2. Student Grade Tracker
const gradeTracker = {
  student: "Bob Johnson",
  grades: [],
  
  addGrade(subject, score) {
    this.grades.push({ subject, score, date: new Date() });
    console.log(\`Added \${subject} grade: \${score}\`);
  },
  
  getAverage() {
    if (this.grades.length === 0) return 0;
    const sum = this.grades.reduce((total, grade) => total + grade.score, 0);
    return sum / this.grades.length;
  },
  
  getLetterGrade() {
    const avg = this.getAverage();
    if (avg >= 90) return 'A';
    if (avg >= 80) return 'B';
    if (avg >= 70) return 'C';
    if (avg >= 60) return 'D';
    return 'F';
  },
  
  getReport() {
    console.log(\`\\nGrade Report for \${this.student}\`);
    console.log("=".repeat(30));
    this.grades.forEach(grade => {
      console.log(\`\${grade.subject}: \${grade.score}\`);
    });
    console.log("=".repeat(30));
    console.log(\`Average: \${this.getAverage().toFixed(2)}\`);
    console.log(\`Letter Grade: \${this.getLetterGrade()}\`);
  }
};

gradeTracker.addGrade("Math", 92);
gradeTracker.addGrade("Science", 88);
gradeTracker.addGrade("English", 95);
gradeTracker.addGrade("History", 87);
gradeTracker.getReport();

// 3. Todo List Manager
const todoManager = {
  todos: [],
  nextId: 1,
  
  addTodo(text) {
    const todo = {
      id: this.nextId++,
      text: text,
      completed: false,
      createdAt: new Date()
    };
    this.todos.push(todo);
    console.log(\`Added todo #\${todo.id}: "\${text}"\`);
    return todo.id;
  },
  
  completeTodo(id) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = true;
      console.log(\`Completed todo #\${id}\`);
    }
  },
  
  deleteTodo(id) {
    const index = this.todos.findIndex(t => t.id === id);
    if (index > -1) {
      this.todos.splice(index, 1);
      console.log(\`Deleted todo #\${id}\`);
    }
  },
  
  listTodos() {
    console.log("\\n=== Todo List ===");
    if (this.todos.length === 0) {
      console.log("No todos!");
      return;
    }
    this.todos.forEach(todo => {
      const status = todo.completed ? "✓" : "○";
      console.log(\`\${status} [\${todo.id}] \${todo.text}\`);
    });
  }
};

// Using todo manager
todoManager.addTodo("Learn JavaScript");
todoManager.addTodo("Practice coding");
todoManager.addTodo("Build a project");
todoManager.listTodos();
todoManager.completeTodo(1);
todoManager.listTodos();

// ===== COMMON PATTERNS =====

// Object as a namespace
const MathUtils = {
  PI: 3.14159,
  
  circleArea(radius) {
    return this.PI * radius * radius;
  },
  
  rectangleArea(length, width) {
    return length * width;
  },
  
  distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }
};

console.log("\\n=== Math Utils ===");
console.log("Circle area (r=5):", MathUtils.circleArea(5));
console.log("Rectangle area (3x4):", MathUtils.rectangleArea(3, 4));
console.log("Distance (0,0) to (3,4):", MathUtils.distance(0, 0, 3, 4));`
            }
          }
        ]
      }
    ];

    // Create topics and content for Part 3
    for (const topicData of part3Topics) {
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

        course.topics.push(topic._id);
        
        console.log(`Created topic: ${topic.title}`);
      } else {
        console.log(`Topic exists: ${topic.title}`);
      }

      // Create contents for this topic
      for (const contentData of topicData.contents) {
        const existingContent = await Content.findOne({
          title: contentData.title,
          topic: topic._id
        });

        if (!existingContent) {
          const content = await Content.create({
            ...contentData,
            topic: topic._id
          });

          topic.contents.push(content._id);
          
          console.log(`  - Added content: ${content.title}`);
        } else {
          console.log(`  - Content exists: ${contentData.title}`);
        }
      }

      await topic.save();
    }

    await course.save();

    console.log('\n=== Part 3 Seeding Completed! ===');
    console.log('Topics covered:');
    console.log('- Functions');
    console.log('- Methods & Objects');
    
    console.log('\nNext: Run seed-unit1-part4.cjs for Decisions & Loops');

  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

// Run the seeder
seedPart3();