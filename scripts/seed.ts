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
	{
		title: "JavaScript Variables",
		description: "Understanding JavaScript variable declarations",
		questions: [
			{
				question_text: "What is the difference between 'const' and 'let'?",
				order_index: 0,
				answers: [
					{ answer_text: "'const' cannot be reassigned, 'let' can", is_correct: true },
					{ answer_text: "No difference", is_correct: false },
					{ answer_text: "'let' is for constants", is_correct: false },
					{ answer_text: "'const' is deprecated", is_correct: false },
				],
			},
			{
				question_text: "Which keyword creates a block-scoped variable?",
				order_index: 1,
				answers: [
					{ answer_text: "let or const", is_correct: true },
					{ answer_text: "var", is_correct: false },
					{ answer_text: "variable", is_correct: false },
					{ answer_text: "def", is_correct: false },
				],
			},
		],
	},
	{
		title: "Array Methods",
		description: "JavaScript array manipulation",
		questions: [
			{
				question_text: "Which method removes the last element from an array?",
				order_index: 0,
				answers: [
					{ answer_text: "pop()", is_correct: true },
					{ answer_text: "push()", is_correct: false },
					{ answer_text: "shift()", is_correct: false },
					{ answer_text: "unshift()", is_correct: false },
				],
			},
		],
	},
	{
		title: "React Components",
		description: "React component basics",
		questions: [
			{
				question_text: "What is a React component?",
				order_index: 0,
				answers: [
					{ answer_text: "A reusable piece of UI", is_correct: true },
					{ answer_text: "A database table", is_correct: false },
					{ answer_text: "A CSS class", is_correct: false },
					{ answer_text: "A JavaScript library", is_correct: false },
				],
			},
			{
				question_text: "What is the default export for a React component?",
				order_index: 1,
				answers: [
					{ answer_text: "A function or class", is_correct: true },
					{ answer_text: "A string", is_correct: false },
					{ answer_text: "A number", is_correct: false },
					{ answer_text: "An object", is_correct: false },
				],
			},
		],
	},
	{
		title: "Python Lists",
		description: "Python list operations",
		questions: [
			{
				question_text: "How do you add an item to a Python list?",
				order_index: 0,
				answers: [
					{ answer_text: "list.append(item)", is_correct: true },
					{ answer_text: "list.add(item)", is_correct: false },
					{ answer_text: "list.insert(item)", is_correct: false },
					{ answer_text: "list.push(item)", is_correct: false },
				],
			},
		],
	},
	{
		title: "SQL Basics",
		description: "Basic SQL commands",
		questions: [
			{
				question_text: "Which SQL command updates data?",
				order_index: 0,
				answers: [
					{ answer_text: "UPDATE", is_correct: true },
					{ answer_text: "CHANGE", is_correct: false },
					{ answer_text: "MODIFY", is_correct: false },
					{ answer_text: "ALTER", is_correct: false },
				],
			},
			{
				question_text: "Which SQL command deletes data?",
				order_index: 1,
				answers: [
					{ answer_text: "DELETE", is_correct: true },
					{ answer_text: "REMOVE", is_correct: false },
					{ answer_text: "DROP", is_correct: false },
					{ answer_text: "CLEAR", is_correct: false },
				],
			},
		],
	},
	{
		title: "Git Branches",
		description: "Working with Git branches",
		questions: [
			{
				question_text: "What command creates a new branch?",
				order_index: 0,
				answers: [
					{ answer_text: "git branch <name>", is_correct: true },
					{ answer_text: "git create <name>", is_correct: false },
					{ answer_text: "git new <name>", is_correct: false },
					{ answer_text: "git add-branch <name>", is_correct: false },
				],
			},
		],
	},
	{
		title: "CSS Selectors",
		description: "CSS selector types",
		questions: [
			{
				question_text: "Which selector targets a class?",
				order_index: 0,
				answers: [
					{ answer_text: ".classname", is_correct: true },
					{ answer_text: "#classname", is_correct: false },
					{ answer_text: "@classname", is_correct: false },
					{ answer_text: "*classname", is_correct: false },
				],
			},
			{
				question_text: "Which selector targets all elements?",
				order_index: 1,
				answers: [
					{ answer_text: "*", is_correct: true },
					{ answer_text: "all", is_correct: false },
					{ answer_text: ".", is_correct: false },
					{ answer_text: "#", is_correct: false },
				],
			},
		],
	},
	{
		title: "HTML Forms",
		description: "HTML form elements",
		questions: [
			{
				question_text: "Which tag creates a form?",
				order_index: 0,
				answers: [
					{ answer_text: "<form>", is_correct: true },
					{ answer_text: "<input>", is_correct: false },
					{ answer_text: "<fieldset>", is_correct: false },
					{ answer_text: "<div>", is_correct: false },
				],
			},
		],
	},
	{
		title: "JavaScript Functions",
		description: "Function declarations and expressions",
		questions: [
			{
				question_text: "What is an arrow function?",
				order_index: 0,
				answers: [
					{ answer_text: "A shorter syntax for writing functions", is_correct: true },
					{ answer_text: "A type of loop", is_correct: false },
					{ answer_text: "A database query", is_correct: false },
					{ answer_text: "A CSS property", is_correct: false },
				],
			},
			{
				question_text: "How do you call a function?",
				order_index: 1,
				answers: [
					{ answer_text: "functionName()", is_correct: true },
					{ answer_text: "call functionName", is_correct: false },
					{ answer_text: "functionName.call", is_correct: false },
					{ answer_text: "execute functionName", is_correct: false },
				],
			},
		],
	},
	{
		title: "React Props",
		description: "Understanding React props",
		questions: [
			{
				question_text: "What are props in React?",
				order_index: 0,
				answers: [
					{ answer_text: "Data passed to components", is_correct: true },
					{ answer_text: "CSS properties", is_correct: false },
					{ answer_text: "Database queries", is_correct: false },
					{ answer_text: "Event handlers", is_correct: false },
				],
			},
		],
	},
	{
		title: "TypeScript Types",
		description: "Basic TypeScript types",
		questions: [
			{
				question_text: "How do you declare a variable with a type?",
				order_index: 0,
				answers: [
					{ answer_text: "let x: string = 'hello'", is_correct: true },
					{ answer_text: "let x string = 'hello'", is_correct: false },
					{ answer_text: "let x::string = 'hello'", is_correct: false },
					{ answer_text: "let x<string> = 'hello'", is_correct: false },
				],
			},
			{
				question_text: "What is the type of 'null' in TypeScript?",
				order_index: 1,
				answers: [
					{ answer_text: "null", is_correct: true },
					{ answer_text: "undefined", is_correct: false },
					{ answer_text: "void", is_correct: false },
					{ answer_text: "never", is_correct: false },
				],
			},
		],
	},
	{
		title: "HTTP Methods",
		description: "HTTP request methods",
		questions: [
			{
				question_text: "Which HTTP method updates an existing resource?",
				order_index: 0,
				answers: [
					{ answer_text: "PUT or PATCH", is_correct: true },
					{ answer_text: "GET", is_correct: false },
					{ answer_text: "POST", is_correct: false },
					{ answer_text: "DELETE", is_correct: false },
				],
			},
		],
	},
	{
		title: "Linux File Permissions",
		description: "Understanding file permissions",
		questions: [
			{
				question_text: "What does 'chmod' do?",
				order_index: 0,
				answers: [
					{ answer_text: "Changes file permissions", is_correct: true },
					{ answer_text: "Changes file name", is_correct: false },
					{ answer_text: "Changes file location", is_correct: false },
					{ answer_text: "Changes file content", is_correct: false },
				],
			},
			{
				question_text: "What does 'chown' do?",
				order_index: 1,
				answers: [
					{ answer_text: "Changes file ownership", is_correct: true },
					{ answer_text: "Changes file permissions", is_correct: false },
					{ answer_text: "Changes file name", is_correct: false },
					{ answer_text: "Changes file size", is_correct: false },
				],
			},
		],
	},
	{
		title: "Docker Containers",
		description: "Docker container management",
		questions: [
			{
				question_text: "Which command stops a running container?",
				order_index: 0,
				answers: [
					{ answer_text: "docker stop", is_correct: true },
					{ answer_text: "docker kill", is_correct: false },
					{ answer_text: "docker pause", is_correct: false },
					{ answer_text: "docker end", is_correct: false },
				],
			},
		],
	},
	{
		title: "Data Structures",
		description: "Common data structures",
		questions: [
			{
				question_text: "What is a linked list?",
				order_index: 0,
				answers: [
					{ answer_text: "A linear data structure with nodes", is_correct: true },
					{ answer_text: "A type of array", is_correct: false },
					{ answer_text: "A database table", is_correct: false },
					{ answer_text: "A sorting algorithm", is_correct: false },
				],
			},
			{
				question_text: "What is a binary tree?",
				order_index: 1,
				answers: [
					{ answer_text: "A tree with at most 2 children per node", is_correct: true },
					{ answer_text: "A tree with exactly 2 nodes", is_correct: false },
					{ answer_text: "A tree with 2 levels", is_correct: false },
					{ answer_text: "A tree with 2 roots", is_correct: false },
				],
			},
		],
	},
	{
		title: "Web Security",
		description: "Basic web security concepts",
		questions: [
			{
				question_text: "What is CORS?",
				order_index: 0,
				answers: [
					{ answer_text: "Cross-Origin Resource Sharing", is_correct: true },
					{ answer_text: "Cross-Origin Request Security", is_correct: false },
					{ answer_text: "Client Origin Resource Sharing", is_correct: false },
					{ answer_text: "Cross-Origin Response Sharing", is_correct: false },
				],
			},
		],
	},
	{
		title: "Next.js Routing",
		description: "Next.js file-based routing",
		questions: [
			{
				question_text: "How does Next.js handle routing?",
				order_index: 0,
				answers: [
					{ answer_text: "File-based routing", is_correct: true },
					{ answer_text: "Config-based routing", is_correct: false },
					{ answer_text: "Database routing", is_correct: false },
					{ answer_text: "Manual routing only", is_correct: false },
				],
			},
			{
				question_text: "What folder contains pages in Next.js?",
				order_index: 1,
				answers: [
					{ answer_text: "app or pages", is_correct: true },
					{ answer_text: "routes", is_correct: false },
					{ answer_text: "views", is_correct: false },
					{ answer_text: "components", is_correct: false },
				],
			},
		],
	},
	{
		title: "JavaScript Objects",
		description: "Working with JavaScript objects",
		questions: [
			{
				question_text: "How do you access an object property?",
				order_index: 0,
				answers: [
					{ answer_text: "obj.property or obj['property']", is_correct: true },
					{ answer_text: "obj->property", is_correct: false },
					{ answer_text: "obj::property", is_correct: false },
					{ answer_text: "obj.property()", is_correct: false },
				],
			},
		],
	},
	{
		title: "Python Functions",
		description: "Python function basics",
		questions: [
			{
				question_text: "What keyword defines a function in Python?",
				order_index: 0,
				answers: [
					{ answer_text: "def", is_correct: true },
					{ answer_text: "function", is_correct: false },
					{ answer_text: "func", is_correct: false },
					{ answer_text: "define", is_correct: false },
				],
			},
			{
				question_text: "What is a lambda function?",
				order_index: 1,
				answers: [
					{ answer_text: "An anonymous function", is_correct: true },
					{ answer_text: "A named function", is_correct: false },
					{ answer_text: "A class method", is_correct: false },
					{ answer_text: "A module", is_correct: false },
				],
			},
		],
	},
	{
		title: "CSS Flexbox",
		description: "CSS Flexbox layout",
		questions: [
			{
				question_text: "What property enables flexbox?",
				order_index: 0,
				answers: [
					{ answer_text: "display: flex", is_correct: true },
					{ answer_text: "flex: true", is_correct: false },
					{ answer_text: "layout: flexbox", is_correct: false },
					{ answer_text: "flexbox: enable", is_correct: false },
				],
			},
		],
	},
	{
		title: "HTML Semantic Tags",
		description: "Semantic HTML elements",
		questions: [
			{
				question_text: "Which tag represents the main content?",
				order_index: 0,
				answers: [
					{ answer_text: "<main>", is_correct: true },
					{ answer_text: "<content>", is_correct: false },
					{ answer_text: "<body>", is_correct: false },
					{ answer_text: "<div>", is_correct: false },
				],
			},
			{
				question_text: "Which tag represents a navigation section?",
				order_index: 1,
				answers: [
					{ answer_text: "<nav>", is_correct: true },
					{ answer_text: "<navigation>", is_correct: false },
					{ answer_text: "<menu>", is_correct: false },
					{ answer_text: "<links>", is_correct: false },
				],
			},
		],
	},
	{
		title: "React State",
		description: "React state management",
		questions: [
			{
				question_text: "Which hook manages state?",
				order_index: 0,
				answers: [
					{ answer_text: "useState", is_correct: true },
					{ answer_text: "useEffect", is_correct: false },
					{ answer_text: "useContext", is_correct: false },
					{ answer_text: "useReducer", is_correct: false },
				],
			},
		],
	},
	{
		title: "SQL Joins",
		description: "SQL join operations",
		questions: [
			{
				question_text: "What does INNER JOIN do?",
				order_index: 0,
				answers: [
					{ answer_text: "Returns matching rows from both tables", is_correct: true },
					{ answer_text: "Returns all rows from both tables", is_correct: false },
					{ answer_text: "Returns only left table rows", is_correct: false },
					{ answer_text: "Returns only right table rows", is_correct: false },
				],
			},
		],
	},
	{
		title: "Git Merge",
		description: "Git merge operations",
		questions: [
			{
				question_text: "What does 'git merge' do?",
				order_index: 0,
				answers: [
					{ answer_text: "Combines branches", is_correct: true },
					{ answer_text: "Creates a branch", is_correct: false },
					{ answer_text: "Deletes a branch", is_correct: false },
					{ answer_text: "Renames a branch", is_correct: false },
				],
			},
			{
				question_text: "What is a merge conflict?",
				order_index: 1,
				answers: [
					{ answer_text: "When Git can't automatically merge changes", is_correct: true },
					{ answer_text: "When branches are identical", is_correct: false },
					{ answer_text: "When a branch is deleted", is_correct: false },
					{ answer_text: "When commits are missing", is_correct: false },
				],
			},
		],
	},
	{
		title: "JavaScript Async",
		description: "Asynchronous JavaScript",
		questions: [
			{
				question_text: "What is async/await?",
				order_index: 0,
				answers: [
					{ answer_text: "Syntax for handling promises", is_correct: true },
					{ answer_text: "A type of loop", is_correct: false },
					{ answer_text: "A database query", is_correct: false },
					{ answer_text: "A CSS property", is_correct: false },
				],
			},
		],
	},
	{
		title: "TypeScript Interfaces",
		description: "TypeScript interface definitions",
		questions: [
			{
				question_text: "How do you define an interface?",
				order_index: 0,
				answers: [
					{ answer_text: "interface Name { ... }", is_correct: true },
					{ answer_text: "interface = { ... }", is_correct: false },
					{ answer_text: "def interface Name", is_correct: false },
					{ answer_text: "interface Name()", is_correct: false },
				],
			},
		],
	},
	{
		title: "REST API Status Codes",
		description: "HTTP status codes",
		questions: [
			{
				question_text: "What does status code 404 mean?",
				order_index: 0,
				answers: [
					{ answer_text: "Not Found", is_correct: true },
					{ answer_text: "Server Error", is_correct: false },
					{ answer_text: "Unauthorized", is_correct: false },
					{ answer_text: "Bad Request", is_correct: false },
				],
			},
			{
				question_text: "What does status code 500 mean?",
				order_index: 1,
				answers: [
					{ answer_text: "Internal Server Error", is_correct: true },
					{ answer_text: "Not Found", is_correct: false },
					{ answer_text: "Unauthorized", is_correct: false },
					{ answer_text: "Bad Request", is_correct: false },
				],
			},
		],
	},
	{
		title: "Linux Processes",
		description: "Linux process management",
		questions: [
			{
				question_text: "Which command lists running processes?",
				order_index: 0,
				answers: [
					{ answer_text: "ps", is_correct: true },
					{ answer_text: "ls", is_correct: false },
					{ answer_text: "list", is_correct: false },
					{ answer_text: "proc", is_correct: false },
				],
			},
		],
	},
	{
		title: "Docker Images",
		description: "Docker image management",
		questions: [
			{
				question_text: "Which command lists Docker images?",
				order_index: 0,
				answers: [
					{ answer_text: "docker images", is_correct: true },
					{ answer_text: "docker list", is_correct: false },
					{ answer_text: "docker show", is_correct: false },
					{ answer_text: "docker ps", is_correct: false },
				],
			},
		],
	},
	{
		title: "Algorithms",
		description: "Basic algorithm concepts",
		questions: [
			{
				question_text: "What is the time complexity of linear search?",
				order_index: 0,
				answers: [
					{ answer_text: "O(n)", is_correct: true },
					{ answer_text: "O(log n)", is_correct: false },
					{ answer_text: "O(1)", is_correct: false },
					{ answer_text: "O(n²)", is_correct: false },
				],
			},
		],
	},
	{
		title: "Password Security",
		description: "Password security best practices",
		questions: [
			{
				question_text: "What makes a strong password?",
				order_index: 0,
				answers: [
					{ answer_text: "Long, complex, and unique", is_correct: true },
					{ answer_text: "Short and simple", is_correct: false },
					{ answer_text: "Your name and birthdate", is_correct: false },
					{ answer_text: "123456", is_correct: false },
				],
			},
		],
	},
	{
		title: "Next.js API Routes",
		description: "Next.js API route handlers",
		questions: [
			{
				question_text: "Where are API routes defined in Next.js App Router?",
				order_index: 0,
				answers: [
					{ answer_text: "In route.ts or route.js files", is_correct: true },
					{ answer_text: "In api.ts files", is_correct: false },
					{ answer_text: "In server.ts files", is_correct: false },
					{ answer_text: "In config files", is_correct: false },
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

async function createTest(userId: string, template: typeof testTemplates[0], maxQuestions: number = 2) {
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

	// Limit questions to maxQuestions (default 2)
	const questionsToCreate = template.questions.slice(0, maxQuestions)

	// Prepare all questions for batch insert
	const questionsData = questionsToCreate.map((q, i) => ({
		question_text: q.question_text,
		order_index: i,
		test_id: test.id,
	}))

	// Batch insert all questions
	const { data: questions, error: questionsError } = await supabase
		.from("questions")
		.insert(questionsData)
		.select()

	if (questionsError) {
		console.error(`Error creating questions for test ${template.title}:`, questionsError)
		return test
	}

	if (!questions || questions.length === 0) {
		return test
	}

	// Prepare all answers for batch insert
	const answersData: Array<{ answer_text: string; is_correct: boolean; question_id: string }> = []
	for (let i = 0; i < questionsToCreate.length; i++) {
		const questionTemplate = questionsToCreate[i]
		const question = questions[i]
		if (question) {
			for (const answerTemplate of questionTemplate.answers) {
				answersData.push({
					answer_text: answerTemplate.answer_text,
					is_correct: answerTemplate.is_correct,
					question_id: question.id,
				})
			}
		}
	}

	// Batch insert all answers
	if (answersData.length > 0) {
		const { error: answersError } = await supabase.from("answers").insert(answersData)

		if (answersError) {
			console.error(`Error creating answers for test ${template.title}:`, answersError)
		}
	}

	return test
}

async function seedDatabase() {
	console.log("Starting database seeding...\n")

	// Create users in parallel
	const userPromises = dummyUsers.map(userData =>
		createUser(userData.email, userData.password, userData.name, userData.surname)
	)
	const userResults = await Promise.all(userPromises)
	const users = userResults.filter((user): user is NonNullable<typeof user> => user !== null)

	if (users.length === 0) {
		console.error("No users were created. Aborting seeding.")
		return
	}

	console.log(`\nCreated ${users.length} users\n`)

	// Create tests for each user with parallelization
	// Create many tests with at most 2 questions each
	let totalTests = 0
	const BATCH_SIZE = 10 // Process tests in batches to avoid overwhelming the database

	for (let i = 0; i < users.length; i++) {
		const user = users[i]
		// Each user gets 8-12 tests (much more than before)
		const testsPerUser = Math.floor(Math.random() * 5) + 8
		const shuffledTemplates = [...testTemplates].sort(() => Math.random() - 0.5)

		// Prepare all test creation promises
		const testPromises = []
		for (let j = 0; j < testsPerUser; j++) {
			const templateIndex = j % shuffledTemplates.length
			const template = shuffledTemplates[templateIndex]
			testPromises.push(createTest(user.id, template, 2))
		}

		// Process tests in batches for better performance
		for (let batchStart = 0; batchStart < testPromises.length; batchStart += BATCH_SIZE) {
			const batch = testPromises.slice(batchStart, batchStart + BATCH_SIZE)
			const results = await Promise.all(batch)
			totalTests += results.filter(test => test !== null).length
		}

		console.log(`Created ${testsPerUser} tests for user ${user.email}`)
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

