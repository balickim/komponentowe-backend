const { API_KEY } = require('../../secrets')

const correctApiKey = (apiKey) => {
    return new Promise((resolve, reject) => {
        if (API_KEY === apiKey) {
            console.log("correctApiKey: " + apiKey);
            return resolve();
        } else {
            const error = 'Nieprawidłowy apikey (' + apiKey + ")";

            return reject(error);
        }
    });
};

module.exports = { correctApiKey };