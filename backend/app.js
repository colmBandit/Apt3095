const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require('cors');

// Import the database connection pool
const db = require('./db/database');

// Import routes
// Define a route handler for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the Todo App!');
});

const todos = require('./routes/todosRoutes');

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));
app.use(cors());

// Routes middleware
app.use('/api', todos);

// Port
const port = process.env.PORT || 9000;

// Start the server
db.then(() => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}).catch(err => {
    console.error("Error connecting to Azure SQL Database:", err);
});
