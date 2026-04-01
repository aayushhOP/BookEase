import React from 'react'
import { assets } from '../assets/assets'
import { ArrowRight, CalendarIcon, ClockIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const HeroSection = () => {

  const navigate = useNavigate()
  return (
    <div className='flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-[url("/dhurandhar.jpeg")] bg-cover bg-center h-screen'>
      <img src={assets.JioStudios} alt='' className='max-h-11 lg:h-11 mt-20'/>

      <h1 className='text-5xl md:text-[65px] md:leading-18 font-semibold max-w-110'>Dhurandhar : <br /> The Revenge</h1>
      
      <div className='flex items-center gap-4 text-gray-300'>
        <span>Action, Adventure</span>
        <div className='flex items-center gap-1'>
          <CalendarIcon className='w-4.5 h-4.5'/> 2026
        </div>
        <div className='flex items-center gap-1'>
          <ClockIcon className='w-4.5 h-4.5'/> 3h 50m
        </div>
      </div>
      <p className='max-w-md text-gray-300'>
        Dhurandhar: The Revenge is a 2026 Indian Hindi-language spy action thriller film written and directed by Aditya Dhar. Produced by Jyoti Deshpande, Aditya Dhar, and Lokesh Dhar under Jio Studios and B62 Studios.
      </p>
      <button onClick={()=>navigate('/movies')} className='flex items-center gap-1 px-6 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'>
        Explore Movies
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  )
}

export default HeroSection
