const { API_KEY } = require('../../secrets')

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

module.exports = { correctApiKey };