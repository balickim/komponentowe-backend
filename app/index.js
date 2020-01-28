var express = require("express");
var bodyParser = require("body-parser");
const swaggerRouter = require('./swagger');
const userRouter = require('./api/user');
const patientRouter = require('./api/patient');
const doctorRouter = require('./api/doctor');
const receptionistRouter = require('./api/receptionist');
const clinicRouter = require('./api/clinic');

var app = express();
app.use(bodyParser.json());

//CORS Middleware
app.use(function (req, res, next) {
    //Enabling CORS 
    // console.log("using CORS Middleware...");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization, apikey");
    next();
});

app.use('/swagger', swaggerRouter);
app.use('/user', userRouter);
app.use('/patient', patientRouter);
app.use('/doctor', doctorRouter);
app.use('/reception', receptionistRouter);
app.use('/clinic', clinicRouter);

app.get('/', (req, res, next) => {
    res.redirect('./swagger/api-docs/');
});

app.get('/stonoga', (req, res, next) => {
    setTimeout(function () { res.redirect('https://i.ytimg.com/vi/-rf7Jd1oFbc/maxresdefault.jpg'); }, 3000);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Serwer działa na porcie ${PORT}`));

module.exports = app;