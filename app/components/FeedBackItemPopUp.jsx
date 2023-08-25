import React, { useEffect, useState } from "react";
import PopUp from "./PopUp";
import Button from "./Button";
import FeedbackItemPopUpComment from "./FeedbackItemPopUpComment";
import axios from "axios";
import Loader from "./Loader";
import { useSession } from "next-auth/react";
import Tick from "./icons/Tick";
import Attachement from "./Attachement";
import Edit from "./icons/Edit";
import AttachFileButton from "./AttachFileButton";
import Trash from "./icons/Trash";

const FeedBackItemPopUp = ({
  setShow,
  title,
  description,
  _id,
  votes,
  onVoteChange,
  images,
  userEmail,
  onUpdate,
}) => {
  const { data: session } = useSession();
  const [voteLoading, setvoteLoading] = useState(false);
  const [isEditMode, setisEditMode] = useState(false);
  const [newTitle, setnewTitle] = useState(title);
  const [newDescription, setnewDescription] = useState(title);
  const [newUpload, setnewUpload] = useState(images);
  function handleVoteButtonClick() {
    setvoteLoading(true);
    axios.post("/api/vote", { feedbackId: _id }).then(async () => {
      await onVoteChange();
      setvoteLoading(false);
    });
  }
  const iVote = !!votes.find((v) => v.user === session?.user?.email);
  function handleEditButtonClick() {
    setisEditMode(true);
    setnewTitle(title);
    setnewDescription(description);
  }
  function handleRemoveFile(e, fileToRemove) {
    e.stopPropagation();
    e.preventDefault();
    setnewUpload((prevUploads) =>
      prevUploads.filter((link) => link !== fileToRemove)
    );
  }
  function handleCancelEdit() {
    setisEditMode(false);
    setnewTitle(title);
    setnewDescription(description);
    setnewUpload(images);
  }

  function handleNewUploads(newLinks) {
    setnewUpload((prevUploads) => [...prevUploads, ...newLinks]);
  }

  function handleSaveButtonClick(e) {
    e.preventDefault();
    axios
      .put("/api/feedback", {
        id: _id,
        title: newTitle,
        description: newDescription,
        images: newUpload,
      })
      .then(() => {
        setisEditMode(false)
        onUpdate({
          title: newTitle,
          description: newDescription,
          images: newUpload,
        });
      });
  }
  return (
    <PopUp setShow={setShow} title={""}>
      <div onClick={(e) => e.stopPropagation()}>
        <div className="p-8 pb-2">
          {isEditMode && (
            <input
              type="text"
              value={newTitle}
              className="block border border-blue-500 mb-2 rounded-lg w-full p-2"
              onChange={(e) => setnewTitle(e.target.value)}
            />
          )}
          {!isEditMode && <h2 className="text-lg font-bold mb-2">{title}</h2>}
          {isEditMode && (
            <textarea
              name=""
              id=""
              value={newDescription}
              className="block border border-blue-500 rounded-lg w-full p-2"
              onChange={(e) => setnewDescription(e.target.value)}
            ></textarea>
          )}
          {!isEditMode && <p>{description}</p>}

          {images?.length > 0 && (
            <div className="mt-4">
              <span className="text-gray-600 text-sm">Attachments:</span>

              <div className="flex gap-2 flex-wrap">
                {(isEditMode ? newUpload : images)?.map((link) => (
                  <Attachement
                    link={link}
                    key={link}
                    showRemoveButton={isEditMode}
                    handleFileRemove={handleRemoveFile}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end px-8 py-2 border-b">
          {isEditMode && (
            <>
              <AttachFileButton onNewFiles={handleNewUploads} />
              <Button onClick={handleCancelEdit}>
                Cancel <Trash className="w-5 h-5" />{" "}
              </Button>
              <Button
                primary
                disabled={newTitle === "" || newDescription === ""}
                onClick={handleSaveButtonClick}
              >
                Save Changes
              </Button>
            </>
          )}
          {!isEditMode && session?.user?.email === userEmail && (
            <Button onClick={handleEditButtonClick}>
              Edit
              <Edit />{" "}
            </Button>
          )}
          {!isEditMode && (
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
          )}
        </div>
        <div>
          <FeedbackItemPopUpComment feedbackId={_id} />
        </div>
      </div>
    </PopUp>
  );
};

export default FeedBackItemPopUp;
