require('dotenv').config();
const express = require('express'),
    server = express(),
    moment = require('moment'),
    cors = require('cors'),
    multer = require('multer'),
    sha1 = require('sha1'),
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

// LOGINCHECK
server.post('/login', (req, res) => {
    var table = req.body.table;
    var email = req.body.email;
    var passwd = req.body.passwd;

    pool.query(`SELECT * FROM ${table} WHERE email=? AND password=?`, [email, sha1(passwd)], (err, results) => {
        if (err) {
            log(req.socket.remoteAddress, err);
            res.status(500).send(err);
        }

        log(req.socket.remoteAddress, `${results.length} records sent form ${table} table (logincheck).`);
        res.status(200).send(results);
    })
})

// GET ALL RECORDS
server.get('/:table', (req, res) => {
    let table = req.params.table

    pool.query(`SELECT * FROM ${table}`, (err, results) => {
        if (err) {
            log('ERROR', err)
            res.status(500).send(err)
        }
        
        log('SUCCESS', `${results.length} records sent from ${table}`)
        res.status(200).send(results)
    })
})

// GET ONE RECORD BY ID
server.get('/:table/:id', (req, res) => {
    let table = req.params.table,
        id = req.params.id

    pool.query(`SELECT * FROM ${table} WHERE ID=${id}`, (err, results) => {
        if (err) {
            log('ERROR', err)
            res.status(500).send(err)
        }

        log('SUCCESS', `${results.length} records sent from ${table}`)
        res.status(200).send(results)
    })
})

// GET RECORDS BY FIELD
server.get('/:table/:field/:value', (req, res) => {
    var table = req.params.table
    var field = req.params.field
    var value = req.params.value
    pool.query(`SELECT * FROM ${table} WHERE ${field}='${value}'`, (err, results) => {
        if (err) {
            log(req.socket.remoteAddress, err)
            res.status(500).send(err)
        }
        
        log(req.socket.remoteAddress, `${results.length} records sent form ${table} table.`);
        res.status(200).send(results);
    })
})

// INSERT RECORD
server.post('/:table', (req, res) => {
    var table = req.params.table;
    var records = req.body;
    var str = 'null';
    var str2 = 'ID';

    var fields = Object.keys(records);
    var values = Object.values(records);

    values.forEach(value => { str += `, '${value}'` })
    fields.forEach(field => { str2 += `, ${field}` }) 

    pool.query(`INSERT INTO ${table} (${str2}) VALUES(${str})`, (err, results) => {
        if (err) {
            log(req.socket.remoteAddress, err);
            res.status(500).send(err);
        }
        log(req.socket.remoteAddress, `${results.affectedRows} record inserted to ${table} table.`);
        res.status(200).send(results);
    })
})

// UPDATE RECORD
server.patch('/:table/:id', (req, res) => {
    var table = req.params.table;
    var id = req.params.id;
    var records = req.body;
    var str = '';

    var fields = Object.keys(records);
    var values = Object.values(records);

    for (let i = 0; i < fields.length; i++) {
        str += `${fields[i]}='${values[i]}'`
        if (i != fields.length - 1) str += ","
    }

    pool.query(`UPDATE ${table} SET ${str} WHERE ID=${id}`, (err, results) => {
        if (err) {
            log(req.socket.remoteAddress, err);
            res.status(500).send(err);
        }
        log(req.socket.remoteAddress, `${results.affectedRows} record updated in ${table} table.`);
        res.status(200).send(results);
    })
})

// DELETE ONE RECORD
server.delete('/:table/:id', (req, res) => {
    var table = req.params.table;
    var id = req.params.id;

    pool.query(`DELETE FROM ${table} WHERE ID=${id}`, (err, results) => {
        if (err) {
            log(req.socket.remoteAddress, err);
            res.status(500).send(err);
        }
        log(req.socket.remoteAddress, `${results.affectedRows} record deleted form ${table} table.`);
        res.status(200).send(results);
    })
})

// DELETE ALL RECORDS WITH VALUE
server.delete('/:table/:field/:value', (req, res) => {
    var table = req.params.table;
    var field = req.params.field;
    var value = req.params.value;

    pool.query(`DELETE FROM ${table} WHERE ${field}=${value}`, (err, results) => {
        if (err) {
            log(req.socket.remoteAddress, err);
            res.status(500).send(err);
        }
        log(req.socket.remoteAddress, `${results.affectedRows} records deleted form ${table} table.`);
        res.status(200).send(results);
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
            res.status(500).json({ message: 'User is not see you table' });
        }
    };
}

function log(req, res) {
    var timestamp = moment(new Date()).format('yyyy-MM-DD HH:mm:ss');
    console.log(`[${timestamp}]: ${req} >>> ${res}`);
}