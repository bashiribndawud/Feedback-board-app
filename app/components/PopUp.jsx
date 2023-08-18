import React from "react";
import Button from "./Button";

const PopUp = ({ setShow, children, title }) => {
  return (
    <div
      onClick={() => setShow(false)}
      className="fixed inset-0 bg-white md:bg-black md:bg-opacity-80 flex md:items-center"
    >
      <button
        onClick={() => setShow(false)}
        className="hidden fixed top-4 right-4 text-2xl md:text-white md:block"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <div className="w-full">
        <div
          className="bg-white md:max-w-2xl mx-auto md:rounded-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative min-h-[50px] md:min-h-0">
            <button
              onClick={() => setShow(false)}
              className="absolute top-4 left-4 md:hidden text-gray-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                />
              </svg>
            </button>
            {!!title && (
              <h2 className="py-4 text-center border-b font-bold">{title}</h2>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default PopUp;
