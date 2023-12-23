const mongoose = require('mongoose');
const Event = require('../models/events');
const { validateEvent } = require('../startup/validation');

// Function to create a new event
const alumniStudentAddEvent = async (req, res) => {
    try {
        // Validate the event data
        const { error } = validateEvent(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        // Create a new event object and save it to the database
        const event = new Event(req.body);
        await event.save();
        // Redirect to the all events page upon successful creation
        res.redirect('/alumni-student/all-events');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};
// Function to create a new event
const alumniManagerAddEvent = async (req, res) => {
    try {
        // Validate the event data
        const { error } = validateEvent(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        // Create a new event object and save it to the database
        const event = new Event(req.body);
        await event.save();
        // Redirect to the all events page upon successful creation
        res.redirect('/alumni-manager/all-events');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

// Function to retrieve all events
const displayEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.send(events);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

// In your eventsController.js
const displayAlumniStudentAllEvents = async (req, res) => {
    try {
        const events = await Event.find()
            .populate('organizer', 'firstName lastName emailAddress')
            .populate('alumniStudentGuests', 'firstName lastName emailAddress')
            .populate('alumniManagerGuests', 'firstName lastName emailAddress');
        res.render('alumniStudentAllEventsDashboard', { title: 'UConnect - Alumni Manager All Events', events });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

// In your eventsController.js
const displayAlumniManagerAllEvents = async (req, res) => {
    try {
        const events = await Event.find()
            .populate('organizer', 'firstName lastName emailAddress')
            .populate('alumniStudentGuests', 'firstName lastName emailAddress')
            .populate('alumniManagerGuests', 'firstName lastName emailAddress');
        res.render('alumniManagerAllEventsDashboard', { title: 'UConnect - Alumni Student All Events', events });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

// In your eventsController.js
const displayAllEvents = async (req, res) => {
    try {
        const events = await Event.find()
            .populate('organizer', 'firstName lastName emailAddress')
            .populate('alumniStudentGuests', 'firstName lastName emailAddress')
            .populate('alumniManagerGuests', 'firstName lastName emailAddress');
        res.render('checkoutEvents', { title: 'UConnect - Alumni Student All Events', events });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

// Function to retrieve a specific event by ID
const displayEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).send('Event not found');
        }
        res.send(event);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

// Function to update an existing event
const updateEvent = async (req, res) => {
    try {
        const { error } = validateEvent(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        const event = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // Option to return the modified document rather than the original
        );

        if (!event) {
            return res.status(404).send('Event not found');
        }

        res.send(event);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

// Function to delete an event
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndRemove(req.params.id);

        if (!event) {
            return res.status(404).send('Event not found');
        }

        res.send('Event deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

// Function to participate in an event
const participateInEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { userEmail } = req.body;
        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        // Find the ObjectId of the user
        const user = await AlumniStudent.findOne({ emailAddress: userEmail });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check if user is already a participant
        if (event.alumniStudentGuests.includes(user._id)) {
            return res.json({ success: false, message: "You can't join, because you're already in the event" });
        }

        // Add the user's ObjectId to the alumniStudentGuests list
        event.alumniStudentGuests.push(user._id);
        await event.save();

        res.json({ success: true, message: 'Successfully joined the event!' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};
module.exports = {
    alumniStudentAddEvent,
    alumniManagerAddEvent,
    displayAllEvents,
    displayAlumniStudentAllEvents,
    displayAlumniManagerAllEvents,
    displayEventById,
    updateEvent,
    deleteEvent,
    participateInEvent,
};
