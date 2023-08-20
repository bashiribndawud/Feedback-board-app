"use client";
import React, { useState } from "react";
import Button from "./Button";
import PopUp from "./PopUp";
import axios from "axios";
import { PeperClip } from "./icons/PaperClip";
import Loader from "./Loader";
import Trash from "./icons/Trash";
const FeedBackFormModal = ({ setShow }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploads, setUploads] = useState([]);
  const [isUploading, setIsUploading] = useState(false)
  const handleCreatePostButtonClick = (e) => {
    e.stopPropagation()
    e.preventDefault();
    axios
      .post(
        "/api/feedback",
        { title, description, uploads },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((response) => {
        setShow(false);
      });
  };

  async function handleAttachFileInputChange(evt) {
    evt.stopPropagation()
    const files = [...evt.target.files];
    setIsUploading(true)
    if (files?.length > 0) {
      const dataForm = new FormData();
      for (const file of files) {
        dataForm.append("file", file);
      }

      const res = await axios.post("/api/upload", dataForm);
      setUploads((existingUpload) => {
        return [...existingUpload, ...res.data];
      });
      setIsUploading(false)
    }
  }

  function handleFileRemove(e, link){
    e.stopPropagation()
    e.preventDefault();
    setUploads((prevUpload) => {
      return prevUpload.filter(val => val !== link);
    })
  }

  return (
    <PopUp setShow={setShow} title={" Make a suggestion"}>
      <form onClick={(e) => e.stopPropagation()}  className="p-4 md:p-8">
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
              {uploads?.map((link, index) => (
                <a
                  href={link}
                  target="_blank"
                  className="h-16 relative"
                  key={index}
                >
                  {/.(jpg|png|txt|JPG)$/.test(link) && (
                    <button
                      type="button"
                      onClick={(e) => handleFileRemove(e, link)}
                      className="absolute right-1 top-1 p-1 bg-red-500 rounded-full shadow-md"
                    >
                      <Trash className="w-5 h-5 text-white" />
                    </button>
                  )}

                  {/.(jpg|png)$/.test(link) ? (
                    <img src={link} className="h-16 w-auto rounded-md" alt="" />
                  ) : (
                    <div className="bg-gray-200 h-16 p-2 flex items-center rounded-md">
                      <PeperClip className="w-4 h-4 text-blue-600" />
                      {link.split("/")[3].substring(13)}
                    </div>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}
        <div className="flex gap-3 mt-2 justify-end">
          <label
            htmlFor="file"
            className="py-2 p-x4 text-gray-600 cursor-pointer flex gap-2 items-center"
          >
            {isUploading && <Loader />}
            <span className={isUploading ? "text-gray-300" : "text-gray-600"}>
              {isUploading ? "Uploading..." : "Attach File"}
            </span>
            <input
              className="hidden"
              type="file"
              name="files"
              id="file"
              onChange={handleAttachFileInputChange}
              multiple
            />
          </label>

          <Button
            primary
            onClick={handleCreatePostButtonClick}
            disabled={description === ""}
          >
            Create post
          </Button>
        </div>
      </form>
    </PopUp>
  );
};

export default FeedBackFormModal;
