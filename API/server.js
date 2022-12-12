require('dotenv').config();
const express = require('express'),
    server = express(),
    moment = require('moment'),
    cors = require('cors'),
    multer = require('multer'),
    port = process.env.PORT,
    token = process.env.TOKEN;

var mysql = require('mysql'),
    pool = mysql.createPool({
        connectionLimit: 10,
        host: process.env.DBHOST,
        user: process.env.DBUSER,
        password: process.env.DBPASS,
        database: process.env.DBNAME
    });

server.use(cors());
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

// GET ALL RECORDS
server.get('/:table', tokencheck(), (req, res) => {
    let table = req.params.table

    pool.query(`SELECT * FROM ${table}`, (err, results) => {
        if (err) {
            log('ERROR', err)
            res.status(500).send(err)
        }
        res.status(200).send(results)
        log('SUCCESS', `${results.length} records sent from ${table}`)
    })
})

// GET ONE RECORD BY ID
server.get('/:table/:id', tokencheck(), (req, res) => {
    let table = req.params.table,
        id = req.params.id

    pool.query(`SELECT * FROM ${table} WHERE ID=${id}`, (err, results) => {
        if (err) {
            log('ERROR', err)
            res.status(500).send(err)
        }
        res.status(200).send(results)
        log('SUCCESS', `${results.length} records sent from ${table}`)
    })
})

server.listen(port, () => {
    log('SERVER', `Listening on port ${port}...`);
})

function tokencheck() {
    return (req, res, next) => {
        if (req.headers.authorization == token) {
            next();
        } else {
            res.status(500).json({ message: 'Illetéktelen hozzáférés!' });
        }
    };
}

function log(req, res) {
    var timestamp = moment(new Date()).format('yyyy-MM-DD HH:mm:ss');
    console.log(`[${timestamp}]: ${req} >>> ${res}`);
}