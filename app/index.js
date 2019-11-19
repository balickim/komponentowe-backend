//Initiallising node modules
var express = require("express");
var bodyParser = require("body-parser");
var sql = require("mssql");
var oauth2lib = require('oauth20-provider');
var oauth2 = new oauth2lib({ log: { level: 2 } });

var app = express();


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

//Setting up server
var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});

app.use(oauth2.inject());
app.post('/token', oauth2.controller.token);

function isAuthorized(req, res, next) {
    if (req.session.authorized) next();
    else {
        var params = req.query;
        params.backUrl = req.path;
        res.redirect('/login?' + query.stringify(params));
    }
};

app.get('/authorization', isAuthorized, oauth2.controller.authorization, function (req, res) {
    // Render our decision page
    // Look into ./test/server for further information
    res.render('authorization', { layout: false });
});
app.post('/authorization', isAuthorized, oauth2.controller.authorization);

//Initiallising connection string
var dbConfig = {
    user: "marcin.kmiecik",
    password: "axSIFux9@",
    server: "yerbaland.database.windows.net",
    database: "DnD",
    options:
    {
        encrypt: true
    }
};

// var dbConfig = "Data Source=yerbaland.database.windows.net;Encrypt=true;User Id=marcin.kmiecik;Password=axSIFux9@;Initial Catalog=DnD;Integrated Security=True";

//Function to connect to database and execute query
// var executeQuery = function (req, res, query) {
//     sql.connect(dbConfig, function (err) {
//         if (err) {
//             console.log("Error while connecting database :- " + err);
//             res.send(err);
//         }
//         else {
//             // create Request object
//             var request = new sql.Request();
//             // query to the database
//             request.query(query, function (err, res) {
//                 if (err) {
//                     console.log("Error while querying database :- " + err);
//                     res.send(err);
//                 } else {
//                     // console.log(res);
//                     res.json({ recordsets });
//                 }
//             });
//         }
//     });
// }

// sql.connect(dbConfig, function (err) {
//     if (err) throw err;
//     sql.query("SELECT * FROM Users", function (err, result, fields) {
//         if (err) throw err;
//         console.log(result);
//         // console.log(JSON.stringify({ result: { recordset: recordset[0].userEmail } }));
//     });
// });
sql.connect(dbConfig);
const getPublicDragons = () => {
    return new Promise((resolve, reject) => {
        sql.query(
            'SELECT * FROM Users',
            (error, response) => {
                if (error) return reject(error);

                // console.log(response.recordsets[0][0]);
                const publicDragonRows = response.recordsets[0][0];

                Promise.resolve(publicDragonRows).then(users => resolve({ users }))
                    .catch(error => reject(error));
            }
        )
    });
}

app.get('/users', (req, res, next) => {
    getPublicDragons()
        .then(({ users }) => res.json({ users }))
        .catch(error => next(error));
});

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