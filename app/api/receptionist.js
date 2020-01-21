const { Router } = require('express');
const ReceptionistTable = require('../receptionist/table');
const { correctApiKey } = require('./helper')

const router = new Router();

router.get('/:login', (req, res, next) => {
    const { apikey } = req.headers;
    const { login } = req.params;

    correctApiKey(apikey)
        .then(() => {
            return ReceptionistTable.getReceptionist({ login })
        })
        .then((receptionist) => { res.json(receptionist) })
        .catch(error => next(error));
});

router.post('/signup', (req, res, next) => {
    const { apikey } = req.headers;
    const {
        login,
        haslo } = req.body;

    correctApiKey(apikey)
        .then(() => {
            ReceptionistTable.getReceptionist({ login })
                .then(({ receptionist }) => {
                    if (!receptionist) {

                        return ReceptionistTable.storeReceptionist({ login, haslo })

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

router.put('/datafillup', (req, res, next) => {
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
            ReceptionistTable.getReceptionist({ login })
                .then(({ receptionist }) => {
                    if (receptionist) {

                        return ReceptionistTable.fillDataOfReceptionist({ imie, nazwisko, idplci, ulica, numerlokalu, miejscowosc, kodpocztowy, numertelefonu, email })
                            && ReceptionistTable.fillIdOfDataOfReceptionist({ login, haslo, imie, nazwisko, email })

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

router.get('/data', (req, res, next) => {
    const { apikey } = req.headers;
    const { id } = req.body;

    correctApiKey(apikey)
        .then(() => {
            return ReceptionistTable.getProfile({ id })
        })
        .then((receptionist) => { res.json(receptionist) })
        .catch(error => next(error));
});

router.post('/login', (req, res, next) => {
    const { apikey } = req.headers;
    const { login, haslo } = req.body;

    correctApiKey(apikey)
        .then(() => {
            ReceptionistTable.getReceptionist({ login })
                .then(({ receptionist }) => {
                    if (receptionist && receptionist.haslo === haslo) {

                        let id = receptionist.idrecepcjonistki;
                        res.json({ message: 'zalogowano', idrecepcjonistki: id })

                    } else {
                        const error = new Error('Incorrect username or password');

                        error.statusCode = 403;

                        throw error;
                    }
                })
                // .then(() => res.json({ message: 'zalogowano' }))
                .catch(error => next(error));
        })
        // .then(() => res.json({ message: 'dodano użytkownika ' + req.body.username }))
        .catch(error => next(error));
});

router.delete('/:id', (req, res, next) => {
    const { apikey } = req.headers;
    const { id } = req.params;

    correctApiKey(apikey)
        .then(() => {
            return ReceptionistTable.deleteReceptionistByLogin({ id })
                && ReceptionistTable.deleteProfileReceptionistById({ id })
        })
        .then(() => res.json({ message: 'usunięto' }))
        .catch(error => next(error));
});

module.exports = router;