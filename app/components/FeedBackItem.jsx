import React, { useState } from "react";
import PopUp from "./PopUp";
import Button from "./Button";
import { signIn, useSession } from "next-auth/react";
import axios from "axios";
import Loader from "./Loader";

const FeedBackItem = ({
  onOpen,
  title,
  description,
  voteCount,
  _id,
  setFeedbacksId,
  votes,
  onVoteChange,
  parentLoadingVotes = true,
}) => {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user?.email;
  const [showLoginPopUp, setShowLoginPopUp] = useState(false);
  const [voteloading, setvoteloading] = useState(false);

  function handleVoteButtonClicked(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!session) {
      localStorage.setItem("going_to_vote", _id);
      setShowLoginPopUp(true);
    } else {
      setvoteloading(true);
      axios.post("/api/vote", { feedbackId: _id }).then(async (res) => {
        await onVoteChange();
        setvoteloading(false);
      });
    }
  }

  async function handleUserLoginGoogle(ev) {
    ev.stopPropagation();
    ev.preventDefault();
    await signIn("google");
  }

  const iVote = votes?.find((v) => v.user === session?.user?.email);
  const shortDesc = description.substring(0, 200);
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
        <p className="text-gray-600 text-sm ">
          {shortDesc}
          {shortDesc.length < description.length ? "..." : ""}
        </p>
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
        <Button
          primary={!!iVote}
          onClick={(e) => handleVoteButtonClicked(e)}
          className="shadow-lg border"
        >
          {!voteloading && (
            <>
              <span className="triangle-vote-up relative"></span>
              {votes?.length || "0"}
            </>
          )}
          {voteloading && (
            <>
              <Loader />
            </>
          )}
        </Button>
      </div>
    </a>
  );
};

export default FeedBackItem;
