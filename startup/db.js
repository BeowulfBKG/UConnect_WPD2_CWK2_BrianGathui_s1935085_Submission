if (process.env.NODE_ENV !== 'production') {
     require('dotenv').config();
}

// Module Import - mongoose
const mongoose = require('mongoose');

// Suppress the deprecation warning for strictQuery
mongoose.set('strictQuery', true); // Add this line here

// Module Exports - Database connection setup
module.exports = () => {
     // Database Connection Using Mongoose
     const db = mongoose.connection;

     // Connection through the appropriate environment/ link to MongoDB Atlas
     mongoose.connect(process.env.DATABASE_URL, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
     });

     // Error Printing when connection is not established
     db.on('error', error =>
          console.error(error, console.log('😵 Failed to MongoDB Database w/ Mongoose...' 
          + '\n' + '=========================================================================' + '\n'))
     );
+ '\n'
     // Success Printing when connection is established
     db.once('open', () =>
          console.log('🟢 Successfully Connected to the UConnect MongoDB Database w/ Mongoose...' 
          + '\n' + '=========================================================================' + '\n')
     );
};

