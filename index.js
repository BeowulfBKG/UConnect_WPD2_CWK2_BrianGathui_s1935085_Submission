// Import Required Modules for the application
const express = require('express'); // Express framework for web applications
const cors = require('cors'); // Cross-Origin Resource Sharing middleware for security
const path = require('path'); // Path manipulation utilities
const expressLayouts = require('express-ejs-layouts'); // EJS layout management for templating
const bodyParser = require('body-parser'); // Body parser for handling incoming request data
const cookieParser = require("cookie-parser");

/*
     App Creation Using Express
     The initialization of the  Express Application
     "node index.js" (run one instance that doesn't refresh)
     "npm run devStart" (run using nodemon)
*/
const app = express(); // Create an instance of the Express application

// Database and Validation upon Startup
require('./startup/db')(); // Initialization of the database connection
require('./startup/validation'); // Load validation rules
const { ACCESS_TOKEN_SECRET, JWT_SECRET } = require('./startup/secrets'); // Load environment variables the secret keys


/*
     Middleware Configuration:
     This is a built-in middleware function in Express. 
     It parses incoming requests with urlencoded 
     payloads and is based on body-parser.
*/
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(cors()); // Enable CORS for secure cross-origin requests
app.use(bodyParser.json()); // Parse JSON data in request bodies
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("public")) // Serve static files from the public directory
app.use(cookieParser()); // Parse cookies in the request body

/*
     View Engine Setup:
     Connection to express layouts, 
     views, EJS, and any static pages
*/
app.use(expressLayouts); // Enable EJS layouts
app.set('view engine', 'ejs'); // Set EJS as the default view engine
app.set('views', path.join(__dirname, '/views')); // Set the views directory
app.set('layout', 'layouts/layout'); // Set the default layout filey
app.use(express.static('public')); // Serve static assets from the public directory

// Connection to Routers
const Router = require('./routes/router'); // Import of the main router module
app.use(Router); // Router Connection Connect the main router to the application

// Import the authentication middleware
const { authenticateToken } = require('./middleware/authMiddleware');


/*
     Port Configuration:
     Pulls from an environment variable for 
     deployment the server is going to tell us what 
     port we are going to listen (by default set for PORT 8000 for development)
*/
const port = process.env.PORT || 5000;

process.on('SIGINT', () => {
     console.log('\n');
     console.log(`😊 Server terminated... Thank you for using our UConnect! 🙏` + '\n');
     process.exit(0);
});


app.listen(port, () => {
     console.log('=========================================================================');
     console.log(`🔴 Server running on port ${port}...`);
     console.log(`🟡 Navigate to any browser and type: http://localhost:${port}...`);
     // Automatically open the browser after the server starts
});
