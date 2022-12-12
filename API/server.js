require('dotenv').config();
const express = require('express');
var mysql = require('mysql');
const moment = require('moment');
const cors = require('cors');
const app = express();
const multer = require('multer');
const port = process.env.PORT;
const token = process.env.TOKEN;

var pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBNAME
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
})