const pool = require('../../databasePool');

class PatientTable {
    static storePatient({ login, haslo, imie, nazwisko, idplci, ulica, numerlokalu, miejscowosc, kodpocztowy, numertelefonu, email }) {
        return new Promise((resolve, reject) => {
            pool.query(
                `INSERT INTO danepacjenta (login, haslo, imie, nazwisko, idplci, ulica, numerlokalu, miejscowosc, kodpocztowy, numertelefonu, email) 
                VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
                [login, haslo, imie, nazwisko, idplci, ulica, numerlokalu, miejscowosc, kodpocztowy, numertelefonu, email],
                (error, response) => {
                    if (error) return reject(error);

                    resolve();
                }
            );
        });
    }

    static getPatient({ login }) {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT idpacjenta, login, haslo, imie, nazwisko, idplci, ulica, numerlokalu, miejscowosc, kodpocztowy, numertelefonu, email, pesel FROM danepacjenta 
                WHERE login = $1`,
                [login],
                (error, response) => {
                    if (error) return reject(error);

                    resolve({ patient: response.rows[0] });
                }
            )
        });
    }

    static getPatientByPesel({ pesel }) {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT idpacjenta, imie, nazwisko, idplci, ulica, numerlokalu, miejscowosc, kodpocztowy, numertelefonu, email, pesel FROM danepacjenta 
                WHERE pesel = $1`,
                [pesel],
                (error, response) => {
                    if (error) return reject(error);

                    resolve({ patient: response.rows[0] });
                }
            )
        });
    }
}

module.exports = PatientTable;