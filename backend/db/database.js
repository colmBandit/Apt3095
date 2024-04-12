const sql = require('mssql');

const config = {
    user: 'dolistapp-server-admin',
    password: 'ZheHej2iTLvA$4Zf',
    server: 'dolistapp-server.database.windows.net',
    database: 'dolistapp-database',
    options: {
        encrypt: true // Use this option for Azure SQL Database
    }
};

// Create a new instance of the SQL Server Connection Pool
const pool = new sql.ConnectionPool(config);

// Connect to the database using the Connection Pool
const db = pool.connect().then(pool => {
    console.log("Connected to Azure SQL Database");
    return pool;
}).catch(err => {
    console.error("Error connecting to Azure SQL Database:", err);
    throw err;
});

module.exports = db;
