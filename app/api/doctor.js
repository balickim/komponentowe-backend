const { Router } = require('express');
const DoctorTable = require('../doctor/table');
const { correctApiKey } = require('./helper')

const router = new Router();

router.get('/:login', (req, res, next) => {
    const { apikey } = req.headers;
    const { login } = req.params;

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
                        const error = new Error('Login is taken');

                        error.statusCode = 409;

                        throw error;
                    }
                })
                .catch(error => next(error));
        })
        .then(() => res.json({ message: 'added' }))
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
            DoctorTable.getDoctor({ login })
                .then(({ doctor }) => {
                    if (doctor) {

                        return DoctorTable.fillDataOfDoctor({ imie, nazwisko, idplci, ulica, numerlokalu, miejscowosc, kodpocztowy, numertelefonu, email })
                            && DoctorTable.fillIdOfDataOfDoctor({ login, haslo, imie, nazwisko, email })

                    } else {
                        const error = new Error('Doctor doesnt exist');

                        error.statusCode = 409;

                        throw error;
                    }
                })
                .catch(error => next(error));
        })
        .then(() => res.json({ message: 'added' }))
        .catch(error => next(error));
});

router.get('/data/:id', (req, res, next) => {
    const { apikey } = req.headers;
    const { id } = req.params;

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
                        let doctorid = doctor.idlekarza;
                        let workerid = doctor.idpracownika;
                        res.json({ doctorid: doctorid, workerid: workerid })

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

router.delete('/:id', (req, res, next) => {
    const { apikey } = req.headers;
    const { id } = req.params;

    correctApiKey(apikey)
        .then(() => {
            return DoctorTable.deleteDoctorByLogin({ id })
                && DoctorTable.deleteProfileDoctorById({ id })
        })
        .then(() => res.json({ message: 'deleted' }))
        .catch(error => next(error));
});

router.get('/fullschedule/:id', (req, res, next) => {
    const { apikey } = req.headers;
    const { id } = req.params;

    correctApiKey(apikey)
        .then(() => {
            return DoctorTable.getSchedule({ idlekarza: id })
        })
        .then((doctor) => { res.json(doctor) })
        .catch(error => next(error));
});

router.post('/searchschedule', (req, res, next) => {
    const { apikey } = req.headers;
    const { specializationname, surname, name } = req.body;

    correctApiKey(apikey)
        .then(() => {
            return DoctorTable.getScheduleByStrings({ rodzajspecjalizacji: specializationname, nazwisko: surname, imie: name })
        })
        .then((doctor) => { res.json(doctor) })
        .catch(error => next(error));
});

router.get('/schedule/:id/:day', (req, res, next) => {
    const { apikey } = req.headers;
    const { id, day } = req.params;

    correctApiKey(apikey)
        .then(() => {
            return DoctorTable.getScheduleByDay({ idlekarza: id, day: day })
        })
        .then((doctor) => { res.json(doctor) })
        .catch(error => next(error));
});

router.get('/', (req, res, next) => {
    const { apikey } = req.headers;

    correctApiKey(apikey)
        .then(() => {
            return DoctorTable.getDoctorsAndSpecialization()
        })
        .then((doctor) => { res.json(doctor) })
        .catch(error => next(error));
});

router.post('/doctorstemporary', (req, res, next) => {
    const { apikey } = req.headers;

    correctApiKey(apikey)
        .then(() => {
            return DoctorTable.getDoctorsTemporary()
        })
        .then((doctor) => { res.json(doctor) })
        .catch(error => next(error));
});

module.exports = router;