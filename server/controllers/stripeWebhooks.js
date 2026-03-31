import Stripe from "stripe";
import Booking from "../models/Booking.js";
import { inngest } from "../inngest/index.js";

export const stripeWebhooks = async (request, response) => {
  const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (error) {
    return response.status(400).send(`Webhook Error: ${error.message}`)
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const bookingId = session.metadata?.bookingId;

        if (bookingId && session.payment_status === 'paid') {
          await Booking.findByIdAndUpdate(bookingId, {
            isPaid: true,
            paymentLink: ''
          })

          //send confirmation email to user
          await inngest.send({
            name: 'app/show.booked',
            data: {bookingId}
          })
        }
        break;
      }

      default:
        console.log('Unhandled event type:', event.type)
    }

    return response.json({ received: true })
  } catch (error) {
    console.log('Webhook Processing Error', error)
    return response.status(500).send('Internal server error')
  }
}