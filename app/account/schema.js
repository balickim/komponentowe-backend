const pool = require('../../databasePool');

// pool.connect((err, client, done) => {
//     const shouldAbort = err => {
//         if (err) {
//             console.error('Error in transaction', err.stack)
//             client.query('ROLLBACK', err => {
//                 if (err) {
//                     console.error('Error rolling back client', err.stack)
//                 }
//                 // release the client back to the pool
//                 done()
//             })
//         }
//         return !!err
//     }
//     client.query('BEGIN', err => {
//         if (shouldAbort(err)) return
//         client.query(
//             'INSERT INTO users(name) VALUES($1) RETURNING id',
//             ['brianc'],
//             (err, res) => {
//                 if (shouldAbort(err)) return
//                 client.query(
//                     'INSERT INTO photos(user_id, photo_url) VALUES ($1, $2)',
//                     [res.rows[0].id, 's3.bucket.foo'],
//                     (err, res) => {
//                         if (shouldAbort(err)) return
//                         client.query('COMMIT', err => {
//                             if (err) {
//                                 console.error('Error committing transaction', err.stack)
//                             }
//                             done()
//                         })
//                     })
//             })
//     })
// })

class Schema {
    static createSchema({ schemaName, schemaOwner }) {
        return new Promise((resolve, reject) => {
            pool.query(
                `CREATE SCHEMA ${schemaName} AUTHORIZATION ${schemaOwner}`,
                // [schemaName, schemaOwner],
                (error, response) => {
                    if (error) return reject(error);

                    resolve();
                }
            );
        });
    }

    static createSchemaTables({ schemaName }) {
        return new Promise((resolve, reject) => {
            pool.query(
                `   CREATE TABLE ${schemaName}.test
                    (
                        id SERIAL PRIMARY KEY
                        
                    );`,
                (error, response) => {
                    if (error) return reject(error);

                    resolve();
                }
            );
        });
    }

    static addSchemaToCatalog({ organizationName, schemaName, schemaOwner }) {
        return new Promise((resolve, reject) => {
            pool.query(
                `INSERT INTO mainCatalog.catalog("organizationname", "schemaname", "schemaowner", "createddate", "expirationdate") 
                    VALUES ($1, $2, $3, current_date, current_date + 1000)`,
                [organizationName, schemaName, schemaOwner],
                (error, response) => {
                    if (error) return reject(error);

                    resolve();
                }
            );
        });
    }
}

// Schema.createSchema({ schemaName: 'erferferferfef', schemaOwner: 'zjahplxb' })
//     .then(() => console.log('Schema created!'))
//     .catch(error => console.error('error', error));

// Schema.createSchemaTables({ schemaName: 'erferferferfef' })
//     .then(() => console.log('Schemas tables created'))
//     .catch(error => console.error('error', error));

// Schema.addSchemaToCatalog({ organizationName: 'erf', schemaName: 'erfef', schemaOwner: 'zjahplxb' })
//     .then(() => console.log('Schema added to catalog!'))
//     .catch(error => console.error('error', error));

module.exports = Schema;