import React from "react";

const Button = (props) => {
  const extraClass = props?.className || ''
  return (
    <button
      {...props}
      disabled={props.disabled}
      className={
        "text-black flex gap-2 items-center py-1 px-4 rounded-md text-opacity-90  "
        + extraClass +
        (props.primary ? " bg-blue-500 text-white " : " text-gray-600 ") +
        (props.disabled
          ? " text-opacity-50 bg-opacity-70 cursor-not-allowed "
          : " text-gray-600 ") 
      }
    >
      {props.children}
    </button>
  );
};

export default Button;
