const pool = require('../../databasePool');

class ReceptionistTable {
    static storeReceptionist({ login, haslo }) {
        return new Promise((resolve, reject) => {
            pool.query(
                `INSERT INTO recepcja (login, haslo) VALUES ($1,$2);`,
                [login, haslo],
                (error, response) => {
                    if (error) return reject(error);

                    resolve();
                }
            );
        });
    }

    static fillDataOfReceptionist({ imie, nazwisko, idplci, ulica, numerlokalu, miejscowosc, kodpocztowy, numertelefonu, email }) {
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

    static fillIdOfDataOfReceptionist({ login, haslo, imie, nazwisko, email }) {
        return new Promise((resolve, reject) => {
            pool.query(
                `UPDATE recepcja SET idrecepcjonistki = (SELECT idpracownika 
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

    static getReceptionist({ login }) {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT idrecepcjonistki, login, haslo FROM recepcja 
                WHERE login = $1`,
                [login],
                (error, response) => {
                    if (error) return reject(error);

                    resolve({ receptionist: response.rows[0] });
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

module.exports = ReceptionistTable;