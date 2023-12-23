const AlumniManager = require('../models/alumniManager');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register an alumni manager
const registerAlumniManager = async (req, res) => {
    try {
        const existingManager = await AlumniManager.findOne({ emailAddress: req.body.emailAddress });
        if (existingManager) {
            return res.status(400).render('alumniManagerRegistration', {
                title: 'UConnect - Register as Alumni Manager', // Updated title
                message: 'Email address is already registered. Please use a different email.'
            });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const alumniManager = new AlumniManager({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            emailAddress: req.body.emailAddress.toLowerCase(),
            password: hashedPassword,
            accountType: 'Alumni Manager', // Only one valid option
            graduationYear: req.body.graduationYear
        });
        await alumniManager.save();
        res.redirect('/login-options'); // Updated redirect path
    } catch (error) {
        res.status(500).render('loginOptions', {
            message: 'An error occurred during registration. Please try again.'
        });
    }
};

// Login an alumni manager
const loginAlumniManager = async (req, res) => {
    try {
        const alumniManager = await AlumniManager.findOne({ emailAddress: req.body.emailAddress });
        if (alumniManager && (await bcrypt.compare(req.body.password, alumniManager.password))) {
            const token = jwt.sign({ id: alumniManager._id, role: 'Alumni Manager',currentUser: alumniManager.emailAddress}, process.env.JWT_SECRET, {
                expiresIn: '30m', // 30 minutes
            });
            res.cookie('token', token, { httpOnly: true });
            res.redirect('/alumni-manager/all-events');
        } else {
            res.status(400).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ message: "Login error. Please try again." });
    }
};

// Fetch alumni student details
const getAlumniManagerDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const alumniManager = await AlumniManager.findById(userId);
        if (!alumniManager) {
            return res.status(404).send('Alumni student not found.');
        }
        res.render('alumniManagerEditAccount', {
            alumniManager: alumniManager,
            message: null
        });
    } catch (error) {
        res.status(500).send('Error fetching alumni student details.');
    }
};

// Update alumni student details
const updateAlumniManagerDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const { firstName, lastName, emailAddress, newPassword, newPasswordConfirm } = req.body;
        const alumniManager = await AlumniManager.findById(userId);
        if (!alumniManager) {
            return res.status(404).send('Alumni student not found.');
        }
        if (firstName) alumniManager.firstName = firstName;
        if (lastName) alumniManager.lastName = lastName;
        if (emailAddress && emailAddress.toLowerCase() !== alumniManager.emailAddress) {
            const existingStudent = await AlumniManager.findOne({ emailAddress: emailAddress.toLowerCase() });
            if (existingStudent) {
                return res.status(400).send('Email address is already in use. Please use a different email.');
            }
            alumniManager.emailAddress = emailAddress.toLowerCase();
        }
        if (newPassword && newPasswordConfirm) {
            if (newPassword === newPasswordConfirm) {
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                alumniManager.password = hashedPassword;
            } else {
                return res.status(400).send('Passwords do not match.');
            }
        }
        await alumniManager.save();
        req.session.message = 'Your profile has been updated successfully.';
        res.redirect('/alumni-student/all-events');
    } catch (error) {
        res.status(500).send('Error updating alumni student details.');
    }
};


module.exports = {  
    registerAlumniManager,
    loginAlumniManager,
    getAlumniManagerDetails,
    updateAlumniManagerDetails
}