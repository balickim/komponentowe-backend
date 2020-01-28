const { Router } = require('express');
const ClinicTable = require('../clinic/table.js');
const { correctApiKey } = require('./helper')

const router = new Router();

router.get('/', (req, res, next) => {
    const { apikey } = req.headers;

    correctApiKey(apikey)
        .then(() => {
            return ClinicTable.getClinics()
        })
        .then((clinic) => { res.json(clinic) })
        .catch(error => next(error));
});

router.get('/:id', (req, res, next) => {
    const { apikey } = req.headers;
    const { id } = req.params;

    correctApiKey(apikey)
        .then(() => {
            return ClinicTable.getClinic({ id })
        })
        .then((clinic) => { res.json(clinic) })
        .catch(error => next(error));
});

router.post('/', (req, res, next) => {
    const { apikey } = req.headers;
    const {
        idmiasta,
        nazwaprzychodni,
        ulica,
        kodpocztowy,
        numertelefonu,
        email } = req.body;

    correctApiKey(apikey)
        .then(() => {
            return ClinicTable.addClinic({ idmiasta, nazwaprzychodni, ulica, kodpocztowy, numertelefonu, email })
        })
        .then(() => res.json({ message: 'added' }))
        .catch(error => next(error));
});

router.put('/', (req, res, next) => {
    const { apikey } = req.headers;
    const {
        idprzychodni,
        idmiasta,
        nazwaprzychodni,
        ulica,
        kodpocztowy,
        numertelefonu,
        email } = req.body;

    correctApiKey(apikey)
        .then(() => {
            return ClinicTable.updateClinic({ idprzychodni, idmiasta, nazwaprzychodni, ulica, kodpocztowy, numertelefonu, email })
        })
        .then(() => res.json({ message: 'updated' }))
        .catch(error => next(error));
});

router.delete('/:id', (req, res, next) => {
    const { apikey } = req.headers;
    const { id } = req.params;

    correctApiKey(apikey)
        .then(() => {
            return ClinicTable.deleteClinic({ id })
        })
        .then(() => res.json({ message: 'deleted' }))
        .catch(error => next(error));
});

module.exports = router;