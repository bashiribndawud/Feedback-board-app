"use client";
import React, { useState } from "react";
import Image from "next/image";
import FeedBackItem from "./components/FeedBackItem";
import FeedBackFormModal from "./components/FeedBackFormModal";
import Button from "./components/Button";
import FeedBackItemPopUp from "./components/FeedBackItemPopUp";

export default function Home() {
  const [showFeedBackPopUpForm, setShowFeedBackPopUpForm] = useState(false);
  const [showFeedBackPopupItem, setShowFeedBackPopupItem] = useState(null);
  function openFeedBackModalForm() {
    setShowFeedBackPopUpForm(true);
  }

  function openFeedBackPopupItem(feedback) {
    setShowFeedBackPopupItem(feedback);
  }

  const FeedBacks = [
    {
      title: "Please post more video",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum dignissimos voluptatibus ad consectetur exercitationem suscipit ducimus iusto repellendus, maiores molestias.",
      voteCount: 10,
    },
    {
      title: "Please post more video 2",
      description:
        "Dolorum dignissimos voluptatibus ad consectetur exercitationem suscipit ducimus iusto repellendus, maiores molestias.",
      voteCount: 50,
    },
  ];

  return (
    <main className="bg-white  md:max-w-2xl mx-auto md:shadow-lg md:rounded-lg md:mt-8 overflow-hidden">
      <div className="bg-gradient-to-r from-cyan-400 to-blue-400 p-8">
        <h1 className="font-bold text-xl ">bashAcademy</h1>
        <p className="text-opacity-90 text-slate-700">
          Help me decide what i should build next
        </p>
      </div>
      <div className="bg-gray-100 px-8 py-4 flex border-b ">
        <div className="grow">Filters</div>
        <div>
          <Button onClick={openFeedBackModalForm} primary>
            Make a suggestion
          </Button>
        </div>
      </div>
      <div className="px-8 ">
        {FeedBacks.map((feedback) => (
          <FeedBackItem
            key={feedback.title}
            {...feedback}
            onOpen={() => openFeedBackPopupItem(feedback)}
          />
        ))}
      </div>
      {showFeedBackPopUpForm && (
        <FeedBackFormModal setShow={setShowFeedBackPopUpForm} />
      )}
      {showFeedBackPopupItem && (
        <div className="fixed inset-0 bg-white md:bg-black md:bg-opacity-50 ">
          <FeedBackItemPopUp
            setShow={setShowFeedBackPopupItem}
            {...showFeedBackPopupItem}
          />
        </div>
      )}
    </main>
  );
}
