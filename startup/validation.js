const Joi = require('joi');
const joiObjectId = require('joi-objectid');

// Add the joiObjectId extension to the Joi object
Joi.objectId = joiObjectId(Joi);

// Validate the event object using the Joi schema
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

module.exports = {
     validateEvent // Export the validateEvent function
};