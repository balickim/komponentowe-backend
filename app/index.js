var express = require("express");
var bodyParser = require("body-parser");
var sql = require("mssql");
const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');
const OktaJwtVerifier = require('@okta/jwt-verifier');
var dbConfig = require('../secrets/databaseConfiguration');

var app = express();

const expressSwagger = require('express-swagger-generator')(app);

var PORT = 3000;
// session support is required to use ExpressOIDC
app.use(session({
    secret: 'this should be secure',
    resave: true,
    saveUninitialized: false
}));


const oidc = new ExpressOIDC({
    issuer: 'https://dev-384592.okta.com/oauth2/default',
    client_id: '0oa1xc73iagCFV8Q4357',
    client_secret: '9ATMTWguQcx-5Z0XyMJwsATPeCa1Qvs-waVHaNYk',
    redirect_uri: 'http://localhost:3000/authorization-code/callback',
    appBaseUrl: 'http://localhost:3000',
    scope: 'openid profile'
});

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
app.use(oidc.router);

oidc.on('ready', () => {
    app.listen(process.env.PORT || PORT, () =>
        console.log(`App now running on port ${PORT}`));
});

oidc.on('error', err => {
    console.log('Unable to configure ExpressOIDC', err);
});

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

//Initiallising connection string
// var dbConfig = {
//     user: "marcin.kmiecik",
//     password: "axSIFux9@",
//     server: "yerbaland.database.windows.net",
//     database: "DnD",
//     options:
//     {
//         encrypt: true
//     }
// };
// console.log(dbConfig);
sql.connect(dbConfig);

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
    getUsers()
        .then(({ users }) => res.json({ users }))
        .catch(error => next(error));
});

app.post('/signup', (req, res, next) => {

    sql.query(
        'INSERT INTO Users("idUsers", "userEmail", "userName", "userPassword") VALUES("email@gmail.com", "test", "test")');
});

const getUsers = () => {
    return new Promise((resolve, reject) => {
        sql.query(
            'SELECT * FROM Users',
            (error, response) => {
                if (error) return reject(error);

                const getUsers = response.recordsets[0][0];

                Promise.resolve(getUsers).then(users => resolve({ users }))
                    .catch(error => reject(error));
            }
        )
    });
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