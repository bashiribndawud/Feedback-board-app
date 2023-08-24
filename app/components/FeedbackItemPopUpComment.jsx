// "use client"
import React, { useState, useEffect } from "react";
import Button from "./Button";
import Avatar from "./Avatar";
import FeedbackItemPopUpCommentForm from "./FeedbackItemPopUpCommentForm";
import axios from "axios";
import Attachement from "./Attachement";
import TimeAgo from "timeago-react";


const FeedbackItemPopUpComment = ({ feedbackId }) => {
  const [comments, setcomments] = useState([]);
  useEffect(() => {
    getAllComments()
  }, []);

  function getAllComments(){
    axios.get("/api/comment?feedbackId=" + feedbackId).then((res) => {
      setcomments(res.data);
    });
    console.log(comments);
  }
  return (
    <div className="p-8">
      {comments?.length > 0 &&
        comments?.map((comment, index) => (
          <div className="mb-8">
            <div className="flex gap-4">
              <Avatar />
              <div>
                <p className="text-gray-600">{comment.text}</p>
                <div className="text-sm text-gray-400 mt-2">
                  {comment?.user?.name || 'Anonymous'} &middot;{" "}
                  <TimeAgo datetime={comment.createdAt} locale="en_US" />
                </div>
                {comment?.uploads?.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {comment.uploads.map((link) => (
                      <Attachement link={link} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      <FeedbackItemPopUpCommentForm
        feedbackId={feedbackId}
        onPost={getAllComments}
      />
    </div>
  );
}

export default FeedbackItemPopUpComment;
