import { Inngest } from "inngest";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import sendEmail from "../configs/nodeMailer.js";

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

//inngest function for sending users an email when booking is done
const sendBookingConfirmationEmail = inngest.createFunction(
  { id: 'send-booking-confirmation-email', triggers: { event: 'app/show.booked' } },
  async ({ event, step }) => {
    const { bookingId } = event.data;

    const booking = await Booking.findById(bookingId).populate({
      path: 'show',
      populate: { path:'movie', model:'Movie' }
    }).populate('user');

      await sendEmail({
        to: booking.user.email,
        subject: `Payment Confirmation: '${booking.show.movie.title}' booked successfully!`,
        body: `<div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Hi ${booking.user.name},</h2>
        <p>Your booking for <strong style="color: #f84565;">"${booking.show.movie.title}"</strong> is confirmed.</p>
        <p>
          <strong>Date:</strong> ${new Date(booking.show.showDateTime).toLocaleDateString('en-IN', {timezone: 'Asia/Kolkata'})} <br/>
          <strong>Time:</strong> ${new Date(booking.show.showDateTime).toLocaleTimeString('en-IN', {timezone: 'Asia/Kolkata'})}
        </p>
        <p>Enjoy the show! 🍿</p>
        <p> Thanks for booking with us!<br/>- BookEase Team</p>
        </div>`
      })

  }
)

//inngest function to send reminder 
const sendShowReminders = inngest.createFunction(
  {id: 'send-show-reminders', triggers: { cron:'0 */8 * * *' } },
  //{ cron:'0 */8 * * *'},
  async ({step}) => {
    const now = new Date();
    const in8Hours = new Date(now.getTime() + 8 * 60 * 60 * 1000);
    const windowStart = new Date(in8Hours.getTime() - 10 * 60 * 1000);

    const reminderTasks = await step.run('prepare-reminder-tasks', async ()=>{
      const shows = await Show.find({
        showTime: { $gte: windowStart, $lte: in8Hours },
      }).populate('movie')

      const tasks = [];

      for (const show of shows) {
        if(!show.movie || !show.occupiedSeats) continue;
        const userIds = [...new set(Object.values(show.occupiedSeats))]
        if(userIds.length ===0) continue;

        const users = await User.find({_id: {$in: userIds}}).select('name email')
        for(const user of users) {
          tasks.push({
            userEmail: user.email,
            userName: user.name,
            movieTitle: show.movie.title,
            showTime: show.showTime
          })
        }
      }
      return tasks;
    })

    if(reminderTasks.length === 0) {
      return {sent:0, message: 'No reminders to send.'}
    }

    //Send reminder Emails
    const results = await step.run('send-all-reminders', async () => {
      return await Promise.allStettled(
        reminderTasks.map(task => sendEmail({
          to: task.userEmail,
          subject: `Reminder: Your movie '${task.movieTitle}' starts soon!`,
          body: `<div style = "font-family: Arial, sans-serif; padding: 20px;">
          <h2> Hello ${task.userName} </h2>
          <p> This is a quick reminder that your movie:</p>
          <h3 style="color: #F84565;">"${task.movieTitle}"</h3>
          <p>
          is scheduled to start for <strong>${new Date(task.showTime).toLocaleTimeString('en-IN', {timezone: 'Asia/Kolkata'})}</strong> at <strong>${new Date(task.showTime).toLocaleDateString('en-IN', {timezone: 'Asia/Kolkata'})}</strong>.
          </p>
          <p> It starts in approximately <strong> 8 hours </strong> - make sure you're ready! </p>
          <br/>
          <p> Enjoy the show! 🍿 </br> BookEase Team </p>

          </div>`
        }))
      )
    })

    const sent = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.length - sent;

    return {
      sent,
      failed,
      message: `Sent ${sent} reminder(s), ${failed} failed.`
    }
  }
)

// send email when a new show is added to the database
const sendNewShowNotification = inngest.createFunction(
  {id: 'send-new-show-notifications', triggers: { event: 'app/show.added'} },
  async ({event}) => {
    const {movieTitle, movieId} = event.data;

    const users = await User.find({})

    for (const user of users) {
      const userEmail = user.email;
      const userName = user.name;

      const subject = `New Movie Alert: '${movieTitle}' is now showing!`;
      const body = `<div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>Hi ${userName},</h2>
      <p>Great news! A new movie <strong style="color: #f84565;">"${movieTitle}"</strong> has just been added to our lineup.</p>
      <p>Don't miss out on the chance to book your tickets and enjoy this exciting new release!</p>
      <a href="https://bookease.com/movies/${movieId}" style="display: inline-block; padding: 10px 20px; background-color: #f84565; color: white; text-decoration: none; border-radius: 5px;">Book Now</a>
      <p>Thanks for being a valued member of our community!<br/>- BookEase Team</p>
      </div>`;

      
      await sendEmail({
        to: userEmail,
        subject,
        body,
      })

    }
    return {message: `Notifications sent for new movie: ${movieTitle}` }

  }
  
)


// Create an empty array where we'll export future Inngest functions
export const functions = [
  syncUserCreation, 
  syncUserDeletion, 
  syncUserUpdation,
  releaseSeats,
  sendBookingConfirmationEmail,
  sendShowReminders,
  sendNewShowNotification
];