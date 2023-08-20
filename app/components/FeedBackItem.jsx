import React, { useState } from "react";
import PopUp from "./PopUp";
import Button from "./Button";
import { signIn, useSession } from "next-auth/react";

const FeedBackItem = ({ onOpen, title, description, voteCount, _id }) => {
  const { data: session } = useSession();
  const isLoggedIn = false;
  const [showLoginPopUp, setShowLoginPopUp] = useState(false);
  function handleVoteButtonClicked(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!session) {
      setShowLoginPopUp(true);
    }
    localStorage.setItem('going_to_vote', _id)
  }

  async function handleUserLoginGoogle(ev) {
    ev.stopPropagation();
    ev.preventDefault();
    await signIn("google");
  }
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onOpen();
      }}
      className="flex flex-col sm:flex-row gap-8 justify-between items-start md:items-center my-8 border-b"
    >
      <div>
        <h2 className="font-bold">{title}</h2>
        <p className="text-gray-600 text-sm ">{description}</p>
      </div>
      {showLoginPopUp && (
        <PopUp
          narrow
          title={"Confirm Your Vote"}
          setShow={setShowLoginPopUp}
          className="z-10"
        >
          <Button onClick={(e) => handleUserLoginGoogle(e)} danger>
            Login With Google
          </Button>
        </PopUp>
      )}
      <div>
        <button
          onClick={(e) => handleVoteButtonClicked(e)}
          className="mb-2 sm:mb-0 shadow-sm shadow-gray-200 border rounded-md py-1 text-gray-600 px-4 flex justify-center items-center gap-1"
        >
          <span className="triangle-vote-up relative"></span>
          {voteCount || 0}
        </button>
      </div>
    </a>
  );
};

export default FeedBackItem;
