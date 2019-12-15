const { Router } = require('express');
const PatientTable = require('../patient/table.js');
const { correctApiKey } = require('./helper')

const router = new Router();

router.get('/', (req, res, next) => {
    const { apikey } = req.headers;
    const { login } = req.body;

    correctApiKey(apikey)
        .then(() => {
            return PatientTable.getPatient({ login })
        })
        .then((patient) => { res.json(patient) })
        .catch(error => next(error));
});

router.get('/:pesel', (req, res, next) => {
    const { apikey } = req.headers;
    const { pesel } = req.params;

    correctApiKey(apikey)
        .then(() => {
            return PatientTable.getPatientByPesel({ pesel })
        })
        .then((patient) => { res.json(patient) })
        .catch(error => next(error));
});

router.post('/signup', (req, res, next) => {
    const { apikey } = req.headers;
    const {
        login,
        haslo,
        imie,
        nazwisko,
        idplci,
        ulica,
        numerlokalu,
        miejscowosc,
        kodpocztowy,
        numertelefonu,
        email } = req.body;

    correctApiKey(apikey)
        .then(() => {
            PatientTable.getPatient({ login })
                .then(({ account }) => {
                    if (!account) {

                        return PatientTable.storePatient({ login, haslo, imie, nazwisko, idplci, ulica, numerlokalu, miejscowosc, kodpocztowy, numertelefonu, email })

                    } else {
                        const error = new Error('Ten login jest już zajęty!');

                        error.statusCode = 409;

                        throw error;
                    }
                })
        })
        .then(() => res.json({ message: 'dodano' }))
        .catch(error => next(error));
});

router.post('/login', (req, res, next) => {
    const { apikey } = req.headers;
    const { login, haslo } = req.body;

    correctApiKey(apikey)
        .then(() => {
            PatientTable.getPatient({ login })
                .then(({ patient }) => {
                    if (patient && patient.haslo === haslo) {
                        // const { sessionId } = account;

                        // return console.log("zalogowano");
                    } else {
                        const error = new Error('Incorrect username or password');

                        error.statusCode = 409;

                        throw error;
                    }
                })
                .then(() => res.json({ message: 'zalogowano' }))
                .catch(error => next(error));
        })
        // .then(() => res.json({ message: 'dodano użytkownika ' + req.body.username }))
        .catch(error => next(error));
});

module.exports = router;