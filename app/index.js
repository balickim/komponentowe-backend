var express = require("express");
var bodyParser = require("body-parser");
const userRouter = require('./api/user');
const swaggerRouter = require('./swagger');

var app = express();
app.use(bodyParser.json());

app.use('/user', userRouter);
app.use('/swagger', swaggerRouter);

app.get('/', (req, res, next) => {
    res.redirect('./swagger/api-docs/');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Serwer działa na porcie ${PORT}`));

//CORS Middleware
app.use(function (req, res, next) {
    //Enabling CORS 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});

module.exports = app;