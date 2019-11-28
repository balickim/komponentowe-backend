var express = require("express");
var bodyParser = require("body-parser");
var dbConfig = require('../secrets/databaseConfiguration');
const { Pool } = require('pg');
const { correctApiKey } = require('../app/api/helper')
const accountRouter = require('./api/account');
const swaggerRouter = require('./swagger');

var app = express();

app.use('/account', accountRouter);
app.use('/swagger', swaggerRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Serwer działa na porcie ${PORT}`));

app.use(bodyParser.json());

//CORS Middleware
app.use(function (req, res, next) {
    //Enabling CORS 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});

const pool = new Pool(dbConfig);

app.get('/usersss', (req, res, next) => {
    getUsers()
        .then((users) => res.json(users))
        .catch(error => next(error));
});

app.get('/users', (req, res, next) => {
    const { apikey } = req.headers;

    // console.log(apikey);

    correctApiKey(apikey)
        .then(() => {
            return getUsers()
        })
        .then((users) => { res.json({ users }) })
        .catch(error => next(error));
});

app.post('/signup', (req, res, next) => {
    const { apikey } = req.headers;
    const { username, password } = req.body;

    correctApiKey(apikey)
        .then(() => {

            AccountTable.getAccount({ username })
                .then(({ account }) => {
                    if (!account) {

                        return AccountTable.storeAccount({ username, password })

                    } else {
                        const error = new Error('Ten login jest już zajęty!');

                        error.statusCode = 409;

                        throw error;
                    }
                })
        })
        .then(() => res.json({ message: 'sukces' }))
        .catch(error => next(error));
});
const getUsers = () => {
    return new Promise((resolve, reject) => {
        pool.query(
            `SELECT * from users`,
            (error, response) => {
                if (error) return reject(error);

                resolve(response.rows);
            }
        )
    });
}
class AccountTable {
    static storeAccount({ username, password }) {
        return new Promise((resolve, reject) => {
            pool.query(
                'INSERT INTO users (username,password) VALUES($1,$2)',
                [username, password],
                (error, response) => {
                    if (error) return reject(error);

                    resolve();
                }
            );
        });
    }

    static getAccount({ username }) {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT id, username, password FROM users 
                WHERE username = $1`,
                [username],
                (error, response) => {
                    if (error) return reject(error);

                    resolve({ account: response.rows[0] });
                }
            )
        });
    }
}



// GET API
// app.get("/api/users", function (req, res) {
//     var query = "SELECT * FROM [Users]";
//     executeQuery(res, query);
// });

// //POST API
// app.post("/api/user", function (req, res) {
//     var query = "INSERT INTO [user] (Name,Email,Password) VALUES (req.body.Name,req.body.Email,req.body.Password”);
//     executeQuery(res, query);
// });

// //PUT API
// app.put("/api/user/:id", function (req, res) {
//     var query = "UPDATE [user] SET Name= " + req.body.Name + " , Email=  " + req.body.Email + "  WHERE Id= " + req.params.id;
//     executeQuery(res, query);
// });

// // DELETE API
// app.delete("/api/user /:id", function (req, res) {
//     var query = "DELETE FROM [user] WHERE Id=" + req.params.id;
//     executeQuery(res, query);
// });

module.exports = app;