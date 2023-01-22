const express = require('express')
const app = express()
const port = 5000
var bodyParser = require('body-parser')
const cors = require('cors')
let cookieParser = require('cookie-parser')
const mysql = require('mysql')
const bcrypt = require('bcrypt')

// app.use(cors());

// app.use(function (req, res) {
//   res.setHeader('Content-Type', 'text/plain')
//   res.write('you posted:\n')
//   res.end(JSON.stringify(req.body, null, 2))
// })

const connection = mysql.createConnection({
    host: 'mydb.cu6unrorcuye.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: '1234jack',
    database: 'saimon'
})

connection.connect();

const corsOptions = {
    origin: 'http://localhost:3000',
    OptionsSUccessStatus: 200,
    credentials: true
};

app.use(cors(corsOptions))

app.use(cookieParser())

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

// connection.query('SELECT * FROM user', (err, rows, fields) => {
//     if (err) throw err;

//     console.log('The solution is: ', rows)
//     // res.send(rows)
// })

// connection.end();

// app.use(function (req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Credentials', true);
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
// });

app.get('/', (req, res) => {
    res.send("Haro- Warudo-")
})

app.get('/gets', (req, res) => {
    var sql = 'SELECT id, username FROM user'
    // var sql = "INSERT INTO user (username, password) VALUES('anny', 1234)"
    connection.query(sql, (err, rows, fields) => {
        if (err) throw err;

        // var data = {
        //     data: rows,
        //     status: 200,
        //     message: 'Success'
        // }

        // console.log('The solution is: ', data)
        res.send(rows)
    })
})

app.get('/get/:id', (req, res) => {
    var sql = 'SELECT * FROM user WHERE id=?'
    // var sql = "INSERT INTO user (username, password) VALUES('anny', 1234)"
    connection.query(sql, [req.params.id], (err, rows, fields) => {
        if (err) throw err;

        // var data = {
        //     data: rows,
        //     status: 200,
        //     message: 'Success'
        // }

        // console.log('The solution is: ', data)
        res.send(rows)
    })
})

app.get('/home', (req, res) => {
    res.send("Home")
})

app.post('/create', (req, res) => {
    var { username, email, password } = req.body
    var params = [username, email, password]
    var sql = "INSERT INTO user (username, email, password) VALUES(?, ?, ?)"
    connection.query(sql, params, (err, rows, fields) => {
        if (err) throw err;

        // var data = {
        //     data: rows,
        //     status: 200,
        //     message: 'Success'
        // }

        // console.log('The solution is: ', data)
        res.send('Success')
    })
})

app.post('/login', (req, res) => {
    var { email, password } = req.body
    var params = [email, password]
    var sql = "SELECT id FROM user WHERE email = ? AND password = ?"
    connection.query(sql, params, (err, rows, fields) => {
        if (err) {
            throw err
        } else {
            if (rows.length > 0) {
                res.cookie("login", rows[0].id)
                let data = {
                    path: '/',
                    samSite: 'none',
                    secure: true,
                    status: 200,
                    message: 'Log In'
                }
                res.send(data)
            }
            else res.send('Failed');
        };
        // res.send('success')
    })
})

app.post('/isLoggedIn', (req, res) => {
    //     var { email, password } = req.body
    //     var params = [email, password]
    //     var sql = "SELECT id FROM user WHERE email = ? AND password = ?"
    //     connection.query(sql, params, (err, rows, fields) => {
    //         if (err) {
    //             throw err
    //         }else {
    //             if (rows.length > 0) {
    //                 res.cookie("login", rows[0].id)
    //                 let data = {
    //                     status: 200,
    //                     message: 'Log In'
    //                 }
    //                 res.send(data)}
    //             else res.send('Failed');
    //         };
    //     })
    console.log(req.cookies)
    if (req.cookies.login) {
        let data = {
            status: 200,
            message: 'Logged In'
        }
        res.send(data)
    } else {
        res.send('No Cookies')
    }
})

app.put('/update', (req, res) => {
    var { firstname, lastname, username, email, password, id } = req.body
    var params = [firstname, lastname, username, email, password, id]
    var sql = "UPDATE user SET firstname = ?, lastname = ?, username = ?, email = ?, password = ? WHERE id = ?"
    connection.query(sql, params, (err, rows, fields) => {
        if (err) throw err;

        // var data = {
        //     data: rows,
        //     status: 200,
        //     message: 'Success'
        // }

        // console.log('The solution is: ', data)
        res.send('Update Success')
    })
})

app.delete('/delete', (req, res) => {
    // var {username, email, id} = req.body
    // var params = [username, email, id]
    var sql = "DELETE FROM user WHERE id = 12"
    connection.query(sql, [], (err, rows, fields) => {
        if (err) throw err;

        // var data = {
        //     data: rows,
        //     status: 200,
        //     message: 'Success'
        // }

        // console.log('The solution is: ', data)
        res.send('Delete Success')
    })
})

app.listen(port, () => {
    console.log('Running On Port:', port)
})

