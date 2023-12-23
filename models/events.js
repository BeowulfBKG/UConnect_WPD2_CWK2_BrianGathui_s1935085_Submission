const mongoose = require('mongoose');
const Joi = require('joi');

// Events Counter schema to keep track of the last ID used for events
const eventsCounterSchema = new mongoose.Schema({
     _id: { type: String, required: true },
     seq: { type: Number, default: 0 }
});
const EventsCounter = mongoose.model('EventsCounter', eventsCounterSchema);

// Function to get the next ID for a given model
const getNextSequenceValue = async (modelName) => {
     const counter = await EventsCounter.findOneAndUpdate(
          { _id: modelName },
          { $inc: { seq: 1 } },
          { new: true, upsert: true }
     );
     return counter.seq - 1;
};

// Mongoose schema for Events
const eventSchema = new mongoose.Schema({
     eventId: {
          type: Number,
          unique: true
     },
     title: {
          type: String,
          required: true,
          trim: true
     },
     date: {
          type: Date,
          required: true
     },
     startTime: {
          type: String,
          required: true
     },
     endTime: {
          type: String,
          required: true
     },
     location: {
          type: String,
          required: true
     },
     description: {
          type: String,
          required: true
     },
     eventCategory: {
          type: String,
          enum: ['Professional Development', 'Networking', 'Campus Events'],
     },
     organizer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'AlumniStudent',
          required: true
     },
     alumniStudentGuests: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'AlumniStudent'
     }],
     alumniManagerGuests: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'AlumniManager'
     }],
}, { timestamps: true });

// Pre-save hook to auto-increment eventId
eventSchema.pre('save', async function (next) {
     if (this.isNew) {
          try {
               const incrementedId = await getNextSequenceValue('event');
               this.eventId = incrementedId;
               return next(); // Return here after successful increment
          } catch (error) {
               return next(error); // Return the error to stop execution on error
          }
     }
     next();
});

// Joi validation schema for Events
const validateEvent = (event) => {
     const schema = Joi.object({
          title: Joi.string().required(),
          date: Joi.date().required(),
          startTime: Joi.string().required(),
          endTime: Joi.string().required(),
          location: Joi.string().required(),
          description: Joi.string().required(),
          eventCategory: Joi.string().valid('Professional Development', 'Networking', 'Campus Events'),
          organizer: Joi.objectId().required(),
          alumniStudentGuests: Joi.array().items(Joi.objectId()),
          alumniManagerGuests: Joi.array().items(Joi.objectId())
     });
     return schema.validate(event);
};

// Create the model from the schema
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
module.exports.validateEvent = validateEvent;
