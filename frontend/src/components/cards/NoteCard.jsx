import React, { useState } from 'react'
import {MdOutlinePushPin} from 'react-icons/md'
import {MdCreate, MdDelete} from 'react-icons/md'
import NoteModal from './NoteModal'
import Modal from 'react-modal';


const NoteCard = ({title, date, content, tags, isPinned, onEdit, onDelete, onPinNote}) => {
  const [noteModal, setNoteModal] = useState(false)
  return (
    <div 
    onClick={()=>setNoteModal(true)}
    className='border border-slate-300 rounded bg-white p-4 hover:shadow-xl teansition-all ease-in-out'>
        <div className='flex items-center justify-between'>
            <div>
                <h6 className='text-sm font-semibold '>{title}</h6>
                <span className='text-xs text-slate-500'>{date}</span>
            </div>

            <MdOutlinePushPin className={`icon-btn ${isPinned ? 'text-primary':'text-slate-300'}`} onClick={onPinNote} />
        </div>

        <p className='text-xs text-slate-600 mt-2'>{content?.slice(0,60)}</p>

        <div className='flex items-center justify-between mt-2'> 
            <div className='text-xs text-slate-500'>{tags.map((item)=>`#${item} `)}</div>

            <div className='flex items-center gap-2'>
                <MdCreate className='icon-btn hover:text-green-600' onClick={onEdit}/>

                <MdDelete className='icon-btn hover:text-red-500' onClick={onDelete}/>
            </div>
        </div>

    </div>
  )
}

export default NoteCard