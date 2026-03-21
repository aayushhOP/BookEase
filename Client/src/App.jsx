import React from 'react'
import NavBar from './components/Navbar'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Home from './pages/Home'
import Movies from './pages/Movies'
import MovieDetails from './pages/MovieDetails'
import SeatLayout from './pages/SeatLayout'
import MyBookings from './pages/MyBookings'
import Favourite from './pages/Favourite'
import Toaster  from 'react-hot-toast'
import Footer from './components/Footer'

const pageVariants = {
  initial: { opacity: 0, y: 35, scale: 0.985 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -25, scale: 0.99 }
}

const pageTransition = {
  duration: 0.45,
  ease: [0.23, 1, 0.32, 1],
  when: 'beforeChildren'
}

const App = () => {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <>
      <Toaster />
      {!isAdminRoute && <NavBar />}

      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={pageTransition}
          style={{ minHeight: 'calc(100vh - 150px)' }}
        >
          <Routes location={location} key={location.pathname}>
            <Route path='/' element={<Home />} />
            <Route path='/movies' element={<Movies />} />
            <Route path='/movies/:id' element={<MovieDetails />} />
            <Route path='/movies/:id/:date' element={<SeatLayout />} />
            <Route path='/my-bookings' element={<MyBookings />} />
            <Route path='/favourite' element={<Favourite />} />
          </Routes>
        </motion.div>
      </AnimatePresence>

      {!isAdminRoute && <Footer />}
    </>
  )
}

export default App
