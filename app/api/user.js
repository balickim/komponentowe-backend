const { Router } = require('express');
const UserTable = require('../user/table.js');
const { correctApiKey } = require('./helper')
// const passport = require('passport');

const router = new Router();

// router.post('/authenticate',
//     passport.authenticate('headerapikey', { session: false, failureRedirect: '/api/unauthorized' }),
//     function (req, res) {
//         res.json({ message: "Authenticated" })
//     });

router.get('/', (req, res, next) => {
    const { apikey } = req.headers;

    correctApiKey(apikey)
        .then(() => {
            return UserTable.getUsers()
        })
        .then((users) => { res.json({ users }) })
        .catch(error => next(error));
});

router.get('/noapikey', (req, res, next) => {
    return UserTable.getUsers()
        .then((users) => { res.json({ users }) })
        .catch(error => next(error));
});

router.post('/signup', (req, res, next) => {
    const { apikey } = req.headers;
    const { username, password } = req.body;

    correctApiKey(apikey)
        .then(() => {
            UserTable.getAccount({ username })
                .then(({ account }) => {
                    if (!account) {

                        return UserTable.storeAccount({ username, password })

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
    const { username, password } = req.body;

    correctApiKey(apikey)
        .then(() => {
            UserTable.getAccount({ username })
                .then(({ account }) => {
                    if (account && account.password === password) {
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

router.get('/logout', (req, res, next) => {
    const { username } = Session.parse(req.cookies.sessionString);

    UserTable.updateSessionId({
        sessionId: null,
        usernameHash: hash(username)
    }).then(() => {
        res.clearCookie('sessionString');

        res.json({ message: 'Succesful logout' });
    })
        .catch(error => next(error));
});

router.get('/authenticated', (req, res, next) => {

    authenticatedAccount({ sessionString: req.cookies.sessionString })
        .then(({ authenticated }) => res.json({ authenticated }))
        .catch(error => next(error));
});

router.get('/dragons', (req, res, next) => {
    authenticatedAccount({ sessionString: req.cookies.sessionString })
        .then(({ account }) => {
            return AccountDragonTable.getAccountDragons({
                accountId: account.id
            });
        })
        .then(({ accountDragons }) => {
            return Promise.all(
                accountDragons.map(accountDragon => {
                    return getDragonWithTraits({ dragonId: accountDragon.dragonId });
                })
            );
        })
        .then(dragons => {
            res.json({ dragons });
        })
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

module.exports = router;