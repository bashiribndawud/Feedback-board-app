import React from 'react'

const FeedBackItem = ({ onOpen, title, description, voteCount }) => {
  return (
    <a
      href="#"
      onClick={(e) => {e.preventDefault();onOpen()}}
      className="flex flex-col sm:flex-row gap-8 justify-start items-start md:items-center my-8 border-b"
    >
      <div>
        <h2 className="font-bold">{title}</h2>
        <p className="text-gray-600 text-sm ">
          {description}
        </p>
      </div>
      <div>
        <button className="mb-2 sm:mb-0 shadow-sm shadow-gray-200 border rounded-md py-1 text-gray-600 px-4 flex justify-center items-center gap-1">
          <span className="triangle-vote-up relative"></span>
          {voteCount}
        </button>
      </div>
    </a>
  );
};

export default FeedBackItem