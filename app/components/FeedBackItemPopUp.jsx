import React from 'react'
import PopUp from './PopUp'
import Button from './Button'
import FeedbackItemPopUpComment from './FeedbackItemPopUpComment';

const FeedBackItemPopUp = ({setShow, title, description, voteCount}) => {
  return (
    <PopUp setShow={setShow} title={""}>
      <div className="p-8 pb-2">
        <h2 className="text-lg font-bold mb-2">{title}</h2>
        <p>{description}</p>
      </div>
      <div className="flex justify-end px-8 py-2 border-b">
        <Button primary>
          <span className="triangle-vote-up relative"></span>
          Upvote {voteCount}
        </Button>
      </div>
      <div>
        <FeedbackItemPopUpComment />
      </div>
    </PopUp>
  );
}

export default FeedBackItemPopUp