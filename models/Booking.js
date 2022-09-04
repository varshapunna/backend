const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({

    listing_id: {
        type: String,
        required: [true, 'Enter listing id'],
      
    },

    booking_id: {
        type: String,
        required: [true, 'Enter booking id'],
     
    },


    booking_date: {
        type: Date,
        required: [true, 'Enter booking date'],
        min: '1987-09-28',
        max: '2050-12-30'
    },

    booking_start: {
        type: Date,
        required: [true, 'Enter start date'],
        min: '1987-09-28',
        max: '2050-12-30'
    },

    booking_end: {
        type: Date,
        required: [true, 'Enter end date'],
        min: '1987-09-28',
        max: '2050-12-30'
    },


    username: {
        type: String,
        required: [true, 'Enter username'],

    }

});

const Booking = mongoose.model("Booking", BookingSchema);
module.exports = Booking;