const AlumniStudent = require('../models/alumniStudent');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registers a new alumni student
const registerAlumniStudent = async (req, res) => {
    try {
        let existingStudent = await AlumniStudent.findOne({ emailAddress: req.body.emailAddress.toLowerCase() });
        if (existingStudent) {
            return res.status(400).render('alumniStudentRegistration', {
                title: 'UConnect - Register as Alumni Student',
                message: 'Email address is already registered. Please use a different email.'
            });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        let alumniStudent = new AlumniStudent({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            emailAddress: req.body.emailAddress.toLowerCase(),
            password: hashedPassword,
            accountType: 'Alumni Student', // Only one valid option
            graduationYear: req.body.graduationYear
        });
        await alumniStudent.save();
        res.redirect('/login-options'); // Updated route
    } catch (error) {
        res.status(500).render('loginOptions', {
            message: 'An error occurred during registration. Please try again.'
        });
    }
};

// Logs in an alumni student
const loginAlumniStudent = async (req, res) => {
    try {
        const alumniStudent = await AlumniStudent.findOne({ emailAddress: req.body.emailAddress });
        if (alumniStudent && (await bcrypt.compare(req.body.password, alumniStudent.password))) {
            const token = jwt.sign({ id: alumniStudent._id, role: 'Alumni Student', currentUser: alumniStudent.emailAddress }, process.env.JWT_SECRET, {
                expiresIn: '30m', 
            });
            res.cookie('token', token, { httpOnly: true });
            res.redirect('/alumni-student/all-events'); 
        } else {
            res.status(400).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ message: "Login error. Please try again." });
    }
};

// Fetch alumni student details
const getAlumniStudentDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const alumniStudent = await AlumniStudent.findById(userId);
        if (!alumniStudent) {
            return res.status(404).send('Alumni student not found.');
        }
        res.render('alumniStudentEditAccount', {
            alumniStudent: alumniStudent,
            message: null
        });
    } catch (error) {
        res.status(500).send('Error fetching alumni student details.');
    }
};

// Update alumni student details
const updateAlumniStudentDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const { firstName, lastName, emailAddress, newPassword, newPasswordConfirm } = req.body;
        const alumniStudent = await AlumniStudent.findById(userId);
        if (!alumniStudent) {
            return res.status(404).send('Alumni student not found.');
        }
        if (firstName) alumniStudent.firstName = firstName;
        if (lastName) alumniStudent.lastName = lastName;
        if (emailAddress && emailAddress.toLowerCase() !== alumniStudent.emailAddress) {
            const existingStudent = await AlumniStudent.findOne({ emailAddress: emailAddress.toLowerCase() });
            if (existingStudent) {
                return res.status(400).send('Email address is already in use. Please use a different email.');
            }
            alumniStudent.emailAddress = emailAddress.toLowerCase();
        }
        if (newPassword && newPasswordConfirm) {
            if (newPassword === newPasswordConfirm) {
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                alumniStudent.password = hashedPassword;
            } else {
                return res.status(400).send('Passwords do not match.');
            }
        }
        await alumniStudent.save();
        req.session.message = 'Your profile has been updated successfully.';
        res.redirect('/alumni-student/all-events');
    } catch (error) {
        res.status(500).send('Error updating alumni student details.');
    }
};


module.exports = {
    registerAlumniStudent,
    loginAlumniStudent,
    getAlumniStudentDetails,
    updateAlumniStudentDetails
};
