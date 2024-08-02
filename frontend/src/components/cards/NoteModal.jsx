import React from 'react';

const NoteModal = ({ title, date, content, tags, setNoteModal }) => {
  return (
    <div>
      <button
        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-700"
        onClick={() => setNoteModal(false)}
      >
        ✕
      </button>
      <h1 className="text-center font-bold text-2xl mb-4">{title}</h1>
      <i className="block text-center font-semibold text-sm mb-4 text-gray-500">{date}</i>
      <p className="mb-4">{content}</p>
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Tags:</h3>
        <div className="flex flex-wrap mt-2">
          {tags.map((item, index) => (
            <span
              key={index}
              className="bg-blue-200 text-blue-800 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2"
            >
              #{item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoteModal;
