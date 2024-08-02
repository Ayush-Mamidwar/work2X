import React, { useEffect, useState } from 'react';
import Navbar from '../../components/navbar/Navbar';
import { LuArrowRightToLine } from "react-icons/lu";
import Sidebar from '../../components/sidebar/Sidebar';
import Calendar from './Calendar';
import axiosInstance from '../../utils/axiosInstance';

const Scheduler = ({ sideBarOpen, setSideBarOpen }) => {
  const [topic, setTopic] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosInstance.get('/calendar');
        setEvents(response.data.results.map(event => ({
          start: new Date(event.start),
          end: new Date(event.end),
          title: event.topic,
        })));
      } catch (error) {
        console.error("Error fetching events", error);
      }
    };

    fetchEvents();
    setSideBarOpen(false);
  }, [setSideBarOpen]);

  const addEventHandler = async () => {
    const newEvent = {
      start: start,
      end: end,
      topic: topic,
    };

    try {
      await axiosInstance.post('/calendar', newEvent);
      setEvents([...events, {
        start: new Date(start),
        end: new Date(end),
        title: topic,
      }]);
      setStart("");
      setEnd("");
      setTopic("");
    } catch (error) {
      console.error("Error adding event", error);
    }
  };

  return (
    <div>
      <Navbar />
      <Sidebar sideBarOpen={sideBarOpen} setSideBarOpen={setSideBarOpen} />    
      <button className="bg-blue-500 p-2 text-white text-xl" onClick={() => setSideBarOpen(true)}>
        <LuArrowRightToLine />
      </button>
      <div>
        <div className='flex justify-center mb-20'>
          <div className='flex flex-col mx-4'>
            <label htmlFor="topic" className='font-semibold'>Topic: </label>
            <input 
              type="text" 
              id='topic' 
              placeholder='Enter Title'
              className='border border-black p-2 rounded-md outline-none'
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className='flex flex-col mx-4'>
            <label htmlFor="start" className='font-semibold'>Start: </label>
            <input 
              type="datetime-local" 
              id='start'
              className='border border-black p-2 rounded-md outline-none'
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </div>

          <div className='flex flex-col mx-4'>
            <label htmlFor="end" className='font-semibold'>End: </label>
            <input 
              type="datetime-local" 
              id='end'
              className='border border-black p-2 rounded-md outline-none'
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </div>

          <button 
            className='bg-blue-500 px-8 rounded-xl text-white'
            onClick={addEventHandler}
          >Add</button>
        </div>
      </div>
      <div className='h-[95vh] p-8 border m-4 border-black'>
        <Calendar events={events} defaultView={"day"} views={['month','week','day']} />
      </div>
    </div>
  );
}

export default Scheduler;
