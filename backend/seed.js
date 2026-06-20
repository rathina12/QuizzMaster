const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Quiz = require('./models/Quiz');
const Question = require('./models/Question');

const seedData = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/quizapp');
  console.log('Connected to MongoDB for seeding...');

  // Clear existing data
  await User.deleteMany({});
  await Quiz.deleteMany({});
  await Question.deleteMany({});

  // Create admin
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@quizapp.com',
    password: 'admin123',
    role: 'admin'
  });

  // Create sample users
  await User.create([
    { name: 'Alice Johnson', email: 'alice@example.com', password: 'password123' },
    { name: 'Bob Smith', email: 'bob@example.com', password: 'password123' },
    { name: 'Carol White', email: 'carol@example.com', password: 'password123' }
  ]);

  // Create quizzes
  const jsQuiz = await Quiz.create({
    title: 'JavaScript Fundamentals',
    description: 'Test your knowledge of JavaScript core concepts including variables, functions, closures, and ES6+ features.',
    category: 'JavaScript',
    duration: 20,
    totalMarks: 50,
    passingMarks: 20,
    negativeMarking: false,
    randomizeQuestions: true,
    isPublished: true,
    difficulty: 'Medium',
    tags: ['javascript', 'programming', 'web'],
    createdBy: admin._id,
    attemptCount: 42
  });

  const reactQuiz = await Quiz.create({
    title: 'React.js Deep Dive',
    description: 'Advanced React concepts covering hooks, state management, context API, and performance optimization.',
    category: 'React',
    duration: 25,
    totalMarks: 60,
    passingMarks: 24,
    negativeMarking: true,
    negativeMarkValue: 0.25,
    randomizeQuestions: true,
    isPublished: true,
    difficulty: 'Hard',
    tags: ['react', 'frontend', 'hooks'],
    createdBy: admin._id,
    attemptCount: 28
  });

  const dbQuiz = await Quiz.create({
    title: 'Database Essentials',
    description: 'Core database concepts including SQL, NoSQL, normalization, and query optimization.',
    category: 'Database',
    duration: 15,
    totalMarks: 40,
    passingMarks: 16,
    negativeMarking: false,
    isPublished: true,
    difficulty: 'Easy',
    tags: ['database', 'sql', 'mongodb'],
    createdBy: admin._id,
    attemptCount: 35
  });

  const aptitudeQuiz = await Quiz.create({
    title: 'Logical Reasoning & Aptitude',
    description: 'Sharpen your analytical and problem-solving skills with quantitative aptitude questions.',
    category: 'Aptitude',
    duration: 30,
    totalMarks: 50,
    passingMarks: 20,
    negativeMarking: true,
    negativeMarkValue: 0.5,
    isPublished: true,
    difficulty: 'Mixed',
    tags: ['aptitude', 'reasoning', 'math'],
    createdBy: admin._id,
    attemptCount: 55
  });

  const nodeQuiz = await Quiz.create({
    title: 'Node.js & Express Mastery',
    description: 'Backend development with Node.js, Express, middleware, REST APIs, and authentication.',
    category: 'Node.js',
    duration: 20,
    totalMarks: 50,
    passingMarks: 20,
    negativeMarking: false,
    isPublished: true,
    difficulty: 'Medium',
    tags: ['nodejs', 'express', 'backend'],
    createdBy: admin._id,
    attemptCount: 19
  });

  // JS Quiz Questions
  await Question.insertMany([
    { quizId: jsQuiz._id, question: 'What does `typeof null` return in JavaScript?', options: [{ text: 'null', label: 'A' }, { text: 'object', label: 'B' }, { text: 'undefined', label: 'C' }, { text: 'string', label: 'D' }], correctAnswer: 'B', marks: 5, difficulty: 'Easy', explanation: 'typeof null returns "object" — this is a well-known JavaScript bug that exists for legacy reasons.' },
    { quizId: jsQuiz._id, question: 'Which method creates a shallow copy of an array?', options: [{ text: 'array.clone()', label: 'A' }, { text: 'array.copy()', label: 'B' }, { text: '[...array]', label: 'C' }, { text: 'array.deepCopy()', label: 'D' }], correctAnswer: 'C', marks: 5, difficulty: 'Easy', explanation: 'Spread operator creates a shallow copy.' },
    { quizId: jsQuiz._id, question: 'What is a closure in JavaScript?', options: [{ text: 'A function that has access to its outer scope variables', label: 'A' }, { text: 'A function with no parameters', label: 'B' }, { text: 'An immediately invoked function', label: 'C' }, { text: 'A function returning undefined', label: 'D' }], correctAnswer: 'A', marks: 10, difficulty: 'Medium', explanation: 'A closure is a function that retains access to its lexical scope even after the outer function has finished executing.' },
    { quizId: jsQuiz._id, question: 'What is the output of `0 == "0"` in JavaScript?', options: [{ text: 'false', label: 'A' }, { text: 'true', label: 'B' }, { text: 'TypeError', label: 'C' }, { text: 'undefined', label: 'D' }], correctAnswer: 'B', marks: 5, difficulty: 'Medium', explanation: 'Loose equality (==) performs type coercion. "0" is converted to 0, so both sides are equal.' },
    { quizId: jsQuiz._id, question: 'Which ES6 feature allows destructuring of arrays?', options: [{ text: 'const [a, b] = arr', label: 'A' }, { text: 'const a = arr.get(0)', label: 'B' }, { text: 'const a = arr[first]', label: 'C' }, { text: 'const {a} = arr', label: 'D' }], correctAnswer: 'A', marks: 5, difficulty: 'Easy', explanation: 'Array destructuring uses square bracket syntax.' },
    { quizId: jsQuiz._id, question: 'What does the `Promise.all()` method do?', options: [{ text: 'Returns the first resolved promise', label: 'A' }, { text: 'Waits for all promises to resolve or any to reject', label: 'B' }, { text: 'Cancels all running promises', label: 'C' }, { text: 'Converts callbacks to promises', label: 'D' }], correctAnswer: 'B', marks: 10, difficulty: 'Hard', explanation: 'Promise.all() takes an array of promises and resolves when all resolve, or rejects if any reject.' },
    { quizId: jsQuiz._id, question: 'What is event delegation in JavaScript?', options: [{ text: 'Assigning multiple events to one element', label: 'A' }, { text: 'Using a parent element to handle events for its children', label: 'B' }, { text: 'Removing event listeners', label: 'C' }, { text: 'Creating custom events', label: 'D' }], correctAnswer: 'B', marks: 10, difficulty: 'Hard', explanation: 'Event delegation uses event bubbling to handle events at a parent level for child elements.' }
  ]);

  // React Quiz Questions
  await Question.insertMany([
    { quizId: reactQuiz._id, question: 'What hook is used to run side effects in React?', options: [{ text: 'useState', label: 'A' }, { text: 'useEffect', label: 'B' }, { text: 'useCallback', label: 'C' }, { text: 'useMemo', label: 'D' }], correctAnswer: 'B', marks: 5, difficulty: 'Easy', explanation: 'useEffect is used for side effects like data fetching, subscriptions, or DOM manipulation.' },
    { quizId: reactQuiz._id, question: 'What is the purpose of React keys?', options: [{ text: 'Styling list items', label: 'A' }, { text: 'Encrypting component data', label: 'B' }, { text: 'Helping React identify which items changed in lists', label: 'C' }, { text: 'Defining component methods', label: 'D' }], correctAnswer: 'C', marks: 5, difficulty: 'Easy', explanation: 'Keys help React identify which items have changed, been added, or removed for efficient re-rendering.' },
    { quizId: reactQuiz._id, question: 'What is the difference between useMemo and useCallback?', options: [{ text: 'There is no difference', label: 'A' }, { text: 'useMemo memoizes a value, useCallback memoizes a function', label: 'B' }, { text: 'useCallback memoizes a value, useMemo memoizes a function', label: 'C' }, { text: 'Both memoize DOM elements', label: 'D' }], correctAnswer: 'B', marks: 10, difficulty: 'Hard', explanation: 'useMemo returns a memoized value, useCallback returns a memoized function reference.' },
    { quizId: reactQuiz._id, question: 'What triggers a re-render in a React component?', options: [{ text: 'Only state changes', label: 'A' }, { text: 'State changes or props changes', label: 'B' }, { text: 'Only DOM events', label: 'C' }, { text: 'Only context changes', label: 'D' }], correctAnswer: 'B', marks: 10, difficulty: 'Medium', explanation: 'React components re-render when state or props change, or when their parent re-renders.' },
    { quizId: reactQuiz._id, question: 'What is React Context API used for?', options: [{ text: 'Making HTTP requests', label: 'A' }, { text: 'Routing between pages', label: 'B' }, { text: 'Sharing state across the component tree without prop drilling', label: 'C' }, { text: 'Optimizing rendering performance', label: 'D' }], correctAnswer: 'C', marks: 10, difficulty: 'Medium', explanation: 'Context API provides a way to pass data through the component tree without manually passing props.' },
    { quizId: reactQuiz._id, question: 'What does React.memo() do?', options: [{ text: 'Creates memoized state', label: 'A' }, { text: 'Prevents a component from re-rendering if props haven\'t changed', label: 'B' }, { text: 'Caches API responses', label: 'C' }, { text: 'Stores previous state values', label: 'D' }], correctAnswer: 'B', marks: 10, difficulty: 'Hard', explanation: 'React.memo is a HOC that skips re-rendering when props are shallowly equal.' },
    { quizId: reactQuiz._id, question: 'What is the correct way to update state that depends on previous state?', options: [{ text: 'setState(state + 1)', label: 'A' }, { text: 'setState(prev => prev + 1)', label: 'B' }, { text: 'state = state + 1', label: 'C' }, { text: 'setState({ value: state + 1 })', label: 'D' }], correctAnswer: 'B', marks: 10, difficulty: 'Medium', explanation: 'Using a function in setState ensures you get the latest state value, avoiding stale closure issues.' }
  ]);

  // DB Quiz Questions
  await Question.insertMany([
    { quizId: dbQuiz._id, question: 'What does ACID stand for in database transactions?', options: [{ text: 'Atomicity, Consistency, Isolation, Durability', label: 'A' }, { text: 'Access, Control, Index, Data', label: 'B' }, { text: 'Atomic, Computed, Integrated, Distributed', label: 'C' }, { text: 'Application, Cache, Index, Database', label: 'D' }], correctAnswer: 'A', marks: 10, difficulty: 'Medium', explanation: 'ACID properties ensure reliable database transactions.' },
    { quizId: dbQuiz._id, question: 'What is a primary key in a relational database?', options: [{ text: 'The first column in a table', label: 'A' }, { text: 'A unique identifier for each record', label: 'B' }, { text: 'A foreign key reference', label: 'C' }, { text: 'An indexed column', label: 'D' }], correctAnswer: 'B', marks: 5, difficulty: 'Easy', explanation: 'A primary key uniquely identifies each row in a table.' },
    { quizId: dbQuiz._id, question: 'Which MongoDB query finds documents where age is greater than 25?', options: [{ text: 'db.users.find({ age: { $gt: 25 } })', label: 'A' }, { text: 'db.users.find({ age > 25 })', label: 'B' }, { text: 'db.users.find({ age: 25+ })', label: 'C' }, { text: 'db.users.find({ age: greater(25) })', label: 'D' }], correctAnswer: 'A', marks: 10, difficulty: 'Medium', explanation: '$gt is the MongoDB query operator for "greater than".' },
    { quizId: dbQuiz._id, question: 'What is normalization in databases?', options: [{ text: 'Converting data to uppercase', label: 'A' }, { text: 'Organizing data to reduce redundancy and improve integrity', label: 'B' }, { text: 'Encrypting database columns', label: 'C' }, { text: 'Creating database backups', label: 'D' }], correctAnswer: 'B', marks: 5, difficulty: 'Easy', explanation: 'Normalization organizes data into tables to reduce redundancy and improve data integrity.' },
    { quizId: dbQuiz._id, question: 'What is an index in a database?', options: [{ text: 'A backup copy of data', label: 'A' }, { text: 'A data structure that improves query speed', label: 'B' }, { text: 'The first record in a table', label: 'C' }, { text: 'A foreign key constraint', label: 'D' }], correctAnswer: 'B', marks: 10, difficulty: 'Medium', explanation: 'Indexes speed up data retrieval at the cost of additional write operations and storage.' }
  ]);

  // Node.js Quiz Questions
  await Question.insertMany([
    { quizId: nodeQuiz._id, question: 'What is the event loop in Node.js?', options: [{ text: 'A loop for iterating arrays', label: 'A' }, { text: 'A mechanism that handles asynchronous callbacks', label: 'B' }, { text: 'A built-in timer function', label: 'C' }, { text: 'A method to create HTTP servers', label: 'D' }], correctAnswer: 'B', marks: 10, difficulty: 'Medium', explanation: 'The event loop allows Node.js to perform non-blocking I/O operations by offloading operations to the system kernel.' },
    { quizId: nodeQuiz._id, question: 'What does `process.env` provide in Node.js?', options: [{ text: 'Access to system processes', label: 'A' }, { text: 'Access to environment variables', label: 'B' }, { text: 'The Node.js version', label: 'C' }, { text: 'Memory usage statistics', label: 'D' }], correctAnswer: 'B', marks: 5, difficulty: 'Easy', explanation: 'process.env provides an object containing environment variables.' },
    { quizId: nodeQuiz._id, question: 'What is middleware in Express.js?', options: [{ text: 'A database connector', label: 'A' }, { text: 'Functions that execute during the request-response cycle', label: 'B' }, { text: 'A template engine', label: 'C' }, { text: 'A file upload handler', label: 'D' }], correctAnswer: 'B', marks: 10, difficulty: 'Medium', explanation: 'Middleware functions have access to request/response objects and can execute code, end the request, or call next().' },
    { quizId: nodeQuiz._id, question: 'Which HTTP method is used for updating a resource?', options: [{ text: 'GET', label: 'A' }, { text: 'POST', label: 'B' }, { text: 'PUT/PATCH', label: 'C' }, { text: 'DELETE', label: 'D' }], correctAnswer: 'C', marks: 5, difficulty: 'Easy', explanation: 'PUT replaces an entire resource; PATCH updates part of a resource.' },
    { quizId: nodeQuiz._id, question: 'What is JWT and what are its three parts?', options: [{ text: 'JSON Web Token — Header, Payload, Signature', label: 'A' }, { text: 'Java Web Tool — Key, Value, Hash', label: 'B' }, { text: 'JSON Web Transfer — Type, Data, Checksum', label: 'C' }, { text: 'JavaScript Widget Token — ID, Secret, Token', label: 'D' }], correctAnswer: 'A', marks: 10, difficulty: 'Hard', explanation: 'JWT consists of Base64URL encoded Header.Payload.Signature separated by dots.' },
    { quizId: nodeQuiz._id, question: 'What does `app.use(express.json())` do?', options: [{ text: 'Enables JSON file reading', label: 'A' }, { text: 'Parses incoming JSON request bodies', label: 'B' }, { text: 'Converts responses to JSON', label: 'C' }, { text: 'Validates JSON schemas', label: 'D' }], correctAnswer: 'B', marks: 10, difficulty: 'Easy', explanation: 'express.json() is a built-in middleware that parses JSON payloads in request bodies.' }
  ]);

  // Aptitude Quiz Questions
  await Question.insertMany([
    { quizId: aptitudeQuiz._id, question: 'If a train travels 60 km in 45 minutes, what is its speed in km/h?', options: [{ text: '75 km/h', label: 'A' }, { text: '80 km/h', label: 'B' }, { text: '90 km/h', label: 'C' }, { text: '72 km/h', label: 'D' }], correctAnswer: 'B', marks: 10, difficulty: 'Medium', explanation: 'Speed = Distance/Time = 60/(45/60) = 60 × 60/45 = 80 km/h' },
    { quizId: aptitudeQuiz._id, question: 'What is 15% of 240?', options: [{ text: '36', label: 'A' }, { text: '40', label: 'B' }, { text: '24', label: 'C' }, { text: '30', label: 'D' }], correctAnswer: 'A', marks: 5, difficulty: 'Easy', explanation: '15% of 240 = 0.15 × 240 = 36' },
    { quizId: aptitudeQuiz._id, question: 'Find the missing number: 2, 6, 12, 20, 30, ?', options: [{ text: '40', label: 'A' }, { text: '42', label: 'B' }, { text: '44', label: 'C' }, { text: '36', label: 'D' }], correctAnswer: 'B', marks: 10, difficulty: 'Medium', explanation: 'Pattern: n(n+1) → 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7=42' },
    { quizId: aptitudeQuiz._id, question: 'A can complete a work in 12 days, B in 15 days. How long working together?', options: [{ text: '6.67 days', label: 'A' }, { text: '7 days', label: 'B' }, { text: '8 days', label: 'C' }, { text: '5.5 days', label: 'D' }], correctAnswer: 'A', marks: 10, difficulty: 'Hard', explanation: 'Combined rate = 1/12 + 1/15 = 5/60 + 4/60 = 9/60 = 3/20. Days = 20/3 ≈ 6.67 days' },
    { quizId: aptitudeQuiz._id, question: 'If MANGO is coded as NBNHP, how is APPLE coded?', options: [{ text: 'BQQMF', label: 'A' }, { text: 'BQPMF', label: 'B' }, { text: 'BQQNF', label: 'C' }, { text: 'CQQMF', label: 'D' }], correctAnswer: 'A', marks: 15, difficulty: 'Hard', explanation: 'Each letter is shifted by +1 in the alphabet. A→B, P→Q, P→Q, L→M, E→F = BQQMF' }
  ]);

  // Update total marks for all quizzes
  const allQuizzes = [jsQuiz, reactQuiz, dbQuiz, aptitudeQuiz, nodeQuiz];
  for (const quiz of allQuizzes) {
    const questions = await Question.find({ quizId: quiz._id });
    const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
    await Quiz.findByIdAndUpdate(quiz._id, { totalMarks });
  }

  console.log('✅ Seed data created successfully!');
  console.log('Admin credentials: admin@quizapp.com / admin123');
  console.log('User credentials: alice@example.com / password123');
  process.exit(0);
};

seedData().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
