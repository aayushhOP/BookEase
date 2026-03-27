import Booking from "../models/Booking.js";
import Show from "../models/Show.js"


//function to check availability of seats for a movie
const checkSeatsAvailability = async (showID, selectedSeats) => {
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

export const createBooking = async (req,res) => {
  try {
    const {userId} = req.auth();
    const {showId,selectedSeats} = req.body;
    const {origin} = req.headers;

    //check if selection seat is available for the selected show
    const isAvailable = await checkSeatsAvailability(showId,selectedSeats)

    if(!isAvailable) {
      return res.json({success: false, message: "Selected Seat(s) not available."})
    }

    //get show details
    const showData = await Show.findById(showId).populate('movie');

    //create a new booking
    const booking = await Booking.create({
      user: userId,
      show: showId,
      amount: showData.showPrice * selectedSeats.length,
      bookedSeats: selectedSeats
    })

    selectedSeats.map((seat)=>{
      showData.occupiedSeats[seat] = userId
    })

    showData.markModified('occupiedSeats')

    await showData.save();

    //Stripe gateway initialize
    res.json({success:true, messsage: 'booked successfully'})

  } catch (error) {
    console.log(error.message)
    res.json({success:false, messsage: error.message})
  }
}

export const getOccupiedSeats = async (req,res) => {
  try {
    const {showId} = req.params;
    const showData = await Show.findById(showId)

    const occupiedSeats = Object.keys(showData.occupiedSeats)
    res.json({success:true, occupiedSeats})

  } catch (error) {
    console.log(error.message)
    res.json({success:false, messsage: error.message})
  }

}