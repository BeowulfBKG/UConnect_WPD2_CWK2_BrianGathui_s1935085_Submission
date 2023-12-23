const mongoose = require('mongoose');
const Joi = require('joi');

// Counter schema to keep track of the last ID used for each model
const managerCounterSchema = new mongoose.Schema({
     _id: { type: String, required: true },
     seq: { type: Number, default: 0 }
});
const ManagerCounter = mongoose.model('ManagerCounter', managerCounterSchema);

// Function to get the next ID for a given model
const getNextSequenceValue = async (modelName) => {
     const counter = await ManagerCounter.findOneAndUpdate(
          { _id: modelName },
          { $inc: { seq: 1 } },
          { new: true, upsert: true }
     );
     return counter.seq - 1;
};

// Mongoose schema for Alumni Managers
const alumniManagerSchema = new mongoose.Schema({
     managerId: {
          type: Number,
          unique: true
     },
     firstName: {
          type: String,
          minlength: 2,
          maxlength: 50,
          required: true
     },
     lastName: {
          type: String,
          minlength: 2,
          maxlength: 50,
          required: true
     },
     emailAddress: {
          type: String,
          required: true,
          unique: true,
          lowercase: true,
          trim: true
     },
     password: {
          type: String,
          required: true
     },
     accountType: {
          type: String,
          enum: ['Alumni Manager'],
          required: true
     },
     graduationYear: {
          type: Number,
          validate: {
               validator: function (value) {
                    const currentYear = new Date().getFullYear();
                    return value >= 2000 && value <= currentYear;
               },
               message: 'Graduation year must be between 2000 and the current year.'
          }
     }
}, { timestamps: true });

// Pre-save hook to auto-increment managerId
alumniManagerSchema.pre('save', async function (next) {
     if (this.isNew) {
          try {
               const incrementedId = await getNextSequenceValue('alumniManager');
               this.managerId = incrementedId;
               return next();
          } catch (error) {
               return next(error); // Return the error to stop execution on error
          }
     }
     next();
});


// Joi validation schema for Alumni Managers
const validateAlumniManager = (alumniManager) => {
     const schema = Joi.object({
          firstName: Joi.string().min(2).max(50).required(),
          lastName: Joi.string().min(2).max(50).required(),
          emailAddress: Joi.string().email().required(),
          password: Joi.string().required(),
          accountType: Joi.string().valid('Alumni Manager').required(),
          graduationYear: Joi.number().integer().min(2000).max(new Date().getFullYear())
     });
     return schema.validate(alumniManager);
};

// Create the model from the schema
const AlumniManager = mongoose.model('AlumniManager', alumniManagerSchema);

module.exports = AlumniManager;
module.exports.validateAlumniManager = validateAlumniManager;
