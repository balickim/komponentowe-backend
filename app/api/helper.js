const Session = require('../account/session');
const AccountTable = require('../account/table');
const { hash } = require('../account/helper');
const { API_KEY } = require('../../secrets')

const setSession = ({ username, res, sessionId }) => {
    return new Promise((resolve, reject) => {
        let session, sessionString;

        if (sessionId) {
            sessionString = Session.sessionString({ username, id: sessionId })

            setSessionCookie({ sessionString, res });

            resolve({ message: 'session restored' });
        } else {
            session = new Session({ username });
            sessionString = session.toString();

            AccountTable.updateSessionId({
                sessionId: session.id,
                usernameHash: hash(username)
            })
                .then(() => {
                    setSessionCookie({ sessionString, res });

                    resolve({ message: 'session created' });
                })
                .catch(error => reject(error));
        }
    });
}

const setSessionCookie = ({ sessionString, res }) => {
    res.cookie('sessionString', sessionString, {
        expire: Date.now() + 3600000,
        httpOnly: true,
        // secure: true // use with https
    });
}

const authenticatedAccount = ({ sessionString }) => {
    return new Promise((resolve, reject) => {
        if (!sessionString || !Session.verify(sessionString)) {
            const error = new Error('Invalid session');

            error.statusCode = 400;

            return reject(error);
        } else {
            const { username, id } = Session.parse(sessionString);

            AccountTable.getAccount({ usernameHash: hash(username) })
                .then(({ account }) => {
                    const authenticated = account.sessionId === id;

                    resolve({ account, authenticated, username });
                })
                .catch(error => reject(error));
        }
    });
};

const correctApiKey = (apiKey) => {
    return new Promise((resolve, reject) => {
        if (API_KEY === apiKey) {
            return resolve();
        } else {
            // const error = new Error('Nieprawidłowy API Key');
            const error = 'Nieprawidłowy API Key';

            return reject(error);
        }
    });
};

module.exports = { setSession, authenticatedAccount, correctApiKey };