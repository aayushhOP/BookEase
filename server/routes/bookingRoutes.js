import express from 'express'
import { createBooking, getOccupiedSeats, verifyStripePayment } from '../controllers/bookingController.js'


const bookingRouter = express.Router()


bookingRouter.post('/create', createBooking)
bookingRouter.get('/seats/:showId', getOccupiedSeats);
bookingRouter.get('/verify', verifyStripePayment)

export default bookingRouter;