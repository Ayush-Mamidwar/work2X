import React, { useEffect, useState } from 'react';
import Navbar from '../../components/navbar/Navbar';
import Sidebar from '../../components/sidebar/Sidebar';
import { LuArrowRightToLine } from "react-icons/lu";
import CheckItem from '../../components/checkItem/CheckItem';
import axiosInstance from '../../utils/axiosInstance';
import EmptyCard from '../../components/emptycard/EmptyCard';
import { Pie, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the components
ChartJS.register(ArcElement, Tooltip, Legend);

const Checklist = ({ sideBarOpen, setSideBarOpen }) => {
    const [checkListItems, setCheckListItems] = useState([]);
    const [name, setName] = useState('');
    const [topic, setTopic] = useState('');
    const [completed, setCompleted] = useState(false);

    const getAllItems = async () => {
        const response = await axiosInstance.get('http://localhost:8000/allCheckLists');
        setCheckListItems(response.data.allItems);
    };

    const addItem = async () => {
        const response = await axiosInstance.post('http://localhost:8000/add-checklistItem', { name, topic, completed });
        if (!response.data.error) {
            getAllItems();
            setName("");
            setTopic("");
        }
    };

    const editItem = async (id, completed) => {
        const response = await axiosInstance.put('http://localhost:8000/update-checklist-item', {
            id,
            completed
        });
        if (!response.data.error) {
            getAllItems();
        }
    };

    const deleteItem = async (id) => {
        const response = await axiosInstance.delete('http://localhost:8000/delete-checklist-item', {
            data: { id }
        });
        if (!response.data.error) {
            getAllItems();
        }
    };

    useEffect(() => {
        setSideBarOpen(false);
        getAllItems();
    }, []);

    const groupedItems = checkListItems.reduce((groups, item) => {
        const topic = item.topic || 'Others';
        if (!groups[topic]) {
            groups[topic] = [];
        }
        groups[topic].push(item);
        return groups;
    }, {});

    const renderPieChart = (items) => {
        const completedCount = items.filter(item => item.completed).length;
        const totalCount = items.length;

        const data = {
            labels: ['Completed', 'Incomplete'],
            datasets: [
                {
                    data: [completedCount, totalCount - completedCount],
                    backgroundColor: ['#4CAF50', '#FF6384'],
                    hoverBackgroundColor: ['#66BB6A', '#FF6384']
                }
            ]
        };

        return <Pie data={data} />;
    };

    const totalTasks = Object.values(groupedItems).flat().length;
    const totalCompletedTasks = Object.values(groupedItems).flat().filter(item => item.completed).length;

    const renderDoughnutChart = () => {
        const data = {
            labels: ['Completed', 'Incomplete'],
            datasets: [
                {
                    data: [totalCompletedTasks, totalTasks - totalCompletedTasks],
                    backgroundColor: ['#4CAF50', '#FF6384'],
                    hoverBackgroundColor: ['#66BB6A', '#FF6384']
                }
            ]
        };

        return <Doughnut data={data} />;
    };

    return (
        <div>
            <div className='sticky top-0 bg-white border-b-2'>
                <Navbar />
                <Sidebar sideBarOpen={sideBarOpen} setSideBarOpen={setSideBarOpen} />
                <button className="bg-blue-500 p-2 text-white text-xl" onClick={() => setSideBarOpen(true)}>
                    <LuArrowRightToLine />
                </button>
            

            <div className='flex justify-center pb-4'>
                <input
                    type="text"
                    className='bg-white h-8 border border-[3px] p-4 outline-none text-xl'
                    placeholder='Enter Task Name'
                    value={name}
                    onChange={(e) => { setName(e.target.value) }}
                />
                <input
                    type="text"
                    className='bg-white h-8 border border-[3px] p-4 outline-none text-xl mx-2'
                    placeholder='Enter Task Topic'
                    value={topic}
                    onChange={(e) => { setTopic(e.target.value) }}
                />
                <button className='mx-4 px-4 bg-green-800 p-2 rounded-xl text-white' 
                onClick={addItem}>
                    Add Task
                </button>
            </div>
            </div>

            {Object.keys(groupedItems).length > 0 ?
            <div className='mt-8 p-8'>
                {Object.keys(groupedItems).map((topic) => (
                    <div key={topic} className='mb-8'>
                        <div className='flex justify-between items-center'>
                            <h2 className='text-2xl font-bold mb-4'>{topic}</h2>
                            <div className='w-32 h-32'>
                                {renderPieChart(groupedItems[topic])}
                            </div>
                        </div>
                        
                        <div className='grid grid-cols-3 gap-4'>
                            {groupedItems[topic].map((item) => (
                                <CheckItem
                                    key={item._id}
                                    item={item}
                                    editItem={editItem}
                                    deleteItem={deleteItem}
                                />
                            ))}
                        </div>
                        <div className="flex justify-between mt-4">
                            <div>Total Tasks: {groupedItems[topic].length}</div>
                            <div>Completed: {groupedItems[topic].filter(item => item.completed).length}</div>
                        </div>
                        <hr className='mt-4' />

                    </div>
                ))}
            </div>
                : <div className='flex justify-center w-full'>
                    <EmptyCard />
                </div>}
            
            <div className="mt-8 p-8">
                <h2 className='text-2xl font-bold mb-4'>Overall Summary</h2>
                <div className='w-32 h-32 bg-red-300 w-full flex justify-center'>
                    {renderDoughnutChart()}
                </div>
                <div className="flex justify-between mt-4">
                    <div>Total Tasks: {totalTasks}</div>
                    <div>Completed: {totalCompletedTasks}</div>
                </div>
            </div>
        </div>
    );
};

export default Checklist;
