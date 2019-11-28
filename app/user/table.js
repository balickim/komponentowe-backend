const pool = require('../../databasePool');

class UserTable {
    static storeAccount({ username, password }) {
        return new Promise((resolve, reject) => {
            pool.query(
                'INSERT INTO users (username,password) VALUES($1,$2)',
                [username, password],
                (error, response) => {
                    if (error) return reject(error);

                    resolve();
                }
            );
        });
    }

    static getAccount({ username }) {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT id, username, password FROM users 
                WHERE username = $1`,
                [username],
                (error, response) => {
                    if (error) return reject(error);

                    resolve({ account: response.rows[0] });
                }
            )
        });
    }

    static updateSessionId({ sessionId, usernameHash }) {
        return new Promise((resolve, reject) => {
            pool.query(
                'UPDATE account SET "sessionId" = $1 WHERE "usernameHash" = $2',
                [sessionId, usernameHash],
                (error, response) => {
                    if (error) return reject(error);

                    resolve();
                }
            );
        });
    }

    static getUsers() {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT * from users`,
                (error, response) => {
                    if (error) return reject(error);

                    resolve(response.rows);
                }
            )
        });
    }
}

// AccountTable.updateBalance({ accountId: 1, value: 1000000 })
//     .then(() => console.log('update occured'))
//     .catch(error => console.error('error', error));

module.exports = UserTable;