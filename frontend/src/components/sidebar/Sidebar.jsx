import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar = ({sideBarOpen,setSideBarOpen}) => {
  return (
    <div>
        {sideBarOpen && 
            <div className="fixed inset-0 flex z-50">
            <div className="w-1/4 bg-gray-200 h-full p-4 flex flex-col">
                <div className=' text-2xl mt-2 mb-8'>Work<span className='font-semibold text-4xl'>2X</span></div>
                <Link to={'/dashboard'}><div 
                className='w-full border border-slate-400 text-center m-2 shadow-lg p-2
                hover:bg-slate-300'>
                  Notes</div></Link>
                <Link to={'/scheduler'}><div 
                className='w-full border border-slate-400 text-center m-2 shadow-lg p-2
                hover:bg-slate-300'>
                  Scheduler</div></Link>
                <Link to={'/checklist'}><div 
                className='w-full border border-slate-400 text-center m-2 shadow-lg p-2
                hover:bg-slate-300'>
                  Checklist</div></Link> 
                {/* <Link to={'/check-consistency'}><div 
                className='w-full border border-slate-400 text-center m-2 shadow-lg p-2
                hover:bg-slate-300'>
                  Mark Today's Day / Check Consistency</div></Link> */}
            </div>
            <div className="flex-1 bg-black bg-opacity-25" onClick={() => setSideBarOpen(false)}></div>
            </div>
        }   

    </div>
  )
}

export default Sidebar