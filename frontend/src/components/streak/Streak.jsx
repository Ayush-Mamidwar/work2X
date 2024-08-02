import React, { useState, useEffect } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import { LuArrowRightToLine } from "react-icons/lu";

const generateDates = (start, end) => {
  const dates = [];
  const currentDate = new Date(start);
  end = new Date(end);
  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};

const formatDate = (date) => {
  return date.toISOString().split("T")[0];
};

const Streak = ({sideBarOpen,setSideBarOpen}) => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const [startDate, setStartDate] = useState(startOfMonth);
  const [endDate, setEndDate] = useState(endOfMonth);
  const [workDays, setWorkDays] = useState({});

  const fetchConsistentDays = async () => {
    try {
      const response = await axiosInstance.get("/consistent-days");
      const consistentDays = response.data.reduce((acc, curr) => {
        acc[curr.date] = true;
        return acc;
      }, {});
      setWorkDays(consistentDays);
    } catch (error) {
      console.error("Error fetching consistent days:", error);
    }
  };

  useEffect(() => {
    fetchConsistentDays();
    setSideBarOpen(false)
  }, []);

  const toggleWorkDay = async (date) => {
    const formattedDate = formatDate(date);
    try {
      if (workDays[formattedDate]) {
        // Remove the consistent day
        await axiosInstance.delete(`/consistent-days/${formattedDate}`);
      } else {
        // Add the consistent day
        await axiosInstance.post("/consistent-days", { date: formattedDate });
      }
      // Update the workDays state
      setWorkDays((prev) => ({
        ...prev,
        [formattedDate]: !prev[formattedDate],
      }));
    } catch (error) {
      console.error("Error toggling consistent day:", error);
    }
  };

  const dates = generateDates(startDate, endDate);

  return (
    <div>
      <Navbar />
      <Sidebar sideBarOpen={sideBarOpen} setSideBarOpen={setSideBarOpen} />
            <button className="bg-blue-500 p-2 text-white text-xl" onClick={() => setSideBarOpen(true)}>
                <LuArrowRightToLine />
            </button>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center">
        <h1 className="text-3xl font-bold my-8">Consistency Checker</h1>
        <div className="flex justify-center my-4">
          <div className="flex flex-col items-center">
            <label htmlFor="startDate" className="mr-2">
              Start Date:
            </label>
            <input
              type="date"
              id="startDate"
              value={formatDate(startDate)}
              onChange={(e) => setStartDate(new Date(e.target.value))}
            />
          </div>
          <div className="flex flex-col items-center ml-4">
            <label htmlFor="endDate" className="mr-2">
              End Date:
            </label>
            <input
              type="date"
              id="endDate"
              value={formatDate(endDate)}
              onChange={(e) => setEndDate(new Date(e.target.value))}
            />
          </div>
        </div>
        <div className="grid grid-cols-7 gap-4">
          {dates.map((date) => (
            <div
              key={formatDate(date)}
              className="flex flex-col items-center p-4 bg-white shadow-md rounded-md"
            >
              <span className="text-lg">
                {date.getDate()}{" "}
                {date.toLocaleString("default", { month: "short" })}
              </span>
              {workDays[formatDate(date)] ? (
                <FaCheck
                  className="text-green-500 text-2xl cursor-pointer mt-2"
                  onClick={() => toggleWorkDay(date)}
                />
              ) : (
                <FaTimes
                  className="text-red-500 text-2xl cursor-pointer mt-2"
                  onClick={() => toggleWorkDay(date)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Streak;
