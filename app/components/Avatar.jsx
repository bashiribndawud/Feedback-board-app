import React from "react";

const Avatar = ({ url = null }) => {
  return (
    <div>
      <div className="rounded-full bg-green-300 w-10 h-10 overflow-hidden">
        {!!url && (
          <img src={url} alt="Avatar" />
        ) }
      </div>
    </div>
  );
};

export default Avatar;
