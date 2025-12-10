import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"
dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
	throw new Error(`Missing Supabase environment variables: URL: ${supabaseUrl}, KEY: ${supabaseKey}`)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Dummy users data with names
const dummyUsers = [
	{ email: "alice@example.com", password: "password123", name: "Alice", surname: "Johnson" },
	{ email: "bob@example.com", password: "password123", name: "Bob", surname: "Smith" },
	{ email: "charlie@example.com", password: "password123", name: "Charlie", surname: "Brown" },
	{ email: "diana@example.com", password: "password123", name: "Diana", surname: "Williams" },
	{ email: "eve@example.com", password: "password123", name: "Eve", surname: "Davis" },
	{ email: "k7au1@berehynia.pp.ua", password: "qwerty", name: "Admin", surname: "User" },
]

// Test templates with questions and answers
const testTemplates = [
	{
		title: "JavaScript Fundamentals",
		description: "Test your knowledge of JavaScript basics",
		questions: [
			{
				question_text: "What is the correct way to declare a variable in JavaScript?",
				order_index: 0,
				answers: [
					{ answer_text: "var x = 5;", is_correct: true },
					{ answer_text: "variable x = 5;", is_correct: false },
					{ answer_text: "v x = 5;", is_correct: false },
					{ answer_text: "x := 5;", is_correct: false },
				],
			},
			{
				question_text: "Which method is used to add an element to the end of an array?",
				order_index: 1,
				answers: [
					{ answer_text: "push()", is_correct: true },
					{ answer_text: "pop()", is_correct: false },
					{ answer_text: "shift()", is_correct: false },
					{ answer_text: "unshift()", is_correct: false },
				],
			},
			{
				question_text: "What does '===' mean in JavaScript?",
				order_index: 2,
				answers: [
					{ answer_text: "Strict equality", is_correct: true },
					{ answer_text: "Assignment", is_correct: false },
					{ answer_text: "Loose equality", is_correct: false },
					{ answer_text: "Not equal", is_correct: false },
				],
			},
		],
	},
	{
		title: "React Basics",
		description: "Test your React knowledge",
		questions: [
			{
				question_text: "What is JSX?",
				order_index: 0,
				answers: [
					{ answer_text: "JavaScript XML", is_correct: true },
					{ answer_text: "Java Syntax Extension", is_correct: false },
					{ answer_text: "JavaScript Extension", is_correct: false },
					{ answer_text: "Just Syntax", is_correct: false },
				],
			},
			{
				question_text: "Which hook is used for side effects?",
				order_index: 1,
				answers: [
					{ answer_text: "useEffect", is_correct: true },
					{ answer_text: "useState", is_correct: false },
					{ answer_text: "useContext", is_correct: false },
					{ answer_text: "useReducer", is_correct: false },
				],
			},
			{
				question_text: "What is the purpose of keys in React lists?",
				order_index: 2,
				answers: [
					{ answer_text: "To help React identify which items changed", is_correct: true },
					{ answer_text: "To style elements", is_correct: false },
					{ answer_text: "To add event handlers", is_correct: false },
					{ answer_text: "To create unique IDs", is_correct: false },
				],
			},
		],
	},
	{
		title: "TypeScript Essentials",
		description: "Learn TypeScript fundamentals",
		questions: [
			{
				question_text: "What is TypeScript?",
				order_index: 0,
				answers: [
					{ answer_text: "A typed superset of JavaScript", is_correct: true },
					{ answer_text: "A new programming language", is_correct: false },
					{ answer_text: "A JavaScript framework", is_correct: false },
					{ answer_text: "A database language", is_correct: false },
				],
			},
			{
				question_text: "How do you define a type in TypeScript?",
				order_index: 1,
				answers: [
					{ answer_text: "type MyType = { ... }", is_correct: true },
					{ answer_text: "def MyType = { ... }", is_correct: false },
					{ answer_text: "class MyType = { ... }", is_correct: false },
					{ answer_text: "var MyType = { ... }", is_correct: false },
				],
			},
		],
	},
	{
		title: "Web Development Basics",
		description: "General web development knowledge",
		questions: [
			{
				question_text: "What does HTML stand for?",
				order_index: 0,
				answers: [
					{ answer_text: "HyperText Markup Language", is_correct: true },
					{ answer_text: "High Tech Modern Language", is_correct: false },
					{ answer_text: "Hyperlink Text Markup Language", is_correct: false },
					{ answer_text: "Home Tool Markup Language", is_correct: false },
				],
			},
			{
				question_text: "What does CSS stand for?",
				order_index: 1,
				answers: [
					{ answer_text: "Cascading Style Sheets", is_correct: true },
					{ answer_text: "Computer Style Sheets", is_correct: false },
					{ answer_text: "Creative Style System", is_correct: false },
					{ answer_text: "Colorful Style Sheets", is_correct: false },
				],
			},
			{
				question_text: "What is the purpose of HTTP?",
				order_index: 2,
				answers: [
					{ answer_text: "To transfer data over the web", is_correct: true },
					{ answer_text: "To style web pages", is_correct: false },
					{ answer_text: "To create databases", is_correct: false },
					{ answer_text: "To write JavaScript", is_correct: false },
				],
			},
		],
	},
	{
		title: "Node.js Fundamentals",
		description: "Test your Node.js knowledge",
		questions: [
			{
				question_text: "What is Node.js?",
				order_index: 0,
				answers: [
					{ answer_text: "A JavaScript runtime built on Chrome's V8 engine", is_correct: true },
					{ answer_text: "A JavaScript framework", is_correct: false },
					{ answer_text: "A database system", is_correct: false },
					{ answer_text: "A text editor", is_correct: false },
				],
			},
			{
				question_text: "What is npm?",
				order_index: 1,
				answers: [
					{ answer_text: "Node Package Manager", is_correct: true },
					{ answer_text: "Node Program Manager", is_correct: false },
					{ answer_text: "Network Package Manager", is_correct: false },
					{ answer_text: "New Project Manager", is_correct: false },
				],
			},
		],
	},
	{
		title: "Python Basics",
		description: "Test your Python programming fundamentals",
		questions: [
			{
				question_text: "Which of the following is the correct way to create a list in Python?",
				order_index: 0,
				answers: [
					{ answer_text: "my_list = [1, 2, 3]", is_correct: true },
					{ answer_text: "my_list = (1, 2, 3)", is_correct: false },
					{ answer_text: "my_list = {1, 2, 3}", is_correct: false },
					{ answer_text: "my_list = <1, 2, 3>", is_correct: false },
				],
			},
			{
				question_text: "What is the output of: print(2 ** 3)?",
				order_index: 1,
				answers: [
					{ answer_text: "8", is_correct: true },
					{ answer_text: "6", is_correct: false },
					{ answer_text: "9", is_correct: false },
					{ answer_text: "5", is_correct: false },
				],
			},
			{
				question_text: "Which keyword is used to define a function in Python?",
				order_index: 2,
				answers: [
					{ answer_text: "def", is_correct: true },
					{ answer_text: "function", is_correct: false },
					{ answer_text: "func", is_correct: false },
					{ answer_text: "define", is_correct: false },
				],
			},
			{
				question_text: "What does len() function do in Python?",
				order_index: 3,
				answers: [
					{ answer_text: "Returns the length of an object", is_correct: true },
					{ answer_text: "Returns the maximum value", is_correct: false },
					{ answer_text: "Returns the minimum value", is_correct: false },
					{ answer_text: "Returns the sum of elements", is_correct: false },
				],
			},
		],
	},
	{
		title: "Database Fundamentals",
		description: "Test your knowledge of database concepts",
		questions: [
			{
				question_text: "What does SQL stand for?",
				order_index: 0,
				answers: [
					{ answer_text: "Structured Query Language", is_correct: true },
					{ answer_text: "Simple Query Language", is_correct: false },
					{ answer_text: "Standard Query Language", is_correct: false },
					{ answer_text: "System Query Language", is_correct: false },
				],
			},
			{
				question_text: "Which SQL command is used to retrieve data from a database?",
				order_index: 1,
				answers: [
					{ answer_text: "SELECT", is_correct: true },
					{ answer_text: "GET", is_correct: false },
					{ answer_text: "RETRIEVE", is_correct: false },
					{ answer_text: "FETCH", is_correct: false },
				],
			},
			{
				question_text: "What is a primary key?",
				order_index: 2,
				answers: [
					{ answer_text: "A unique identifier for each record in a table", is_correct: true },
					{ answer_text: "A foreign key reference", is_correct: false },
					{ answer_text: "A column that can be null", is_correct: false },
					{ answer_text: "A temporary key", is_correct: false },
				],
			},
			{
				question_text: "Which SQL clause is used to filter records?",
				order_index: 3,
				answers: [
					{ answer_text: "WHERE", is_correct: true },
					{ answer_text: "FILTER", is_correct: false },
					{ answer_text: "CONDITION", is_correct: false },
					{ answer_text: "IF", is_correct: false },
				],
			},
		],
	},
	{
		title: "Git Version Control",
		description: "Test your Git and version control knowledge",
		questions: [
			{
				question_text: "What command is used to initialize a new Git repository?",
				order_index: 0,
				answers: [
					{ answer_text: "git init", is_correct: true },
					{ answer_text: "git start", is_correct: false },
					{ answer_text: "git create", is_correct: false },
					{ answer_text: "git new", is_correct: false },
				],
			},
			{
				question_text: "What command stages files for commit?",
				order_index: 1,
				answers: [
					{ answer_text: "git add", is_correct: true },
					{ answer_text: "git stage", is_correct: false },
					{ answer_text: "git commit", is_correct: false },
					{ answer_text: "git save", is_correct: false },
				],
			},
			{
				question_text: "What does 'git commit' do?",
				order_index: 2,
				answers: [
					{ answer_text: "Saves changes to the local repository", is_correct: true },
					{ answer_text: "Pushes changes to remote", is_correct: false },
					{ answer_text: "Creates a new branch", is_correct: false },
					{ answer_text: "Deletes files", is_correct: false },
				],
			},
			{
				question_text: "What command is used to push changes to a remote repository?",
				order_index: 3,
				answers: [
					{ answer_text: "git push", is_correct: true },
					{ answer_text: "git upload", is_correct: false },
					{ answer_text: "git send", is_correct: false },
					{ answer_text: "git publish", is_correct: false },
				],
			},
		],
	},
	{
		title: "CSS Styling",
		description: "Test your CSS knowledge",
		questions: [
			{
				question_text: "Which property is used to change the text color?",
				order_index: 0,
				answers: [
					{ answer_text: "color", is_correct: true },
					{ answer_text: "text-color", is_correct: false },
					{ answer_text: "font-color", is_correct: false },
					{ answer_text: "text-style", is_correct: false },
				],
			},
			{
				question_text: "Which property is used to set the background color?",
				order_index: 1,
				answers: [
					{ answer_text: "background-color", is_correct: true },
					{ answer_text: "bg-color", is_correct: false },
					{ answer_text: "color-background", is_correct: false },
					{ answer_text: "background", is_correct: false },
				],
			},
			{
				question_text: "What does 'display: flex' do?",
				order_index: 2,
				answers: [
					{ answer_text: "Creates a flexible container", is_correct: true },
					{ answer_text: "Hides the element", is_correct: false },
					{ answer_text: "Makes text bold", is_correct: false },
					{ answer_text: "Changes font size", is_correct: false },
				],
			},
			{
				question_text: "Which selector targets an element with id 'header'?",
				order_index: 3,
				answers: [
					{ answer_text: "#header", is_correct: true },
					{ answer_text: ".header", is_correct: false },
					{ answer_text: "header", is_correct: false },
					{ answer_text: "*header", is_correct: false },
				],
			},
		],
	},
	{
		title: "HTML Basics",
		description: "Test your HTML fundamentals",
		questions: [
			{
				question_text: "What does HTML stand for?",
				order_index: 0,
				answers: [
					{ answer_text: "HyperText Markup Language", is_correct: true },
					{ answer_text: "High Tech Modern Language", is_correct: false },
					{ answer_text: "Hyperlink Text Markup Language", is_correct: false },
					{ answer_text: "Home Tool Markup Language", is_correct: false },
				],
			},
			{
				question_text: "Which tag is used to create a hyperlink?",
				order_index: 1,
				answers: [
					{ answer_text: "<a>", is_correct: true },
					{ answer_text: "<link>", is_correct: false },
					{ answer_text: "<href>", is_correct: false },
					{ answer_text: "<url>", is_correct: false },
				],
			},
			{
				question_text: "Which tag is used to create an ordered list?",
				order_index: 2,
				answers: [
					{ answer_text: "<ol>", is_correct: true },
					{ answer_text: "<ul>", is_correct: false },
					{ answer_text: "<list>", is_correct: false },
					{ answer_text: "<li>", is_correct: false },
				],
			},
			{
				question_text: "What is the correct HTML5 document structure?",
				order_index: 3,
				answers: [
					{ answer_text: "<!DOCTYPE html><html><head><body>", is_correct: true },
					{ answer_text: "<html><head><body>", is_correct: false },
					{ answer_text: "<DOCTYPE html><head><body>", is_correct: false },
					{ answer_text: "<html><body>", is_correct: false },
				],
			},
		],
	},
	{
		title: "JavaScript Advanced",
		description: "Advanced JavaScript concepts",
		questions: [
			{
				question_text: "What is a closure in JavaScript?",
				order_index: 0,
				answers: [
					{ answer_text: "A function that has access to variables in its outer scope", is_correct: true },
					{ answer_text: "A way to close a file", is_correct: false },
					{ answer_text: "A type of loop", is_correct: false },
					{ answer_text: "A method to hide code", is_correct: false },
				],
			},
			{
				question_text: "What does 'this' refer to in JavaScript?",
				order_index: 1,
				answers: [
					{ answer_text: "The object that owns the function", is_correct: true },
					{ answer_text: "The current function", is_correct: false },
					{ answer_text: "The global object always", is_correct: false },
					{ answer_text: "The parent element", is_correct: false },
				],
			},
			{
				question_text: "What is the difference between 'let' and 'var'?",
				order_index: 2,
				answers: [
					{ answer_text: "'let' is block-scoped, 'var' is function-scoped", is_correct: true },
					{ answer_text: "No difference", is_correct: false },
					{ answer_text: "'var' is newer", is_correct: false },
					{ answer_text: "'let' can only be used in loops", is_correct: false },
				],
			},
			{
				question_text: "What is a Promise in JavaScript?",
				order_index: 3,
				answers: [
					{ answer_text: "An object representing eventual completion of an async operation", is_correct: true },
					{ answer_text: "A type of variable", is_correct: false },
					{ answer_text: "A function declaration", is_correct: false },
					{ answer_text: "A way to import modules", is_correct: false },
				],
			},
		],
	},
	{
		title: "React Hooks",
		description: "Test your knowledge of React Hooks",
		questions: [
			{
				question_text: "Which hook is used to manage state in functional components?",
				order_index: 0,
				answers: [
					{ answer_text: "useState", is_correct: true },
					{ answer_text: "useEffect", is_correct: false },
					{ answer_text: "useContext", is_correct: false },
					{ answer_text: "useReducer", is_correct: false },
				],
			},
			{
				question_text: "What does useEffect hook do?",
				order_index: 1,
				answers: [
					{ answer_text: "Performs side effects in functional components", is_correct: true },
					{ answer_text: "Manages component state", is_correct: false },
					{ answer_text: "Creates context", is_correct: false },
					{ answer_text: "Handles events", is_correct: false },
				],
			},
			{
				question_text: "When does useEffect run by default?",
				order_index: 2,
				answers: [
					{ answer_text: "After every render", is_correct: true },
					{ answer_text: "Only once on mount", is_correct: false },
					{ answer_text: "Only when props change", is_correct: false },
					{ answer_text: "Never", is_correct: false },
				],
			},
			{
				question_text: "What is the purpose of useMemo hook?",
				order_index: 3,
				answers: [
					{ answer_text: "Memoizes expensive calculations", is_correct: true },
					{ answer_text: "Manages memory", is_correct: false },
					{ answer_text: "Creates memo components", is_correct: false },
					{ answer_text: "Stores data permanently", is_correct: false },
				],
			},
		],
	},
	{
		title: "TypeScript Advanced",
		description: "Advanced TypeScript concepts",
		questions: [
			{
				question_text: "What is a generic in TypeScript?",
				order_index: 0,
				answers: [
					{ answer_text: "A type that works with multiple types", is_correct: true },
					{ answer_text: "A specific type", is_correct: false },
					{ answer_text: "A function type", is_correct: false },
					{ answer_text: "A class type", is_correct: false },
				],
			},
			{
				question_text: "What is the difference between 'interface' and 'type'?",
				order_index: 1,
				answers: [
					{ answer_text: "Interfaces can be extended, types can use unions", is_correct: true },
					{ answer_text: "No difference", is_correct: false },
					{ answer_text: "Types are faster", is_correct: false },
					{ answer_text: "Interfaces are deprecated", is_correct: false },
				],
			},
			{
				question_text: "What does 'as const' do in TypeScript?",
				order_index: 2,
				answers: [
					{ answer_text: "Makes a value readonly and narrows its type", is_correct: true },
					{ answer_text: "Creates a constant", is_correct: false },
					{ answer_text: "Converts to string", is_correct: false },
					{ answer_text: "Makes it immutable", is_correct: false },
				],
			},
			{
				question_text: "What is a union type?",
				order_index: 3,
				answers: [
					{ answer_text: "A type that can be one of several types", is_correct: true },
					{ answer_text: "A type that combines multiple types", is_correct: false },
					{ answer_text: "A type for unions", is_correct: false },
					{ answer_text: "A deprecated type", is_correct: false },
				],
			},
		],
	},
	{
		title: "REST API Concepts",
		description: "Test your REST API knowledge",
		questions: [
			{
				question_text: "What does REST stand for?",
				order_index: 0,
				answers: [
					{ answer_text: "Representational State Transfer", is_correct: true },
					{ answer_text: "Remote State Transfer", is_correct: false },
					{ answer_text: "Representative State Transfer", is_correct: false },
					{ answer_text: "Resource State Transfer", is_correct: false },
				],
			},
			{
				question_text: "Which HTTP method is used to create a new resource?",
				order_index: 1,
				answers: [
					{ answer_text: "POST", is_correct: true },
					{ answer_text: "GET", is_correct: false },
					{ answer_text: "PUT", is_correct: false },
					{ answer_text: "DELETE", is_correct: false },
				],
			},
			{
				question_text: "Which HTTP method is used to retrieve data?",
				order_index: 2,
				answers: [
					{ answer_text: "GET", is_correct: true },
					{ answer_text: "POST", is_correct: false },
					{ answer_text: "PUT", is_correct: false },
					{ answer_text: "PATCH", is_correct: false },
				],
			},
			{
				question_text: "What HTTP status code indicates success?",
				order_index: 3,
				answers: [
					{ answer_text: "200", is_correct: true },
					{ answer_text: "404", is_correct: false },
					{ answer_text: "500", is_correct: false },
					{ answer_text: "300", is_correct: false },
				],
			},
		],
	},
	{
		title: "Linux Commands",
		description: "Test your Linux command line knowledge",
		questions: [
			{
				question_text: "Which command lists files in a directory?",
				order_index: 0,
				answers: [
					{ answer_text: "ls", is_correct: true },
					{ answer_text: "list", is_correct: false },
					{ answer_text: "dir", is_correct: false },
					{ answer_text: "show", is_correct: false },
				],
			},
			{
				question_text: "Which command changes directory?",
				order_index: 1,
				answers: [
					{ answer_text: "cd", is_correct: true },
					{ answer_text: "change", is_correct: false },
					{ answer_text: "dir", is_correct: false },
					{ answer_text: "move", is_correct: false },
				],
			},
			{
				question_text: "Which command displays file contents?",
				order_index: 2,
				answers: [
					{ answer_text: "cat", is_correct: true },
					{ answer_text: "read", is_correct: false },
					{ answer_text: "show", is_correct: false },
					{ answer_text: "display", is_correct: false },
				],
			},
			{
				question_text: "Which command creates a new directory?",
				order_index: 3,
				answers: [
					{ answer_text: "mkdir", is_correct: true },
					{ answer_text: "makedir", is_correct: false },
					{ answer_text: "newdir", is_correct: false },
					{ answer_text: "createdir", is_correct: false },
				],
			},
		],
	},
	{
		title: "Docker Basics",
		description: "Test your Docker knowledge",
		questions: [
			{
				question_text: "What is Docker?",
				order_index: 0,
				answers: [
					{ answer_text: "A containerization platform", is_correct: true },
					{ answer_text: "A programming language", is_correct: false },
					{ answer_text: "A database system", is_correct: false },
					{ answer_text: "A web framework", is_correct: false },
				],
			},
			{
				question_text: "What is a Docker image?",
				order_index: 1,
				answers: [
					{ answer_text: "A template for creating containers", is_correct: true },
					{ answer_text: "A running container", is_correct: false },
					{ answer_text: "A Docker command", is_correct: false },
					{ answer_text: "A network configuration", is_correct: false },
				],
			},
			{
				question_text: "Which command builds a Docker image?",
				order_index: 2,
				answers: [
					{ answer_text: "docker build", is_correct: true },
					{ answer_text: "docker create", is_correct: false },
					{ answer_text: "docker make", is_correct: false },
					{ answer_text: "docker compile", is_correct: false },
				],
			},
			{
				question_text: "Which command runs a Docker container?",
				order_index: 3,
				answers: [
					{ answer_text: "docker run", is_correct: true },
					{ answer_text: "docker start", is_correct: false },
					{ answer_text: "docker execute", is_correct: false },
					{ answer_text: "docker launch", is_correct: false },
				],
			},
		],
	},
	{
		title: "Computer Science Fundamentals",
		description: "Basic computer science concepts",
		questions: [
			{
				question_text: "What is the time complexity of binary search?",
				order_index: 0,
				answers: [
					{ answer_text: "O(log n)", is_correct: true },
					{ answer_text: "O(n)", is_correct: false },
					{ answer_text: "O(n log n)", is_correct: false },
					{ answer_text: "O(1)", is_correct: false },
				],
			},
			{
				question_text: "What is a stack data structure?",
				order_index: 1,
				answers: [
					{ answer_text: "LIFO (Last In First Out)", is_correct: true },
					{ answer_text: "FIFO (First In First Out)", is_correct: false },
					{ answer_text: "Random access", is_correct: false },
					{ answer_text: "Sorted order", is_correct: false },
				],
			},
			{
				question_text: "What is a queue data structure?",
				order_index: 2,
				answers: [
					{ answer_text: "FIFO (First In First Out)", is_correct: true },
					{ answer_text: "LIFO (Last In First Out)", is_correct: false },
					{ answer_text: "Random access", is_correct: false },
					{ answer_text: "Sorted order", is_correct: false },
				],
			},
			{
				question_text: "What does 'Big O' notation describe?",
				order_index: 3,
				answers: [
					{ answer_text: "Time and space complexity", is_correct: true },
					{ answer_text: "Code size", is_correct: false },
					{ answer_text: "Variable names", is_correct: false },
					{ answer_text: "File size", is_correct: false },
				],
			},
		],
	},
	{
		title: "Security Basics",
		description: "Test your cybersecurity knowledge",
		questions: [
			{
				question_text: "What does HTTPS stand for?",
				order_index: 0,
				answers: [
					{ answer_text: "HyperText Transfer Protocol Secure", is_correct: true },
					{ answer_text: "HyperText Transfer Protocol Standard", is_correct: false },
					{ answer_text: "High Transfer Protocol Secure", is_correct: false },
					{ answer_text: "HyperText Transfer Protocol System", is_correct: false },
				],
			},
			{
				question_text: "What is SQL injection?",
				order_index: 1,
				answers: [
					{ answer_text: "A code injection technique", is_correct: true },
					{ answer_text: "A database query", is_correct: false },
					{ answer_text: "A type of encryption", is_correct: false },
					{ answer_text: "A backup method", is_correct: false },
				],
			},
			{
				question_text: "What is XSS?",
				order_index: 2,
				answers: [
					{ answer_text: "Cross-Site Scripting", is_correct: true },
					{ answer_text: "Cross-Site Security", is_correct: false },
					{ answer_text: "Extended Style Sheet", is_correct: false },
					{ answer_text: "XML Style Sheet", is_correct: false },
				],
			},
			{
				question_text: "What is the purpose of hashing passwords?",
				order_index: 3,
				answers: [
					{ answer_text: "To securely store passwords", is_correct: true },
					{ answer_text: "To compress passwords", is_correct: false },
					{ answer_text: "To encrypt passwords", is_correct: false },
					{ answer_text: "To validate passwords", is_correct: false },
				],
			},
		],
	},
	{
		title: "Next.js Framework",
		description: "Test your Next.js knowledge",
		questions: [
			{
				question_text: "What is Next.js?",
				order_index: 0,
				answers: [
					{ answer_text: "A React framework for production", is_correct: true },
					{ answer_text: "A database system", is_correct: false },
					{ answer_text: "A CSS framework", is_correct: false },
					{ answer_text: "A testing library", is_correct: false },
				],
			},
			{
				question_text: "What is Server-Side Rendering (SSR)?",
				order_index: 1,
				answers: [
					{ answer_text: "Rendering pages on the server", is_correct: true },
					{ answer_text: "Rendering only on client", is_correct: false },
					{ answer_text: "A database feature", is_correct: false },
					{ answer_text: "A CSS technique", is_correct: false },
				],
			},
			{
				question_text: "What is Static Site Generation (SSG)?",
				order_index: 2,
				answers: [
					{ answer_text: "Pre-rendering pages at build time", is_correct: true },
					{ answer_text: "Dynamic rendering", is_correct: false },
					{ answer_text: "Server rendering", is_correct: false },
					{ answer_text: "Client-side only", is_correct: false },
				],
			},
			{
				question_text: "What file is used for API routes in Next.js?",
				order_index: 3,
				answers: [
					{ answer_text: "route.ts or route.js", is_correct: true },
					{ answer_text: "api.ts", is_correct: false },
					{ answer_text: "server.ts", is_correct: false },
					{ answer_text: "endpoint.ts", is_correct: false },
				],
			},
		],
	},
]

