"use client";
import React, { useState } from "react";
import Button from "./Button";
import PopUp from "./PopUp";
import axios from "axios";
import { PeperClip } from "./icons/PaperClip";
const FeedBackFormModal = ({ setShow }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploads, setUploads] = useState([]);
  const handleCreatePostButtonClick = (e) => {
    e.preventDefault();
    axios
      .post(
        "/api/feedback",
        { title, description },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((response) => {
        setShow(false);
      });
  };

  async function handleAttachFileInputChange(evt) {
    const files = [...evt.target.files];

    if (files?.length > 0) {
      const dataForm = new FormData();
      for (const file of files) {
        dataForm.append("file", file);
      }

      const res = await axios.post("/api/upload", dataForm);
      setUploads((existingUpload) => {
        return [...existingUpload, ...res.data];
      });
    }
  }

  return (
    <PopUp setShow={setShow} title={" Make a suggestion"}>
      <form className="p-4 md:p-8">
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
            <div className="flex gap-2">
              {uploads.map((link, index) => (
                <a href={link} target="_blank" className="h-16 relative" key={index}>
                  {link.endsWith(".png") && (
                    <div className="absolute right-1 top-1 p-1 bg-red-500 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="w-5 h-5 text-white"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
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
            className="py-2 p-x4 text-gray-600 cursor-pointer"
          >
            <span>Attach File</span>
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
