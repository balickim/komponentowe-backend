const pool = require('../../databasePool');

class DoctorTable {
    static storeDoctor({ login, haslo }) {
        return new Promise((resolve, reject) => {
            pool.query(
                `INSERT INTO lekarz (login, haslo) VALUES ($1,$2);`,
                [login, haslo],
                (error, response) => {
                    if (error) return reject(error);

                    resolve();
                }
            );
        });
    }

    static fillDataOfDoctor({ imie, nazwisko, idplci, ulica, numerlokalu, miejscowosc, kodpocztowy, numertelefonu, email }) {
        return new Promise((resolve, reject) => {
            pool.query(
                `INSERT INTO danepracownika (imie, nazwisko, idplci, ulica, numerlokalu, miejscowosc, kodpocztowy, numertelefonu, email)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9);`,
                [imie, nazwisko, idplci, ulica, numerlokalu, miejscowosc, kodpocztowy, numertelefonu, email],
                (error, response) => {
                    if (error) return reject(error);

                    resolve();
                }
            );
        });
    }

    static fillIdOfDataOfDoctor({ login, haslo, imie, nazwisko, email }) {
        return new Promise((resolve, reject) => {
            pool.query(
                `UPDATE lekarz SET idpracownika = (SELECT idpracownika 
                        FROM danepracownika 
                        WHERE imie = $1 AND nazwisko = $2 AND email = $3
                        LIMIT 1)
                        WHERE login = $4 AND haslo = $5;`,
                [imie, nazwisko, email, login, haslo],
                (error, response) => {
                    if (error) return reject(error);

                    resolve();
                }
            );
        });
    }

    static getDoctor({ login }) {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT idlekarza, login, haslo FROM lekarz 
                WHERE login = $1`,
                [login],
                (error, response) => {
                    if (error) return reject(error);

                    resolve({ doctor: response.rows[0] });
                }
            )
        });
    }

    static getProfile({ id }) {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT imie, nazwisko, idplci, ulica, numerlokalu, miejscowosc, kodpocztowy, numertelefonu, email 
                FROM danepracownika 
                WHERE idpracownika = $1`,
                [id],
                (error, response) => {
                    if (error) return reject(error);

                    resolve(response.rows[0]);
                }
            )
        });
    }
}

module.exports = DoctorTable;