async function createUser(email: string, password: string, name?: string, surname?: string) {
	const { data, error } = await supabase.auth.admin.createUser({
		email,
		password,
		email_confirm: true,
	})

	if (error) {
		console.error(`Error creating user ${email}:`, error)
		return null
	}

	console.log(`User created: ${email} (${data.user.id})`)

	// Create profile with name
	if (name || surname) {
		const { error: profileError } = await supabase.from("profiles").insert({
			user_id: data.user.id,
			name: name || null,
			surname: surname || null,
		})

		if (profileError) {
			console.error(`Error creating profile for ${email}:`, profileError)
		} else {
			console.log(`Profile created for ${email} with name: ${name || ""} ${surname || ""}`)
		}
	}

	return data.user
}

async function createTest(userId: string, template: typeof testTemplates[0]) {
	const { data: test, error: testError } = await supabase
		.from("tests")
		.insert({
			title: template.title,
			description: template.description,
			author_id: userId,
		})
		.select()
		.single()

	if (testError) {
		console.error(`Error creating test ${template.title}:`, testError)
		return null
	}

	console.log(`Test created: ${template.title} (${test.id})`)

	// Create questions and answers
	for (const questionTemplate of template.questions) {
		const { data: question, error: questionError } = await supabase
			.from("questions")
			.insert({
				question_text: questionTemplate.question_text,
				order_index: questionTemplate.order_index,
				test_id: test.id,
			})
			.select()
			.single()

		if (questionError) {
			console.error(`Error creating question:`, questionError)
			continue
		}

		// Create answers for this question
		for (const answerTemplate of questionTemplate.answers) {
			const { error: answerError } = await supabase.from("answers").insert({
				answer_text: answerTemplate.answer_text,
				is_correct: answerTemplate.is_correct,
				question_id: question.id,
			})

			if (answerError) {
				console.error(`Error creating answer:`, answerError)
			}
		}

		console.log(`  Question created: ${questionTemplate.question_text}`)
	}

	return test
}

