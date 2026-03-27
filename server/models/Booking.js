import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: {type: true, required: true, ref: 'User'},
  show: {type: true, required: true, ref: 'Show'},
  amount: {type: Number, required: true},
  bookedSeats: {type: Array, required: true},
  isPaid: {type: Boolean, default: false},
  paymentLink: {type: Boolean, default: false},

}, {timestamps: true })

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking