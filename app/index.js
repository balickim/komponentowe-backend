const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const GenerationEngine = require('./generation/engine.js');
const dragonRouter = require('./api/dragon.js');
const generationRouter = require('./api/generation.js');
const accountRouter = require('./api/account');

const app = express();
const engine = new GenerationEngine();

app.locals.engine = engine;

app.use(cors({ origin: 'http://localhost:1234', credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/account', accountRouter);
app.use('/dragon', dragonRouter);
// app.use('/generation', generationRouter);

app.use((err, req, res, next) => {
    const statusCode = err.StatusCode || 500;

    res.status(statusCode).json({
        type: 'error', message: err.message
    })
});

// engine.start();

module.exports = app;