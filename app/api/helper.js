const { API_KEY } = require('../../secrets')

const correctApiKey = (apiKey) => {
    return new Promise((resolve, reject) => {
        if (API_KEY === apiKey || 'undefined' === apiKey || undefined === apiKey) {
            console.log("if: " + apiKey);
            return resolve();
        } else {
            // const error = new Error('Nieprawidłowy API Key');
            const error = 'Nieprawidłowy apikey (' + apiKey + ")";

            return reject(error);
        }
    });
};

module.exports = { correctApiKey };