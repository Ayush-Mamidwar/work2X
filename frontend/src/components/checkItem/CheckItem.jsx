import React from 'react';
import { MdDelete } from 'react-icons/md';

const CheckItem = ({ item, editItem, deleteItem }) => {
    const handleCheckboxChange = () => {
        editItem(item._id, !item.completed);
    };

    return (
        <div className={`flex gap-4 border justify-between p-4 text
        ${item.completed ? 'border-green-600 bg-green-50 line-through' : 'border-red-600 bg-red-50'}`}>
            <h3>{item.name}</h3>
            <div className='flex items-center gap-3 text-xl'>
                <input
                    type='checkbox'
                    checked={item.completed}
                    onChange={handleCheckboxChange}
                />
                <MdDelete 
                className='text-slate-500 cursor-pointer hover:text-red-400'
                onClick={() => deleteItem(item._id)}
                />
            </div>
        </div>
    );
};

export default CheckItem;
