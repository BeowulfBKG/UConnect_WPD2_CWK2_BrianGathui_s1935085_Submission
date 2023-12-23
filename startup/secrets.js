// Import the crypto module used for secret keys
const crypto = require('crypto');

// Function to generate a secret key
function generateSecretKey() {
    return crypto.randomBytes(32).toString('hex');
}

// Generate the secret keys
const ACCESS_TOKEN_SECRET = generateSecretKey();
const JWT_SECRET = generateSecretKey();

// Export the secret keys
module.exports = {
    ACCESS_TOKEN_SECRET, // Access token secret key
    JWT_SECRET, // JWT secret key
};