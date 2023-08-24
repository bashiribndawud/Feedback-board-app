"use client";
import React, { useState } from "react";
import Button from "./Button";
import PopUp from "./PopUp";
import axios from "axios";
import { PeperClip } from "./icons/PaperClip";
import Loader from "./Loader";
import Trash from "./icons/Trash";
import Attachement from "./Attachement";
import AttachFileButton from "./AttachFileButton";
import { signIn, useSession } from "next-auth/react";
const FeedBackFormModal = ({ setShow, onCreate }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploads, setUploads] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showLoginPopUp, setshowLoginPopUp] = useState(false)
  const { data: session } = useSession();

  const handleCreatePostButtonClick = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (session) {
      axios
        .post(
          "/api/feedback",
          { title, description, uploads },
          { headers: { "Content-Type": "application/json" } }
        )
        .then((response) => {
          setShow(false);
          onCreate();
        });
    } else {
      localStorage.setItem(
        "post_after_login",
        JSON.stringify({ title, description, uploads })
      );
      
      await signIn('google');
    }
  };

  function addNewUploads(links) {
    setUploads((prevLinks) => [...prevLinks, ...links]);
  }

  function handleFileRemove(e, link) {
    e.stopPropagation();
    e.preventDefault();
    setUploads((prevUpload) => {
      return prevUpload.filter((val) => val !== link);
    });
  }

  return (
    <PopUp setShow={setShow} title={" Make a suggestion"}>
      <form onClick={(e) => e.stopPropagation()} className="p-4 md:p-8">
        <label htmlFor="title" className="mt-4 mb-1 block text-slate-700">
          Title
        </label>
        <input
          className="w-full border p-2 rounded-md focus:outline-blue-400"
          type="text"
          id="title"
          placeholder="A short, descriptive title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label htmlFor="details" className="mt-4 mb-1 block text-slate-700">
          Details
        </label>
        <textarea
          className="w-full border p-2 rounded-md focus:outline-blue-400"
          id="details"
          placeholder="Please include any details"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
        <div className="flex gap-3 mt-2 justify-end">
          <AttachFileButton onNewFiles={addNewUploads} />

          <Button
            primary
            onClick={handleCreatePostButtonClick}
            disabled={description === ""}
          >
            {session? 'Create post' : 'Login and post'}
          </Button>
        </div>
      </form>
    </PopUp>
  );
};

export default FeedBackFormModal;
