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
                `SELECT idrecepcjonistki, idpracownika, login, haslo FROM recepcja 
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

    static deleteReceptionistByLogin({ id }) {
        return new Promise((resolve, reject) => {
            pool.query(
                `DELETE FROM recepcja 
                WHERE idpracownika = $1`,
                [id],
                (error, response) => {
                    if (error) return reject(error);

                    resolve({ patient: response.rows[0] });
                }
            )
        });
    }

    static deleteProfileReceptionistById({ id }) {
        return new Promise((resolve, reject) => {
            pool.query(
                `DELETE
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

    static addVisit({ idgrafiku, idcennika, idpacjenta, idrecepcjonistki, dataczasstart, dataczasstop }) {
        return new Promise((resolve, reject) => {
            pool.query(
                `INSERT INTO wizyta (idgrafiku, idcennika, idpacjenta, idrecepcjonistki, dataczasstart, dataczasstop)
                VALUES ($1,$2,$3,$4,$5,$6);`,
                [idgrafiku, idcennika, idpacjenta, idrecepcjonistki, dataczasstart, dataczasstop],
                (error, response) => {
                    if (error) return reject(error);

                    resolve();
                }
            )
        });
    }

    static getVisit({ idwizyty }) {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT idgrafiku, idcennika, idpacjenta, idrecepcjonistki, dataczasstart, dataczasstop FROM wizyta 
                WHERE idwizyty = $1`,
                [idwizyty],
                (error, response) => {
                    if (error) return reject(error);

                    resolve(response.rows[0]);
                }
            )
        });
    }

    static updateVisit({ idwizyty, idgrafiku, idcennika, idpacjenta, idrecepcjonistki, dataczasstart, dataczasstop }) {
        return new Promise((resolve, reject) => {
            pool.query(
                `UPDATE wizyta
                SET idgrafiku = $1,
                    idcennika = $2,
                    idpacjenta = $3,
                    idrecepcjonistki = $4,
                    dataczasstart = $5,
                    dataczasstop = $6
                WHERE
                idwizyty = $7;`,
                [idgrafiku, idcennika, idpacjenta, idrecepcjonistki, dataczasstart, dataczasstop, idwizyty],
                (error, response) => {
                    if (error) return reject(error);

                    resolve();
                }
            )
        });
    }

    static deleteVisit({ idwizyty }) {
        return new Promise((resolve, reject) => {
            pool.query(
                `DELETE FROM wizyta
                WHERE idwizyty = $1;`,
                [idwizyty],
                (error, response) => {
                    if (error) return reject(error);

                    resolve();
                }
            )
        });
    }
}

module.exports = ReceptionistTable;