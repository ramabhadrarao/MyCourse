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

// Seeder for Part 2: Data Types, Arrays, and Strings
const seedPart2 = async () => {
  try {
    await connectDB();

    // Find the course
    const course = await Course.findOne({ title: 'FULL STACK DEVELOPMENT' });
    if (!course) {
      console.error('Course not found! Please run seed-unit1-part1.cjs first.');
      process.exit(1);
    }

    console.log('Found course:', course.title);

    // PART 2 TOPICS: Data Types, Arrays, Strings
    const part2Topics = [
      {
        title: 'Data Types - Different Kinds of Information',
        order: 4,
        contents: [
          {
            title: 'Understanding JavaScript Data Types',
            type: 'text',
            order: 1,
            data: {
              text: `<h2>Data Types in JavaScript</h2>
              
              <p>Just like in real life we have different types of information (numbers, words, yes/no answers), JavaScript has different data types to represent various kinds of data.</p>
              
              <h3>The Main Data Types</h3>
              
              <h4>1. Numbers</h4>
              <p>Any numeric value - whole numbers, decimals, negative numbers</p>
              <pre><code>let age = 25;          // Whole number (integer)
let price = 19.99;     // Decimal number (float)
let temperature = -5;  // Negative number
let bigNumber = 1000000; // Large number</code></pre>
              
              <h4>2. Strings (Text)</h4>
              <p>Any text, surrounded by quotes (single, double, or backticks)</p>
              <pre><code>let name = "Alice";           // Double quotes
let city = 'New York';        // Single quotes
let message = \`Hello World\`; // Backticks (template literals)</code></pre>
              
              <h4>3. Booleans (True/False)</h4>
              <p>Only two possible values: true or false</p>
              <pre><code>let isStudent = true;
let isMarried = false;
let hasPermission = true;</code></pre>
              
              <h4>4. Undefined</h4>
              <p>A variable that has been declared but not given a value</p>
              <pre><code>let futureValue;
console.log(futureValue); // undefined</code></pre>
              
              <h4>5. Null</h4>
              <p>Represents "nothing" or "empty" - intentionally no value</p>
              <pre><code>let emptyBox = null;</code></pre>
              
              <h4>6. Objects</h4>
              <p>Complex data that groups related information</p>
              <pre><code>let person = {
  name: "John",
  age: 30,
  city: "Boston"
};</code></pre>
              
              <h4>7. Arrays</h4>
              <p>Lists of values (we'll cover these in detail later)</p>
              <pre><code>let colors = ["red", "green", "blue"];
let numbers = [1, 2, 3, 4, 5];</code></pre>
              
              <h3>Checking Data Types</h3>
              <p>Use the <code>typeof</code> operator to check what type a variable is:</p>
              <pre><code>let myNumber = 42;
console.log(typeof myNumber); // "number"

let myName = "Alice";
console.log(typeof myName);   // "string"</code></pre>
              
              <h3>Type Conversion</h3>
              <p>Sometimes you need to convert between types:</p>
              
              <h4>String to Number:</h4>
              <pre><code>let textNumber = "123";
let realNumber = Number(textNumber);  // 123
let realNumber2 = parseInt(textNumber); // 123</code></pre>
              
              <h4>Number to String:</h4>
              <pre><code>let num = 456;
let text = String(num);     // "456"
let text2 = num.toString(); // "456"</code></pre>
              
              <h3>Dynamic Typing</h3>
              <p>JavaScript is "dynamically typed" - variables can hold any type and can change types:</p>
              <pre><code>let flexible = 42;      // It's a number
flexible = "Hello";     // Now it's a string
flexible = true;        // Now it's a boolean</code></pre>
              
              <div class="bg-yellow-100 p-4 rounded">
                <strong>⚠️ Important:</strong> While you CAN change types, it's usually better to keep variables as one type for clarity.
              </div>
              
              <h3>Special Number Values</h3>
              <ul>
                <li><code>Infinity</code> - Result of dividing by zero</li>
                <li><code>-Infinity</code> - Negative infinity</li>
                <li><code>NaN</code> - "Not a Number" (invalid math operation)</li>
              </ul>
              
              <div class="bg-green-100 p-4 rounded mt-4">
                <strong>💡 Tip:</strong> Always be aware of what type of data you're working with. Many bugs come from type confusion!
              </div>`
            }
          },
          {
            title: 'Data Types - Hands-On Examples',
            type: 'code',
            order: 2,
            data: {
              language: 'javascript',
              code: `// ===== NUMBERS =====
let wholeNumber = 42;
let decimal = 3.14159;
let negative = -20;
let zero = 0;

console.log("Whole number:", wholeNumber);
console.log("Decimal:", decimal);
console.log("Negative:", negative);

// Number operations
let sum = 10 + 5;        // 15
let difference = 20 - 8;  // 12
let product = 4 * 7;      // 28
let quotient = 100 / 4;   // 25
let remainder = 10 % 3;   // 1 (modulo operation)

console.log("Basic math:", sum, difference, product, quotient, remainder);

// Special number values
let infinity = 1 / 0;
console.log("Infinity:", infinity);

let notANumber = "hello" * 5;
console.log("NaN:", notANumber);

// ===== STRINGS =====
let firstName = "Alice";
let lastName = 'Johnson';
let fullName = firstName + " " + lastName;  // Concatenation

console.log("Full name:", fullName);

// String with quotes inside
let quote1 = "She said 'Hello'";
let quote2 = 'He said "Goodbye"';
let quote3 = \`They said "Hi" and 'Bye'\`;

console.log(quote1);
console.log(quote2);
console.log(quote3);

// Template literals (backticks) - very useful!
let userName = "Bob";
let userAge = 25;
let introduction = \`Hello, my name is \${userName} and I am \${userAge} years old.\`;
console.log(introduction);

// ===== BOOLEANS =====
let isRaining = true;
let isSunny = false;

console.log("Is it raining?", isRaining);
console.log("Is it sunny?", isSunny);

// Booleans from comparisons
let age = 18;
let canVote = age >= 18;  // true
let isChild = age < 13;    // false

console.log("Can vote?", canVote);
console.log("Is child?", isChild);

// ===== UNDEFINED & NULL =====
let notDefined;
console.log("Undefined variable:", notDefined);
console.log("Type of undefined:", typeof notDefined);

let emptyValue = null;
console.log("Null value:", emptyValue);
console.log("Type of null:", typeof emptyValue); // Quirk: shows "object"

// ===== CHECKING TYPES =====
console.log("\\n===== Type Checking =====");
console.log("Type of 42:", typeof 42);                    // "number"
console.log("Type of 'hello':", typeof 'hello');          // "string"
console.log("Type of true:", typeof true);                // "boolean"
console.log("Type of undefined:", typeof undefined);      // "undefined"
console.log("Type of null:", typeof null);                // "object" (JS quirk)
console.log("Type of [1,2,3]:", typeof [1,2,3]);         // "object"
console.log("Type of {name:'John'}:", typeof {name:'John'}); // "object"

// ===== TYPE CONVERSION =====
console.log("\\n===== Type Conversion =====");

// String to Number
let textNumber = "123";
let converted1 = Number(textNumber);
let converted2 = parseInt(textNumber);
let converted3 = parseFloat("123.45");

console.log("String '123' to number:", converted1);
console.log("Using parseInt:", converted2);
console.log("parseFloat '123.45':", converted3);

// Number to String
let myNumber = 456;
let numberAsString1 = String(myNumber);
let numberAsString2 = myNumber.toString();
let numberAsString3 = myNumber + ""; // Quick trick

console.log("Number to string methods:", numberAsString1, numberAsString2, numberAsString3);

// Boolean conversion
console.log("Boolean('hello'):", Boolean('hello'));  // true
console.log("Boolean(''):", Boolean(''));            // false
console.log("Boolean(0):", Boolean(0));              // false
console.log("Boolean(42):", Boolean(42));            // true

// ===== DYNAMIC TYPING =====
console.log("\\n===== Dynamic Typing =====");
let dynamicVar = 100;
console.log("dynamicVar is:", dynamicVar, "- Type:", typeof dynamicVar);

dynamicVar = "Now I'm text";
console.log("dynamicVar is:", dynamicVar, "- Type:", typeof dynamicVar);

dynamicVar = true;
console.log("dynamicVar is:", dynamicVar, "- Type:", typeof dynamicVar);

// ===== PRACTICAL EXAMPLES =====
console.log("\\n===== Practical Examples =====");

// Shopping cart example
let itemName = "JavaScript Book";
let itemPrice = 29.99;
let quantity = 2;
let inStock = true;
let discount = null; // No discount currently

let totalPrice = itemPrice * quantity;
console.log(\`Item: \${itemName}\`);
console.log(\`Price: $\${itemPrice}\`);
console.log(\`Quantity: \${quantity}\`);
console.log(\`In Stock: \${inStock}\`);
console.log(\`Total: $\${totalPrice}\`);
console.log(\`Discount: \${discount || "No discount"}\`);

// User input simulation
let userInput = "25"; // Usually comes as string from forms
let userAge = parseInt(userInput);
let yearsUntil100 = 100 - userAge;
console.log(\`\\nYou are \${userAge} years old.\`);
console.log(\`You have \${yearsUntil100} years until you're 100!\`);`
            }
          }
        ]
      },
      {
        title: 'Arrays - Working with Lists',
        order: 5,
        contents: [
          {
            title: 'Introduction to Arrays',
            type: 'text',
            order: 1,
            data: {
              text: `<h2>Arrays - Managing Lists of Data</h2>
              
              <h3>What is an Array?</h3>
              <p>An array is like a list or a collection of items. Think of it as a row of boxes, each containing a value, and each box has a number (starting from 0).</p>
              
              <div class="bg-blue-50 p-4 rounded mb-4">
                <strong>Real-world analogy:</strong><br>
                - A shopping list is like an array of items to buy<br>
                - A playlist is like an array of songs<br>
                - A class roster is like an array of student names
              </div>
              
              <h3>Creating Arrays</h3>
              <pre><code>// Empty array
let emptyList = [];

// Array with values
let fruits = ["apple", "banana", "orange"];
let numbers = [10, 20, 30, 40, 50];
let mixed = ["text", 123, true, null]; // Can mix types!</code></pre>
              
              <h3>Accessing Array Elements</h3>
              <p>Arrays use zero-based indexing (first item is at position 0):</p>
              <pre><code>let colors = ["red", "green", "blue"];
console.log(colors[0]); // "red" (first item)
console.log(colors[1]); // "green" (second item)
console.log(colors[2]); // "blue" (third item)</code></pre>
              
              <h3>Array Properties</h3>
              <h4>Length Property</h4>
              <pre><code>let animals = ["cat", "dog", "bird", "fish"];
console.log(animals.length); // 4</code></pre>
              
              <h3>Common Array Methods</h3>
              
              <h4>1. Adding Elements</h4>
              <ul>
                <li><code>push()</code> - Add to the end</li>
                <li><code>unshift()</code> - Add to the beginning</li>
              </ul>
              <pre><code>let tasks = ["study", "eat"];
tasks.push("sleep");     // ["study", "eat", "sleep"]
tasks.unshift("wake");   // ["wake", "study", "eat", "sleep"]</code></pre>
              
              <h4>2. Removing Elements</h4>
              <ul>
                <li><code>pop()</code> - Remove from the end</li>
                <li><code>shift()</code> - Remove from the beginning</li>
              </ul>
              <pre><code>let stack = ["A", "B", "C", "D"];
let last = stack.pop();     // Removes "D"
let first = stack.shift();  // Removes "A"
// stack is now ["B", "C"]</code></pre>
              
              <h4>3. Finding Elements</h4>
              <ul>
                <li><code>indexOf()</code> - Find position of element</li>
                <li><code>includes()</code> - Check if element exists</li>
              </ul>
              <pre><code>let fruits = ["apple", "banana", "orange"];
console.log(fruits.indexOf("banana"));  // 1
console.log(fruits.includes("grape"));  // false</code></pre>
              
              <h4>4. Modifying Arrays</h4>
              <ul>
                <li><code>splice()</code> - Add/remove elements anywhere</li>
                <li><code>slice()</code> - Copy portion of array</li>
              </ul>
              
              <h3>Looping Through Arrays</h3>
              <p>We'll cover loops in detail later, but here's a preview:</p>
              <pre><code>let scores = [85, 90, 78, 92];
for (let i = 0; i < scores.length; i++) {
  console.log("Score", i + 1, ":", scores[i]);
}</code></pre>
              
              <h3>Array vs. Individual Variables</h3>
              <div class="bg-yellow-100 p-4 rounded">
                <strong>Without arrays (tedious):</strong>
                <pre><code>let student1 = "Alice";
let student2 = "Bob";
let student3 = "Charlie";
// Imagine doing this for 100 students!</code></pre>
                
                <strong>With arrays (efficient):</strong>
                <pre><code>let students = ["Alice", "Bob", "Charlie", ...];
// Can easily handle any number of students!</code></pre>
              </div>
              
              <div class="bg-green-100 p-4 rounded mt-4">
                <strong>💡 Key Points:</strong><br>
                - Arrays start at index 0<br>
                - Use <code>length</code> to get the size<br>
                - Arrays can grow and shrink<br>
                - Can store any type of data
              </div>`
            }
          },
          {
            title: 'Arrays - Practical Examples',
            type: 'code',
            order: 2,
            data: {
              language: 'javascript',
              code: `// ===== CREATING ARRAYS =====

// Different ways to create arrays
let emptyArray = [];
let numbers = [1, 2, 3, 4, 5];
let fruits = ["apple", "banana", "orange", "mango"];
let mixed = [42, "hello", true, null, {name: "John"}];

console.log("Empty array:", emptyArray);
console.log("Numbers:", numbers);
console.log("Fruits:", fruits);
console.log("Mixed types:", mixed);

// ===== ACCESSING ELEMENTS =====

let colors = ["red", "green", "blue", "yellow", "purple"];

// Accessing by index (remember: starts at 0!)
console.log("\\nFirst color:", colors[0]);   // "red"
console.log("Third color:", colors[2]);      // "blue"
console.log("Last color:", colors[colors.length - 1]); // "purple"

// Changing elements
colors[1] = "lime";
console.log("After change:", colors);

// ===== ARRAY PROPERTIES =====

let shoppingList = ["milk", "bread", "eggs", "cheese"];
console.log("\\nShopping list:", shoppingList);
console.log("Number of items:", shoppingList.length);

// Check if array is empty
if (shoppingList.length === 0) {
  console.log("Shopping list is empty!");
} else {
  console.log("You have", shoppingList.length, "items to buy");
}

// ===== ADDING ELEMENTS =====

let todoList = ["wake up", "brush teeth"];
console.log("\\nInitial todo list:", todoList);

// Add to end with push()
todoList.push("eat breakfast");
todoList.push("go to work");
console.log("After push:", todoList);

// Add to beginning with unshift()
todoList.unshift("alarm rings");
console.log("After unshift:", todoList);

// Add multiple items at once
todoList.push("lunch", "meeting", "go home");
console.log("After multiple push:", todoList);

// ===== REMOVING ELEMENTS =====

let stack = ["A", "B", "C", "D", "E"];
console.log("\\nInitial stack:", stack);

// Remove from end with pop()
let removed1 = stack.pop();
console.log("Popped:", removed1, "- Stack now:", stack);

// Remove from beginning with shift()
let removed2 = stack.shift();
console.log("Shifted:", removed2, "- Stack now:", stack);

// ===== FINDING ELEMENTS =====

let animals = ["cat", "dog", "bird", "dog", "fish"];
console.log("\\nAnimals:", animals);

// Find index of element
console.log("Index of 'bird':", animals.indexOf("bird"));         // 2
console.log("Index of 'dog':", animals.indexOf("dog"));           // 1 (first occurrence)
console.log("Index of 'rabbit':", animals.indexOf("rabbit"));     // -1 (not found)

// Check if element exists
console.log("Has 'cat'?", animals.includes("cat"));               // true
console.log("Has 'elephant'?", animals.includes("elephant"));     // false

// ===== SLICING ARRAYS =====

let alphabet = ["A", "B", "C", "D", "E", "F", "G"];
console.log("\\nOriginal:", alphabet);

// slice(start, end) - end is NOT included
let firstThree = alphabet.slice(0, 3);  // ["A", "B", "C"]
let middlePart = alphabet.slice(2, 5);  // ["C", "D", "E"]
let lastTwo = alphabet.slice(-2);       // ["F", "G"]

console.log("First three:", firstThree);
console.log("Middle part:", middlePart);
console.log("Last two:", lastTwo);
console.log("Original unchanged:", alphabet);

// ===== JOINING AND SPLITTING =====

// Array to string with join()
let words = ["Hello", "world", "from", "JavaScript"];
let sentence = words.join(" ");  // Join with space
let csvLine = words.join(",");   // Join with comma

console.log("\\nJoined with space:", sentence);
console.log("Joined with comma:", csvLine);

// String to array with split()
let text = "apple,banana,orange,mango";
let fruitArray = text.split(",");
console.log("Split string:", fruitArray);

// ===== PRACTICAL EXAMPLES =====

// 1. Grade calculator
console.log("\\n===== Grade Calculator =====");
let grades = [85, 92, 78, 95, 88];
let total = 0;

for (let i = 0; i < grades.length; i++) {
  total += grades[i];
}

let average = total / grades.length;
console.log("Grades:", grades);
console.log("Average:", average.toFixed(2));

// 2. Shopping cart
console.log("\\n===== Shopping Cart =====");
let cart = [];

// Add items
cart.push({name: "Laptop", price: 999});
cart.push({name: "Mouse", price: 25});
cart.push({name: "Keyboard", price: 75});

console.log("Cart items:");
let cartTotal = 0;
for (let i = 0; i < cart.length; i++) {
  console.log(\`\${i + 1}. \${cart[i].name}: $\${cart[i].price}\`);
  cartTotal += cart[i].price;
}
console.log("Total: $" + cartTotal);

// 3. Task manager
console.log("\\n===== Task Manager =====");
let tasks = ["Email client", "Write report", "Team meeting"];

console.log("Current tasks:", tasks);
console.log("Number of tasks:", tasks.length);

// Complete first task
let completed = tasks.shift();
console.log("Completed:", completed);
console.log("Remaining tasks:", tasks);

// Add urgent task
tasks.unshift("URGENT: Fix bug");
console.log("After adding urgent task:", tasks);

// ===== ARRAY GOTCHAS =====
console.log("\\n===== Common Mistakes =====");

// Accessing beyond array length
let smallArray = [10, 20, 30];
console.log("Index 5:", smallArray[5]); // undefined (not error)

// Arrays are reference types
let original = [1, 2, 3];
let copy = original;  // This is NOT a real copy!
copy[0] = 999;
console.log("Original:", original); // [999, 2, 3] - Changed!

// Make a real copy
let realCopy = [...original]; // Spread operator
// or
let realCopy2 = original.slice(); // Using slice()

console.log("Real copies are independent");`
            }
          }
        ]
      },
      {
        title: 'Strings - Working with Text',
        order: 6,
        contents: [
          {
            title: 'Understanding Strings in JavaScript',
            type: 'text',
            order: 1,
            data: {
              text: `<h2>Strings - Text in JavaScript</h2>
              
              <h3>What are Strings?</h3>
              <p>Strings are sequences of characters used to represent text. They can contain letters, numbers, symbols, and even emojis!</p>
              
              <h3>Creating Strings</h3>
              <p>Three ways to create strings in JavaScript:</p>
              
              <h4>1. Single Quotes</h4>
              <pre><code>let name = 'Alice';</code></pre>
              
              <h4>2. Double Quotes</h4>
              <pre><code>let message = "Hello, World!";</code></pre>
              
              <h4>3. Template Literals (Backticks)</h4>
              <pre><code>let greeting = \`Welcome to JavaScript\`;</code></pre>
              
              <h3>String Properties</h3>
              
              <h4>Length</h4>
              <p>Every string has a <code>length</code> property that tells you how many characters it contains:</p>
              <pre><code>let text = "Hello";
console.log(text.length); // 5</code></pre>
              
              <h3>Accessing Characters</h3>
              <p>You can access individual characters using bracket notation (like arrays!):</p>
              <pre><code>let word = "Hello";
console.log(word[0]); // "H"
console.log(word[1]); // "e"
console.log(word[4]); // "o"</code></pre>
              
              <h3>String Concatenation</h3>
              <p>Joining strings together:</p>
              
              <h4>Using + Operator</h4>
              <pre><code>let first = "Hello";
let second = "World";
let combined = first + " " + second; // "Hello World"</code></pre>
              
              <h4>Using Template Literals</h4>
              <pre><code>let name = "Alice";
let age = 25;
let intro = \`My name is \${name} and I am \${age} years old.\`;</code></pre>
              
              <h3>Common String Methods</h3>
              
              <h4>Case Conversion</h4>
              <ul>
                <li><code>toUpperCase()</code> - Convert to uppercase</li>
                <li><code>toLowerCase()</code> - Convert to lowercase</li>
              </ul>
              
              <h4>Searching</h4>
              <ul>
                <li><code>indexOf()</code> - Find position of substring</li>
                <li><code>includes()</code> - Check if contains substring</li>
                <li><code>startsWith()</code> - Check if starts with</li>
                <li><code>endsWith()</code> - Check if ends with</li>
              </ul>
              
              <h4>Extracting Parts</h4>
              <ul>
                <li><code>slice(start, end)</code> - Extract portion</li>
                <li><code>substring(start, end)</code> - Similar to slice</li>
                <li><code>substr(start, length)</code> - Extract by length</li>
              </ul>
              
              <h4>Modifying</h4>
              <ul>
                <li><code>replace()</code> - Replace first occurrence</li>
                <li><code>replaceAll()</code> - Replace all occurrences</li>
                <li><code>trim()</code> - Remove whitespace from ends</li>
              </ul>
              
              <h3>String Immutability</h3>
              <div class="bg-yellow-100 p-4 rounded">
                <strong>Important:</strong> Strings are immutable in JavaScript. This means you cannot change individual characters. String methods return new strings instead of modifying the original.
              </div>
              
              <h3>Escape Characters</h3>
              <p>Special characters in strings:</p>
              <ul>
                <li><code>\\n</code> - New line</li>
                <li><code>\\t</code> - Tab</li>
                <li><code>\\"</code> - Double quote</li>
                <li><code>\\'</code> - Single quote</li>
                <li><code>\\\\</code> - Backslash</li>
              </ul>
              
              <div class="bg-green-100 p-4 rounded mt-4">
                <strong>💡 Pro Tip:</strong> Use template literals (backticks) for:
                <ul>
                  <li>Multi-line strings</li>
                  <li>String interpolation (embedding variables)</li>
                  <li>Complex string building</li>
                </ul>
              </div>`
            }
          },
          {
            title: 'Strings - Comprehensive Examples',
            type: 'code',
            order: 2,
            data: {
              language: 'javascript',
              code: `// ===== CREATING STRINGS =====

// Different quote styles
let single = 'Hello';
let double = "World";
let template = \`JavaScript\`;

console.log("Single quotes:", single);
console.log("Double quotes:", double);
console.log("Template literal:", template);

// Quotes within strings
let quote1 = "He said 'Hello'";
let quote2 = 'She said "Goodbye"';
let quote3 = \`They said "Hi" and 'Bye'\`;

console.log(quote1);
console.log(quote2);
console.log(quote3);

// Multi-line strings (only with template literals)
let multiline = \`This is line 1
This is line 2
This is line 3\`;
console.log("Multiline string:");
console.log(multiline);

// ===== STRING PROPERTIES =====

let message = "Hello, JavaScript!";
console.log("\\nString:", message);
console.log("Length:", message.length);
console.log("Is empty?", message.length === 0);

// ===== ACCESSING CHARACTERS =====

let word = "Programming";
console.log("\\nWord:", word);
console.log("First character:", word[0]);
console.log("Last character:", word[word.length - 1]);
console.log("Character at index 5:", word[5]);

// Loop through characters
console.log("All characters:");
for (let i = 0; i < word.length; i++) {
  console.log(\`Index \${i}: \${word[i]}\`);
}

// ===== STRING CONCATENATION =====

let firstName = "John";
let lastName = "Doe";

// Using + operator
let fullName1 = firstName + " " + lastName;
console.log("\\nUsing +:", fullName1);

// Using concat method
let fullName2 = firstName.concat(" ", lastName);
console.log("Using concat():", fullName2);

// Using template literals (best way!)
let fullName3 = \`\${firstName} \${lastName}\`;
console.log("Using template literal:", fullName3);

// Building complex strings
let age = 30;
let city = "New York";
let introduction = \`Hello! My name is \${fullName3}.
I am \${age} years old and I live in \${city}.\`;
console.log("\\nIntroduction:");
console.log(introduction);

// ===== CASE CONVERSION =====

let mixedCase = "JavaScript Programming";
console.log("\\nOriginal:", mixedCase);
console.log("Uppercase:", mixedCase.toUpperCase());
console.log("Lowercase:", mixedCase.toLowerCase());

// Practical use: case-insensitive comparison
let userInput = "YES";
let standardized = userInput.toLowerCase();
if (standardized === "yes") {
  console.log("User agreed!");
}

// ===== SEARCHING IN STRINGS =====

let sentence = "JavaScript is awesome. JavaScript is fun!";
console.log("\\nSentence:", sentence);

// indexOf - finds first occurrence
console.log("Index of 'JavaScript':", sentence.indexOf("JavaScript"));
console.log("Index of 'is':", sentence.indexOf("is"));
console.log("Index of 'Python':", sentence.indexOf("Python")); // -1 if not found

// lastIndexOf - finds last occurrence
console.log("Last index of 'JavaScript':", sentence.lastIndexOf("JavaScript"));

// includes - returns true/false
console.log("Contains 'awesome'?", sentence.includes("awesome"));
console.log("Contains 'boring'?", sentence.includes("boring"));

// startsWith and endsWith
console.log("Starts with 'Java'?", sentence.startsWith("Java"));
console.log("Ends with 'fun!'?", sentence.endsWith("fun!"));

// ===== EXTRACTING SUBSTRINGS =====

let text = "Hello, World!";
console.log("\\nOriginal:", text);

// slice(start, end) - end not included
console.log("slice(0, 5):", text.slice(0, 5));      // "Hello"
console.log("slice(7):", text.slice(7));            // "World!"
console.log("slice(-6):", text.slice(-6));          // "World!"
console.log("slice(7, 12):", text.slice(7, 12));    // "World"

// substring(start, end) - similar to slice but no negative indexes
console.log("substring(0, 5):", text.substring(0, 5));

// substr(start, length) - deprecated but still used
console.log("substr(7, 5):", text.substr(7, 5));    // "World"

// ===== REPLACING TEXT =====

let original = "I love Java. Java is great!";
console.log("\\nOriginal:", original);

// replace - only first occurrence
let replaced1 = original.replace("Java", "JavaScript");
console.log("replace():", replaced1);

// replaceAll - all occurrences
let replaced2 = original.replaceAll("Java", "JavaScript");
console.log("replaceAll():", replaced2);

// Using regex for case-insensitive replace
let text2 = "Hello hello HELLO";
let replaced3 = text2.replace(/hello/gi, "Hi");
console.log("Regex replace:", replaced3);

// ===== TRIMMING WHITESPACE =====

let messy = "   Hello World!   ";
console.log("\\nOriginal:", \`"\${messy}"\`);
console.log("trim():", \`"\${messy.trim()}"\`);
console.log("trimStart():", \`"\${messy.trimStart()}"\`);
console.log("trimEnd():", \`"\${messy.trimEnd()}"\`);

// ===== SPLITTING AND JOINING =====

// Split string into array
let csv = "apple,banana,orange,mango";
let fruits = csv.split(",");
console.log("\\nSplit by comma:", fruits);

let words = "Hello World JavaScript Programming".split(" ");
console.log("Split by space:", words);

// Split with limit
let limited = csv.split(",", 2);
console.log("Split with limit 2:", limited);

// Join array into string
let array = ["Hello", "World", "!"];
console.log("Joined with space:", array.join(" "));
console.log("Joined with -:", array.join("-"));

// ===== STRING COMPARISON =====

console.log("\\n===== String Comparison =====");
console.log("'a' < 'b':", 'a' < 'b');  // true
console.log("'abc' < 'abd':", 'abc' < 'abd');  // true
console.log("'10' < '2':", '10' < '2');  // true (string comparison!)

// Case-sensitive comparison
console.log("'Hello' === 'hello':", 'Hello' === 'hello');  // false

// ===== ESCAPE CHARACTERS =====

console.log("\\n===== Escape Characters =====");
console.log("New line:\\nSecond line");
console.log("Tab:\\tIndented");
console.log("Quote: \\"Hello\\"");
console.log("Backslash: \\\\");

// ===== PRACTICAL EXAMPLES =====

// 1. Email validation
console.log("\\n===== Email Validator =====");
function isValidEmail(email) {
  return email.includes("@") && email.includes(".");
}

console.log("test@email.com:", isValidEmail("test@email.com"));
console.log("invalid-email:", isValidEmail("invalid-email"));

// 2. Password strength checker
console.log("\\n===== Password Checker =====");
function checkPassword(password) {
  if (password.length < 8) return "Too short";
  if (!password.match(/[A-Z]/)) return "Need uppercase";
  if (!password.match(/[0-9]/)) return "Need number";
  return "Strong password";
}

console.log("pass:", checkPassword("pass"));
console.log("password:", checkPassword("password"));
console.log("Password1:", checkPassword("Password1"));

// 3. Title case converter
console.log("\\n===== Title Case =====");
function toTitleCase(str) {
  return str.split(' ').map(word => 
    word[0].toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
}

console.log(toTitleCase("hello world javascript"));

// 4. URL slug generator
console.log("\\n===== URL Slug =====");
function createSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

console.log(createSlug("My First Blog Post!"));
console.log(createSlug("  JavaScript & Web Development  "));`
            }
          }
        ]
      }
    ];

    // Create topics and content for Part 2
    for (const topicData of part2Topics) {
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

    console.log('\n=== Part 2 Seeding Completed! ===');
    console.log('Topics covered:');
    console.log('- Data Types');
    console.log('- Arrays');
    console.log('- Strings');
    
    console.log('\nNext: Run seed-unit1-part3.cjs for Functions, Methods & Objects');

  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

// Run the seeder
seedPart2();