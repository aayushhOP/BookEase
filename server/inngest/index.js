import { Inngest } from "inngest";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

//inngest function to save user data to a databse
const syncUserCreation = inngest.createFunction(
  {id: 'create-user-from-clerk', triggers: { event: 'clerk/user.created' }},
  async ({ event }) => {
    const {id, first_name, last_name, email_addresses, image_url} = event.data
    if (!email_addresses || email_addresses.length === 0) {
      throw new Error('No email address provided for user creation');
    }
    const userData = {
      _id:id,
      email:email_addresses[0].email_address,
      name: first_name + ' ' + last_name,
      image: image_url
    }
    await User.create(userData)
  }
)


//inngest  function to delete user from database
const syncUserDeletion = inngest.createFunction(
  {id: 'delete-user-with-clerk', triggers: { event: 'clerk/user.deleted' }},
  async ({ event }) => {
    const {id} = event.data
    await User.findByIdAndDelete(id)
  }
  
)

//inngest funtion to update user in database
const syncUserUpdation = inngest.createFunction(
  {id: 'update-user-from-clerk', triggers: { event: 'clerk/user.updated' }},
  async ({ event }) => {
    const {id, first_name, last_name, email_addresses, image_url} = event.data
    if (!email_addresses || email_addresses.length === 0) {
      throw new Error('No email address provided for user update');
    }
    const userData = {
      _id:id,
      email:email_addresses[0].email_address,
      name: first_name + ' ' + last_name,
      image: image_url
    }
    await User.findByIdAndUpdate(id, userData)
  }
  
);

// inngest function for automatically releasing the seats if payment is failed or not initiated
const releaseSeats = inngest.createFunction(
  { id: 'release-seats-delete-booking', triggers: { event: 'app/checkpayment' } },
  async ({ event, step }) => {
    const tenMinutesLater = new Date(Date.now() + 10 * 60 * 1000);
    await step.sleepUntil('wait-for-10-minutes', tenMinutesLater)

    await step.run('check-payment-status', async () => {
      const bookingId = event.data.bookingId;
      const booking = await Booking.findById(bookingId)

      if (!booking || booking.isPaid) return;

      const show = await Show.findById(booking.show);
      if (!show) {
        await Booking.findByIdAndDelete(booking._id)
        return;
      }

      booking.bookedSeats.forEach((seat) => {
        delete show.occupiedSeats[seat]
      })

      show.markModified('occupiedSeats')
      await show.save()
      await Booking.findByIdAndDelete(booking._id)
    })
  }
)


// Create an empty array where we'll export future Inngest functions
export const functions = [
  syncUserCreation, 
  syncUserDeletion, 
  syncUserUpdation,
  releaseSeats
];