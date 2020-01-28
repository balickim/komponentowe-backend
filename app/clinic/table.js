const pool = require('../../databasePool');

class ClinicTable {
    static getClinics() {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT * FROM przychodnia`,
                (error, response) => {
                    if (error) return reject(error);

                    resolve(response.rows);
                }
            );
        });
    }
    static getClinic({ id }) {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT * FROM przychodnia WHERE idprzychodni = $1`,
                [id],
                (error, response) => {
                    if (error) return reject(error);

                    resolve(response.rows[0]);
                }
            );
        });
    }

    static addClinic({ idmiasta, nazwaprzychodni, ulica, kodpocztowy, numertelefonu, email }) {
        return new Promise((resolve, reject) => {
            pool.query(
                `INSERT INTO przychodnia (idmiasta, nazwaprzychodni, ulica, kodpocztowy, numertelefonu, email)
                VALUES ($1,$2,$3,$4,$5,$6);`,
                [idmiasta, nazwaprzychodni, ulica, kodpocztowy, numertelefonu, email],
                (error, response) => {
                    if (error) return reject(error);

                    resolve();
                }
            );
        });
    }

    static updateClinic({ idprzychodni, idmiasta, nazwaprzychodni, ulica, kodpocztowy, numertelefonu, email }) {
        return new Promise((resolve, reject) => {
            pool.query(
                `UPDATE przychodnia
                SET idmiasta = $1,
                    nazwaprzychodni = $2,
                    ulica = $3,
                    kodpocztowy = $4,
                    numertelefonu = $5,
                    email = $6
                WHERE
                idprzychodni = $7;`,
                [idmiasta, nazwaprzychodni, ulica, kodpocztowy, numertelefonu, email, idprzychodni],
                (error, response) => {
                    if (error) return reject(error);

                    resolve();
                }
            );
        });
    }

    static deleteClinic({ id }) {
        return new Promise((resolve, reject) => {
            pool.query(
                `DELETE FROM przychodnia
                WHERE
                idprzychodni = $1;`,
                [id],
                (error, response) => {
                    if (error) return reject(error);

                    resolve();
                }
            );
        });
    }
}

module.exports = ClinicTable;