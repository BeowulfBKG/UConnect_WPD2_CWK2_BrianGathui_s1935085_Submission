const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true }); // or your preferred configuration

module.exports = csrfProtection;