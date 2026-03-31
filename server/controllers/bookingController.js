import Booking from "../models/Booking.js";
import Show from "../models/Show.js"
import Movie from "../models/Movie.js"
import stripe from 'stripe'


//function to check availability of seats for a movie
const checkSeatsAvailability = async (showId, selectedSeats) => {
  try {
    const showData = await Show.findById(showId)
    if(!showData) return false;

    const occupiedSeats = showData.occupiedSeats;

    const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat])

    return !isAnySeatTaken;

  } catch (error) {
    console.log(error.message)
    return false
  }
}

export const createBooking = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { showId, selectedSeats } = req.body;
    const { origin } = req.headers;

    if (!userId) {
      return res.json({ success: false, message: 'Please login to continue.' })
    }

    if (!showId || !Array.isArray(selectedSeats) || selectedSeats.length === 0) {
      return res.json({ success: false, message: 'Please select a show time and seat(s).' })
    }

    //check if selection seat is available for the selected show
    const isAvailable = await checkSeatsAvailability(showId, selectedSeats)

    if (!isAvailable) {
      return res.json({ success: false, message: 'Selected Seat(s) not available.' })
    }

    //get show details
    const showData = await Show.findById(showId).populate('movie');

    if (!showData) {
      return res.json({ success: false, message: 'Selected show was not found.' })
    }

    //create a new booking
    const booking = await Booking.create({
      user: userId,
      show: showId,
      amount: showData.showPrice * selectedSeats.length,
      bookedSeats: selectedSeats,
    })

    selectedSeats.forEach((seat) => {
      showData.occupiedSeats[seat] = userId
    })

    showData.markModified('occupiedSeats')
    await showData.save();

    //Stripe gateway initialize
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)

    //creating line items for stripe
    const line_items = [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: showData.movie.title,
        },
        unit_amount: Math.floor(booking.amount) * 100,
      },
      quantity: 1,
    }]

    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/my-bookings?payment=success`,
      cancel_url: `${origin}/my-bookings?payment=cancelled`,
      line_items,
      mode: 'payment',
      metadata: {
        bookingId: booking._id.toString(),
      },
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    })

    booking.paymentLink = session.url ?? ''
    await booking.save()

    return res.json({ success: true, url: session.url })

  } catch (error) {
    console.log(error.message)
    return res.json({ success: false, message: error.message })
  }
}

export const getOccupiedSeats = async (req, res) => {
  try {
    const { showId } = req.params;
    const showData = await Show.findById(showId)

    if (!showData) {
      return res.json({ success: false, message: 'Show not found.' })
    }

    const occupiedSeats = Object.keys(showData.occupiedSeats)
    return res.json({ success: true, occupiedSeats })

  } catch (error) {
    console.log(error.message)
    return res.json({ success: false, message: error.message })
  }

}