async function seedDatabase() {
	console.log("Starting database seeding...\n")

	// Create users
	const users = []
	for (const userData of dummyUsers) {
		const user = await createUser(
			userData.email,
			userData.password,
			userData.name,
			userData.surname,
		)
		if (user) {
			users.push(user)
		}
	}

	if (users.length === 0) {
		console.error("No users were created. Aborting seeding.")
		return
	}

	console.log(`\nCreated ${users.length} users\n`)

	// Create tests for each user
	let totalTests = 0
	for (let i = 0; i < users.length; i++) {
		const user = users[i]
		// Each user gets 2-3 random tests
		const testsPerUser = Math.floor(Math.random() * 2) + 2
		const shuffledTemplates = [...testTemplates].sort(() => Math.random() - 0.5)

		for (let j = 0; j < testsPerUser && j < shuffledTemplates.length; j++) {
			const template = shuffledTemplates[j]
			const test = await createTest(user.id, template)
			if (test) {
				totalTests++
			}
		}
		console.log(`\nCreated tests for user ${user.email}\n`)
	}

	console.log(`\n✅ Seeding completed!`)
	console.log(`   - Users created: ${users.length}`)
	console.log(`   - Tests created: ${totalTests}`)
}

seedDatabase()
	.then(() => {
		console.log("\nSeeding script finished.")
		process.exit(0)
	})
	.catch(error => {
		console.error("Error during seeding:", error)
		process.exit(1)
	})

