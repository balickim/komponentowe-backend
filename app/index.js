var express = require("express");
const basicAuth = require('express-basic-auth')
var bodyParser = require("body-parser");
var sql = require("mssql");
const session = require('express-session');
// const { ExpressOIDC } = require('@okta/oidc-middleware');
const OktaJwtVerifier = require('@okta/jwt-verifier');
var dbConfig = require('../secrets/databaseConfiguration');
const { Pool } = require('pg');
const { correctApiKey } = require('../app/api/helper')


var app = express();

const expressSwagger = require('express-swagger-generator')(app);

// app.use(basicAuth({
//     users: { 'admin': 'Qp8exqDqSvtVaD91md04' },
//     unauthorizedResponse: getUnauthorizedResponse
// }))

// function getUnauthorizedResponse(req) {
//     return req.auth
//         ? ('Credentials ' + req.auth.user + ':' + req.auth.password + ' rejected')
//         : 'No credentials provided'
// }

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Serwer działa na porcie ${PORT}`));

// session support is required to use ExpressOIDC
// app.use(session({
//     secret: 'this should be secure',
//     resave: true,
//     saveUninitialized: false
// }));


// const oidc = new ExpressOIDC({
//     issuer: 'https://dev-384592.okta.com/oauth2/default',
//     client_id: '0oa1xc73iagCFV8Q4357',
//     client_secret: '9ATMTWguQcx-5Z0XyMJwsATPeCa1Qvs-waVHaNYk',
//     redirect_uri: 'http://localhost:3000/authorization-code/callback',
//     appBaseUrl: 'http://localhost:3000',
//     scope: 'openid profile'
// });

// const oktaJwtVerifier = new OktaJwtVerifier({
//     issuer: 'https://dev-384592.okta.com/oauth2/default'
// });

// oktaJwtVerifier.verifyAccessToken("accessTokenString", 'api://default')
//     .then(jwt => {
//         // the token is valid (per definition of 'valid' above)
//         console.log(jwt.claims);
//     })
//     .catch(err => {
//         // a validation failed, inspect the error
//     });

// ExpressOIDC will attach handlers for the /login and /authorization-code/callback routes
// app.use(oidc.router);

// oidc.on('ready', () => {
//     app.listen(process.env.PORT || PORT, () =>
//         console.log(`App now running on port ${PORT}`));
// });

// oidc.on('error', err => {
//     console.log('Unable to configure ExpressOIDC', err);
// });

// Body Parser Middleware
app.use(bodyParser.json());

//CORS Middleware
app.use(function (req, res, next) {
    //Enabling CORS 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});
// console.log(dbConfig);
// sql.connect(dbConfig);

const pool = new Pool(dbConfig);

// app.get('/protected', oidc.ensureAuthenticated(), (req, res) => {
//     res.json(req.userContext.userinfo);
// });

// app.get('/', (req, res) => {
//     if (req.isAuthenticated()) {
//         res.send(`Zalogowano na ${req.userContext.userinfo.name}!`);
//     } else {
//         res.send('Niezalogowano');
//     }
// });

// app.get('/local-logout', (req, res) => {
//     req.logout();
//     res.redirect('/');
// });

app.get('/users', (req, res, next) => {
    const { apikey } = req.body;

    correctApiKey(apikey)
        .then(() => {
            return getUsers()
        })
        .then((users) => { res.json({ users }) })
        .catch(error => next(error));
});

app.get('/usersss', (req, res, next) => {
    getUsers()
        .then((users) => res.json(users))
        .catch(error => next(error));
});

app.post('/signup', (req, res, next) => {
    const { apikey, username, password } = req.body;

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

let options = {
    swaggerDefinition: {
        info: {
            description: 'Opis serwera',
            title: 'System Obsługi Przychodni',
            version: '0.0.1',
        },
        host: 'localhost:3000',
        basePath: '/v1',
        produces: [
            "application/json",
            "application/xml"
        ],
        schemes: ['http', 'https'],
        securityDefinitions: {
            JWT: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization',
                description: "",
            }
        }
    },
    basedir: __dirname, //app absolute path
    files: ['/api/*.js'] //Path to the API handle folder
};
expressSwagger(options)

// /**
//  * serveSwagger must be called after defining your router.
//  * @param app Express object
//  * @param endPoint Swagger path on which swagger UI display
//  * @param options Swagget Options.
//  * @param path.routePath path to folder in which routes files defined.
//  * @param path.requestModelPath Optional parameter which is path to folder in which requestModel defined, if not given request params will not display on swagger documentation.
//  * @param path.responseModelPath Optional parameter which is path to folder in which responseModel defined, if not given response objects will not display on swagger documentation.
//  */
// expressSwagger.serveSwagger(app, "/swagger", options, { routePath: './src/routes/', requestModelPath: './src/requestModel', responseModelPath: './src/responseModel' });



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