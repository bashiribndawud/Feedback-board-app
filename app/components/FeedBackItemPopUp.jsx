import React, {useState} from "react";
import PopUp from "./PopUp";
import Button from "./Button";
import FeedbackItemPopUpComment from "./FeedbackItemPopUpComment";
import axios from "axios";
import Loader from "./Loader";
import { useSession } from "next-auth/react";
import Tick from "./icons/Tick";

const FeedBackItemPopUp = ({ setShow, title, description, _id, votes, onVoteChange }) => {
  const {data : session} = useSession()
  const [voteLoading, setvoteLoading] = useState(false)
 function handleVoteButtonClick(){
   setvoteLoading(true)
   axios.post('/api/vote', {feedbackId: _id}).then(async() => {
     await onVoteChange()
     setvoteLoading(false)
    })
  }
  const iVote = !!votes.find(v => v.user === session?.user?.email);
  
  return (
    <PopUp setShow={setShow} title={""}>
      <div onClick={(e) => e.stopPropagation()}>
        <div className="p-8 pb-2">
          <h2 className="text-lg font-bold mb-2">{title}</h2>
          <p>{description}</p>
        </div>
        <div className="flex justify-end px-8 py-2 border-b">
          <Button primary onClick={handleVoteButtonClick}>
            {!voteLoading && (
              <>
                {iVote && (
                  <>
                    <Tick className="w-5 h-5" />
                    Upvoted
                  </>
                )}
                {!iVote && (
                  <>
                    <span className="triangle-vote-up relative"></span>
                    Vote {votes?.length || "0"}
                  </>
                )}
              </>
            )}
            {voteLoading && (
              <>
                <Loader />
              </>
            )}
          </Button>
        </div>
        <div>
          <FeedbackItemPopUpComment />
        </div>
      </div>
    </PopUp>
  );
};

export default FeedBackItemPopUp;
