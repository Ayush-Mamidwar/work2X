import React from "react";
import emptyImg from "../../assets/empty.gif";
import noDataImg from "../../assets/noData.gif";

const EmptyCard = ({isSearch}) => {
  return (
    <div>
      <div className="mt-4 shadow-xl p-8 flex justify-center items-center">
        <img src={!isSearch ? emptyImg : noDataImg} alt="" className="shadow-2xl w-[60%]" />
      </div>

      { !isSearch ? 
        <p className="text-center text-md font-medium p-4">
        Start creating your first note! Click the 'Add' button to write down your thoughts, ideas, and reminders. 
        <br/>Let's get started</p> : 
        <p className="text-center font-medium text-lg p-4 text-red-700">
            No Notes Found :(
        </p>
        }
    </div>
  );
};

export default EmptyCard;
