// Renders the index view
exports.index = (req, res) => {
    // Render the 'index' view with the specified title and description
    res.render('index', {
        title: 'Uconnect', // The title of the page
        description: 'A platform for university alumni to connect and engage with events.' // The description of the page
    });
};

// Renders the registrationOptions view
exports.registrationOptions = (req, res) => {
    // Render the 'registrationOptions' view with the specified title
    res.render('registrationOptions', { title: 'registrationOptions Page' });
};

// Renders the loginOptions view
exports.loginOptions = (req, res) => {
    // Render the 'loginOptions' view with the specified title
    res.render('loginOptions', { title: 'loginOptions Page' });
};