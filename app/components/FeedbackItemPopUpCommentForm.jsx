import React, { useState } from "react";
import Button from "./Button";
import Loader from "./Loader";
import AttachFileButton from "./AttachFileButton";
import Attachement from "./Attachement";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";

const FeedbackItemPopUpCommentForm = ({feedbackId, onPost}) => {
  const [commentText, setCommentText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploads, setUploads] = useState([]);
  const {data: session} = useSession();
  function addNewUploads(links) {
    setUploads((prevLinks) => [...prevLinks, ...links]);
  }
  function handleFileRemove(e, linkToRemove) {
    e.preventDefault()
    setUploads((prevLinks) =>
      prevLinks.filter((link) => link !== linkToRemove)
    );
  }
  async function handleCommentButtonClick(e){
    e.preventDefault()
    const commentData = { comment: commentText, uploads, feedbackId };
    if(session){
       const response = await axios.post("/api/comment", commentData);
       setCommentText("");
       setUploads([]);
       onPost();
    }else {
        localStorage.setItem(
          "comment_to_post",
          JSON.stringify(commentData)
        );
        await signIn('google');
        // setCommentText("");
        // setUploads([]);
        // onPost();
    }
    
    
  }
  return (
    <form action="">
      <textarea
        name=""
        id=""
        className="border rounded-md w-full p-2 focus:outline-blue-400"
        placeholder="Let us know what you think"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
      ></textarea>
      {uploads.length > 0 && (
        <div>
          <label htmlFor="title" className="mt-4 mb-1 block text-slate-700">
            Files
          </label>
          <div className="flex gap-3 flex-wrap">
            {uploads?.map((link) => (
              <Attachement
                link={link}
                key={link}
                showRemoveButton={true}
                handleFileRemove={(e, link) => handleFileRemove(e, link)}
              />
            ))}
          </div>
        </div>
      )}
      <div className="flex justify-end gap-2 mt-2">
        <AttachFileButton onNewFiles={addNewUploads} />
        <Button primary disabled={commentText === ""} onClick={handleCommentButtonClick}>
          {session? 'Create Comment' : 'Login and Comment'}
        </Button>
      </div>
    </form>
  );
};

export default FeedbackItemPopUpCommentForm;
