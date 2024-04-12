const express = require('express');
const router = express.Router();
const sql = require('mssql');
const db = require('../db/database'); // Import the database connection promise

// Routes

// Create list route
router.post('/create/list', (req, res) => {
    const { title, dueDate } = req.body; // Update to use 'dueDate' instead of 'completed'
    db.then(pool => {
        const request = pool.request();
        request.input('title', sql.NVarChar, title);
        request.input('dueDate', sql.DateTime, dueDate); // Use 'dueDate' parameter
        request.query('INSERT INTO ToDoItems (title, dueDate) VALUES (@title, @dueDate)', (err, result) => {
            if (err) {
                console.error("Error creating list:", err);
                res.status(500).send("Internal server error");
            } else {
                console.log("List created successfully");
                res.send("List created successfully");
            }
        });
    }).catch(err => {
        console.error("Error connecting to Azure SQL Database:", err);
        res.status(500).send("Internal server error");
    });
});


// Show todos route
router.get('/show/todos', (req, res) => {
    db.then(pool => {
        const request = pool.request();
        request.query('SELECT * FROM ToDoItems', (err, result) => {
            if (err) {
                console.error("Error retrieving todos:", err);
                res.status(500).send("Internal server error");
            } else {
                console.log("Todos retrieved successfully");
                res.json(result.recordset);
            }
        });
    }).catch(err => {
        console.error("Error connecting to Azure SQL Database:", err);
        res.status(500).send("Internal server error");
    });
});

// Single todo route
router.get('/todo/:id', (req, res) => {
    const { id } = req.params;
    db.then(pool => {
        const request = pool.request();
        request.input('id', sql.Int, id);
        request.query('SELECT * FROM ToDoItems WHERE id = @id', (err, result) => {
            if (err) {
                console.error("Error retrieving todo:", err);
                res.status(500).send("Internal server error");
            } else {
                console.log("Todo retrieved successfully");
                res.json(result.recordset[0]);
            }
        });
    }).catch(err => {
        console.error("Error connecting to Azure SQL Database:", err);
        res.status(500).send("Internal server error");
    });
});

// Update todo route
// Update todo route
router.put('/update/todo/:id', (req, res) => {
    const { id } = req.params;
    const { title, dueDate, completed } = req.body; // Include 'completed'
    db.then(pool => {
        const request = pool.request();
        request.input('id', sql.Int, id);
        request.input('title', sql.NVarChar, title);
        request.input('dueDate', sql.DateTime, dueDate);
        request.input('completed', sql.Bit, completed); // Input 'completed'
        request.query('UPDATE ToDoItems SET title = @title, dueDate = @dueDate, completed = @completed WHERE id = @id', (err, result) => {
            if (err) {
                console.error("Error updating todo:", err);
                res.status(500).send("Internal server error");
            } else {
                console.log("Todo updated successfully");
                res.send("Todo updated successfully");
            }
        });
    }).catch(err => {
        console.error("Error connecting to Azure SQL Database:", err);
        res.status(500).send("Internal server error");
    });
});


// Delete todo route
router.delete('/delete/todo/:id', (req, res) => {
    const { id } = req.params;
    db.then(pool => {
        const request = pool.request();
        request.input('id', sql.Int, id);
        request.query('DELETE FROM ToDoItems WHERE id = @id', (err, result) => {
            if (err) {
                console.error("Error deleting todo:", err);
                res.status(500).send("Internal server error");
            } else {
                console.log("Todo deleted successfully");
                res.send("Todo deleted successfully");
            }
        });
    }).catch(err => {
        console.error("Error connecting to Azure SQL Database:", err);
        res.status(500).send("Internal server error");
    });
});

module.exports = router;
