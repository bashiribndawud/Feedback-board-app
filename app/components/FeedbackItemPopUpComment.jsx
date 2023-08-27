// "use client"
import React, { useState, useEffect } from "react";
import Button from "./Button";
import Avatar from "./Avatar";
import FeedbackItemPopUpCommentForm from "./FeedbackItemPopUpCommentForm";
import axios from "axios";
import Attachement from "./Attachement";
import TimeAgo from "timeago-react";
import { useSession } from "next-auth/react";
import AttachFileButton from "./AttachFileButton";

const FeedbackItemPopUpComment = ({ feedbackId }) => {
  const { data: session } = useSession();
  const [comments, setcomments] = useState([]);
  const [editingComment, seteditingComment] = useState(false);
  const [commentId, setcommentId] = useState("");
  const [newCommentText, setnewCommentText] = useState("");
  const [newCommentUploads, setnewCommentUploads] = useState([]);
  useEffect(() => {
    getAllComments();
  }, []);

  function getAllComments() {
    axios.get("/api/comment?feedbackId=" + feedbackId).then((res) => {
      setcomments(res.data);
    });
  }

  function handleEditButtonClick(comment) {
    setcommentId(comment._id.toString());
    setnewCommentText(comment.text);
    seteditingComment(true);
    setnewCommentUploads(comment?.uploads);
  }

  function handleCancelEdit() {
    seteditingComment(false);
    setnewCommentText("");
  }
  function handleRemoveCommentFile(e, fileToRemoveLink) {
    e.preventDefault();
    setnewCommentUploads((prevLinks) =>
      prevLinks.filter((link) => link !== fileToRemoveLink)
    );
  }

  function  handleNewFileUploads(files){
    setnewCommentUploads(prevLinks => [...prevLinks, ...files])
  }

  async function handleSaveChangesClick(){
    const newData = {text: newCommentText, uploads: newCommentUploads}
    await axios.put("/api/comment", { id: commentId, ...newData });
    seteditingComment(false);
    setnewCommentText('');
    setnewCommentUploads([])
    setcomments(exitingComments => {
      return exitingComments.map(comment => {
        if(comment._id.toString() === commentId.toString()){
           return {...comment, ...newData}
        }else {
          return comment
        }
      })
    })
    // getAllComments();
  }
  return (
    <div className="p-8">
      {comments?.length > 0 &&
        comments?.map((comment, index) => {
          const editingThis = commentId === comment._id;
          
          return (
            <div className="mb-8 ">
              <div className="flex gap-4">
                <Avatar />
                <div>
                  {!!editingComment && editingThis ? (
                    <textarea
                      className="border p-2 block w-full rounded-lg"
                      value={newCommentText}
                      onChange={(e) => setnewCommentText(e.target.value)}
                    />
                  ) : (
                    <p className="text-gray-600">{comment.text}</p>
                  )}

                  <div className="text-sm text-gray-400 mt-2">
                    {comment?.user?.name || "Anonymous"} &middot;{" "}
                    <TimeAgo datetime={comment.createdAt} locale="en_US" />
                    {!editingComment &&
                      session?.user?.email === comment?.userEmail && (
                        <>
                          &middot;&middot;&nbsp;
                          <span
                            className="hover:underline cursor-pointer "
                            onClick={() => handleEditButtonClick(comment)}
                          >
                            Edit
                          </span>
                        </>
                      )}
                    {!!editingComment && editingThis && (
                      <>
                        {"  "}
                        <span
                          className="p-1 bg-red-400 rounded-lg px-2 hover:cursor-pointer text-white shadow-lg"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </span>{" "}
                        <span
                          onClick={handleSaveChangesClick}
                          className="px-2 py-1 shadow-lg hover:cursor-pointer bg-blue-500 text-white rounded-lg"
                        >
                          Save Changes
                        </span>
                      </>
                    )}
                  </div>

                  {(editingComment ? newCommentUploads : comment?.uploads)
                    ?.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {(commentId === comment._id.toString() && editingComment
                        ? newCommentUploads
                        : comment?.uploads
                      )?.map((link) => (
                        <Attachement
                          link={link}
                          showRemoveButton={
                            editingComment &&
                            commentId === comment._id.toString()
                          }
                          handleFileRemove={handleRemoveCommentFile}
                        />
                      ))}
                    </div>
                  )}
                  {commentId === comment._id.toString() && editingComment && (
                    <div className="flex mt-4">
                      <AttachFileButton onNewFiles={handleNewFileUploads} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
          
        }
        )}
      {!editingComment && (
        <FeedbackItemPopUpCommentForm
          feedbackId={feedbackId}
          onPost={getAllComments}
        />
      )}
    </div>
  );
};

export default FeedbackItemPopUpComment;
