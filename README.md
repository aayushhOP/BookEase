# BookEase 🎬

A modern, full-stack movie booking application built with React, Express.js, and MongoDB. BookEase provides users with a seamless experience to browse movies, book seats, manage bookings, and complete payments with integrated Stripe checkout.

## Features

### User Features
- **Movie Browsing**: Browse and search for movies with detailed information
- **Seat Selection**: Interactive seat layout with real-time availability
- **Booking Management**: View and manage all your bookings
- **Favorites**: Add movies to your favorites list
- **Payment Integration**: Secure payment processing with Stripe
- **Email Notifications**: Automated booking confirmations via email
- **User Authentication**: Secure login with Clerk

### Admin Features
- **Dashboard**: Overview of bookings and show statistics
- **Show Management**: Add, edit, and manage movie shows
- **Booking Management**: View all user bookings
- **Analytics**: Track bookings and revenue

## Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Framer Motion** - Animation library
- **Clerk** - Authentication & user management
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library

### Backend
- **Node.js & Express.js** - Web framework
- **MongoDB & Mongoose** - Database & ODM
- **Clerk** - Backend authentication
- **Stripe** - Payment processing
- **Nodemailer** - Email sending
- **Cloudinary** - Image hosting
- **Inngest** - Job scheduling
- **Svix** - Webhook management
- **CORS** - Cross-origin resource sharing

## Project Structure

```
BookEase/
├── Client/                          # React frontend
│   ├── src/
│   │   ├── components/             # Reusable components
│   │   │   ├── navbar/
│   │   │   ├── footer/
│   │   │   ├── admin/
│   │   │   └── ...
│   │   ├── pages/                  # Route pages
│   │   │   ├── Home.jsx
│   │   │   ├── Movies.jsx
│   │   │   ├── MovieDetails.jsx
│   │   │   ├── SeatLayout.jsx
│   │   │   ├── MyBookings.jsx
│   │   │   ├── Favourite.jsx
│   │   │   └── admin/
│   │   ├── context/                # React Context
│   │   ├── lib/                    # Utility functions
│   │   ├── assets/                 # Images and styles
│   │   ├── main.jsx
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
└── server/                          # Express backend
    ├── controllers/                # Route handlers
    │   ├── userController.js
    │   ├── showController.js
    │   ├── bookingController.js
    │   ├── adminController.js
    │   └── stripeWebhooks.js
    ├── routes/                     # API routes
    │   ├── userRoutes.js
    │   ├── showRouter.js
    │   ├── bookingRoutes.js
    │   └── adminRoutes.js
    ├── models/                     # MongoDB schemas
    │   ├── User.js
    │   ├── Show.js
    │   ├── Booking.js
    │   └── Movie.js
    ├── middleware/                 # Express middleware
    │   └── auth.js
    ├── configs/                    # Configuration files
    │   ├── db.js
    │   └── nodeMailer.js
    ├── inngest/                    # Job scheduling
    │   └── index.js
    ├── server.js
    ├── package.json
    └── vercel.json
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB instance
- Stripe account
- Clerk account
- Cloudinary account
- Email service (for Nodemailer)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/BookEase.git
cd BookEase
```

2. **Setup Frontend**
```bash
cd Client
npm install
```

3. **Setup Backend**
```bash
cd ../server
npm install
```

### Environment Variables

#### Client (.env.local)
Create a `.env.local` file in the `Client/` directory:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:3000/api
```

#### Server (.env)
Create a `.env` file in the `server/` directory:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
CLERK_SECRET_KEY=your_clerk_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_email_address
EMAIL_PASSWORD=your_email_app_password
INNGEST_EVENT_KEY=your_inngest_key
SVIX_WEBHOOK_SECRET=your_svix_webhook_secret
```

### Running the Application

#### Development Mode

**Terminal 1 - Start Backend:**
```bash
cd server
npm run server
```

**Terminal 2 - Start Frontend:**
```bash
cd Client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

#### Production Build

**Build Frontend:**
```bash
cd Client
npm run build
```

**Start Backend:**
```bash
cd server
npm start
```

## API Endpoints

### Shows
- `GET /api/shows` - Get all shows
- `GET /api/shows/:id` - Get show details
- `POST /api/shows` - Create new show (Admin)
- `PUT /api/shows/:id` - Update show (Admin)
- `DELETE /api/shows/:id` - Delete show (Admin)

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:id` - Get booking details
- `DELETE /api/bookings/:id` - Cancel booking

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/favorites` - Get favorite movies

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/bookings` - All bookings
- `POST /api/admin/shows` - Manage shows

## Database Schema

### User
```javascript
{
  clerkId: String,
  email: String,
  name: String,
  favorites: [ObjectId],
  createdAt: Date
}
```

### Movie
```javascript
{
  title: String,
  description: String,
  genre: [String],
  duration: Number,
  releaseDate: Date,
  language: String,
  image: String,
  trailer: String
}
```

### Show
```javascript
{
  movieId: ObjectId,
  showTime: Date,
  price: Number,
  totalSeats: Number,
  bookedSeats: [String],
  screen: String,
  createdAt: Date
}
```

### Booking
```javascript
{
  userId: ObjectId,
  showId: ObjectId,
  movieId: ObjectId,
  seats: [String],
  totalPrice: Number,
  paymentStatus: String,
  bookingStatus: String,
  createdAt: Date
}
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Support

For support, email support@bookease.com or open an issue on GitHub.

## Deployment

### Frontend (Vercel)
```bash
cd Client
npm run build
# Connect to Vercel and deploy
```

### Backend (Vercel/Render/Railway)
Backend deployment configurations are included in `server/vercel.json`.

## Future Enhancements

- [ ] Real-time seat updates with WebSockets
- [ ] Advanced search and filtering
- [ ] Movie ratings and reviews
- [ ] Multiple theater locations
- [ ] Mobile app (React Native)
- [ ] Loyalty program
- [ ] Gift cards
- [ ] Group bookings

## Author

BookEase Development Team

---

Made with ❤️ by the BookEase team
