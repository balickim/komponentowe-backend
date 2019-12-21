const { Router } = require('express');
const DoctorTable = require('../doctor/table');
const { correctApiKey } = require('./helper')

const router = new Router();

router.get('/', (req, res, next) => {
    const { apikey } = req.headers;
    const { login } = req.body;

    correctApiKey(apikey)
        .then(() => {
            return DoctorTable.getDoctor({ login })
        })
        .then((doctor) => { res.json(doctor) })
        .catch(error => next(error));
});

router.post('/signup', (req, res, next) => {
    const { apikey } = req.headers;
    const {
        login,
        haslo } = req.body;

    correctApiKey(apikey)
        .then(() => {
            DoctorTable.getDoctor({ login })
                .then(({ doctor }) => {
                    if (!doctor) {

                        return DoctorTable.storeDoctor({ login, haslo })

                    } else {
                        const error = new Error('Ten login jest już zajęty!');

                        error.statusCode = 409;

                        throw error;
                    }
                })
                .catch(error => next(error));
        })
        .then(() => res.json({ message: 'dodano' }))
        .catch(error => next(error));
});

router.put('/uzupelnijdane', (req, res, next) => {
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
            DoctorTable.getDoctor({ login })
                .then(({ doctor }) => {
                    if (doctor) {

                        return DoctorTable.fillDataOfDoctor({ imie, nazwisko, idplci, ulica, numerlokalu, miejscowosc, kodpocztowy, numertelefonu, email })
                            && DoctorTable.fillIdOfDataOfDoctor({ login, haslo, imie, nazwisko, email })

                    } else {
                        const error = new Error('Nie ma takiego lekarza');

                        error.statusCode = 409;

                        throw error;
                    }
                })
                .catch(error => next(error));
        })
        .then(() => res.json({ message: 'dodano' }))
        .catch(error => next(error));
});

router.get('/pobierzdane', (req, res, next) => {
    const { apikey } = req.headers;
    const { id } = req.body;

    correctApiKey(apikey)
        .then(() => {
            return DoctorTable.getProfile({ id })
        })
        .then((doctor) => { res.json(doctor) })
        .catch(error => next(error));
});

router.post('/login', (req, res, next) => {
    const { apikey } = req.headers;
    const { login, haslo } = req.body;

    correctApiKey(apikey)
        .then(() => {
            DoctorTable.getDoctor({ login })
                .then(({ doctor }) => {
                    if (doctor && doctor.haslo === haslo) {
                        let id = doctor.idlekarza;
                        res.json({ message: 'zalogowano', idlekarza: id })

                    } else {
                        const error = new Error('Incorrect username or password');

                        error.statusCode = 403;

                        throw error;
                    }
                })
                // .then(() => res.json({ message: 'zalogowano' }))
                .catch(error => next(error));
        })
        .catch(error => next(error));
});

router.get('/specialization/:id', (req, res, next) => {
    const { apikey } = req.headers;
    const { id } = req.params;

    correctApiKey(apikey)
        .then(() => {
            return DoctorTable.getSpecialization({ idlekarza: id })
                .then((doctor) => { res.json(doctor) })
                .catch(error => next(error));
        })
        .catch(error => next(error));
});

module.exports = router;