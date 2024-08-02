import React, { useEffect, useState } from 'react'


const Navbar = (props) => {
  
  return (
    <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow-lg'>
        <div className='flex gap-2'>
          <h2 className='text-xl font-medium text-black py-2'>Work<span className='font-semibold text-3xl'>2X</span></h2>
        </div>
        
        {props.children}
    </div>
  )
}

export default Navbar