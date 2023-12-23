const express = require('express');
const router = express.Router();

const alumniStudentController = require('../controllers/alumniStudentController');
const alumniManagerController = require('../controllers/alumniManagerController');
const homeController = require('../controllers/homeController');
const eventsController = require('../controllers/eventsController');

// Models (assuming these exist)
const Events = require('../models/events'); // Update with the correct path
const AlumniStudent = require('../models/alumniStudent'); // Update with the correct path
const AlumniManager = require('../models/alumniManager'); // Update with the correct path

const { authenticateToken } = require('../middleware/authMiddleware');
const { cookieJwtAuth } = require('../middleware/cookieJwtAuth');


// Home routes
router.get('/', homeController.index);

// Registration options routes
router.get('/registration-options', (req, res) => res.render('registrationOptions', { title: 'UConnect - Registration Options' }));

// Login options routes
router.get('/login-options', (req, res) => res.render('loginOptions', { title: 'UConnect - Login Options' }));

// Alumni student registration and login routes
router.get('/registration-options/alumni-student', (req, res) => res.render('alumniStudentRegistration', { title: 'UConnect - Alumni Student Registration' }));
router.post('/registration-options/alumni-student', alumniStudentController.registerAlumniStudent);
router.get('/login-options/alumni-student', (req, res) => res.render('alumniStudentLogin', { title: 'UConnect - Alumni Student Login' }));
router.post('/login-options/alumni-student', alumniStudentController.loginAlumniStudent);

// Alumni manager registration and login routes
router.get('/registration-options/alumni-manager', (req, res) => res.render('alumniManagerRegistration', { title: 'UConnect - Alumni Manager Registration' }));
router.post('/registration-options/alumni-manager', alumniManagerController.registerAlumniManager);
router.get('/login-options/alumni-manager', (req, res) => res.render('alumniManagerLogin', { title: 'Alumni Manager Login' }));
router.post('/login-options/alumni-manager', alumniManagerController.loginAlumniManager);

router.get('/alumni-student/all-events', (req, res) => eventsController.displayAlumniStudentAllEvents(req, res, { currentUser: req.user }));

router.get('/alumni-student/add-event', cookieJwtAuth('Alumni Student'), async (req, res) => {
    try {
        const alumniStudents = await AlumniStudent.find();
        const alumniManagers = await AlumniManager.find();
        const currentStudentUser = req.user;
        res.render('alumniStudentAddEventDashboard', {
            title: 'UConnect - Alumni Student Add New Event',
            alumniStudents,
            alumniManagers,
            currentStudentUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
router.post('/alumni-student/add-event', cookieJwtAuth('Alumni Student'), eventsController.alumniStudentAddEvent);


router.get('/alumni-student/edit-account', cookieJwtAuth('Alumni Student'), async (req, res) => {
    try {
        const alumniStudent = await AlumniStudent.findById(req.user.id);
        const currentStudentUser = req.user;
        if (!alumniStudent) {
            return res.status(404).send('Alumni Student not found');
        }
        res.render('alumniStudentEditAccountDashboard', {
            title: 'UConnect - Alumni Student Edit Account',
            alumniStudent,
            currentStudentUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
router.post('/alumni-student/edit-account', cookieJwtAuth('Alumni Student'), alumniStudentController.updateAlumniStudentDetails);

router.delete('/alumni-student/delete-event/:id', eventsController.deleteEvent);

router.patch('/alumni-student/participate/:id', cookieJwtAuth('Alumni Student'), eventsController.participateInEvent);

router.get('/alumni-student/edit-event', cookieJwtAuth('Alumni Student'), (req, res) => res.render('alumniStudentEditEventDashboard', { title: 'UConnect - Alumni Student Edit Event' }));
router.post('/alumni-student/edit-event', cookieJwtAuth('Alumni Student'), eventsController.updateEvent);


// -------------------------------------------Manager Version--------------------------------------------------
router.get('/alumni-manager/all-events', (req, res) => eventsController.displayAlumniManagerAllEvents(req, res, { currentUser: req.user }));

router.get('/alumni-manager/add-event', cookieJwtAuth('Alumni Manager'), async (req, res) => {
    try {
        const alumniStudents = await AlumniStudent.find();
        const alumniManagers = await AlumniManager.find();
        const currentManagerUser = req.user;
        res.render('alumniManagerAddEventDashboard', {
            title: 'UConnect - Alumni Manager Add New Event',
            alumniStudents,
            alumniManagers,
            currentManagerUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
router.post('/alumni-manager/add-event', cookieJwtAuth('Alumni Manager'), eventsController.alumniManagerAddEvent);


router.get('/alumni-manager/edit-account', cookieJwtAuth('Alumn Manager'), async (req, res) => {
    try {
        const alumniStudent = await AlumniStudent.findById(req.user.id);
        const currentManagerUser = req.user;
        if (!alumniStudent) {
            return res.status(404).send('Alumni Manager not found');
        }
        res.render('alumniManagerEditAccountDashboard', {
            title: 'UConnect - Alumni Manager Edit Account',
            alumniStudent,
            currentManagerUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
router.post('/alumni-manager/edit-account', cookieJwtAuth('Alumni Manager'), alumniManagerController.updateAlumniManagerDetails);

router.delete('/alumni-manager/delete-event/:id', eventsController.deleteEvent);

router.patch('/alumni-manager/participate/:id', cookieJwtAuth('Alumni Manager'), eventsController.participateInEvent);

router.get('/alumni-manager/edit-event', cookieJwtAuth('Alumni Manger'), (req, res) => res.render(
    'alumniManagerEditEventDashboard', {
    title: 'UConnect - Alumni Manager Edit Event'
}));
router.post('/alumni-manager/edit-event', cookieJwtAuth('Alumni Manager'), eventsController.updateEvent);

// -----------------------------------------Manager Version End--------------------------------------------------

router.get('/checkout-events', eventsController.displayAllEvents);

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login-options'); // Redirect to the login page or home page
});
module.exports = router;



