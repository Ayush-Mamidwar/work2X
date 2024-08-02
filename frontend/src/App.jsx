import Home from "./pages/Home/Home";
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import { useState } from "react";
import Scheduler from "./pages/Scheduler/Scheduler";
import Checklist from "./pages/checklist/Checklist";
import "react-big-calendar/lib/css/react-big-calendar.css"
import Streak from "./components/streak/Streak";

export default function App() {
  const [sideBarOpen, setSideBarOpen] = useState()

  return (
    <>
      <Router>
        <Routes>
          <Route path="/dashboard" exact element={<Home sideBarOpen={sideBarOpen} setSideBarOpen={setSideBarOpen}/>}/>
          <Route path="/" exact element={<Login/>}/>
          <Route path="/signup" exact element={<SignUp/>}/>
          <Route path="/scheduler" exact element={<Scheduler sideBarOpen={sideBarOpen} setSideBarOpen={setSideBarOpen}/>}/>
          <Route path="/checklist" exact element={<Checklist sideBarOpen={sideBarOpen} setSideBarOpen={setSideBarOpen}/>}/>
          {/* <Route path="/check-consistency" exact element={<Streak sideBarOpen={sideBarOpen} setSideBarOpen={setSideBarOpen}/>}/> */}
        </Routes>
      </Router>
    </>
  )
}