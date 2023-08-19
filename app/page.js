"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import FeedBackItem from "./components/FeedBackItem";
import FeedBackFormModal from "./components/FeedBackFormModal";
import Button from "./components/Button";
import FeedBackItemPopUp from "./components/FeedBackItemPopUp";
import { useSession, signIn, signOut } from "next-auth/react";
import axios from "axios";

export default function Home() {
  const [showFeedBackPopUpForm, setShowFeedBackPopUpForm] = useState(false);
  const [showFeedBackPopupItem, setShowFeedBackPopupItem] = useState(null);
  const [FeedBacks, setFeedbacks] = useState([]);
  const { data: session } = useSession();

  // if (session) {
  //   return (
  //     <>
  //       Signed in as {session.user.email} <br />
  //       <button onClick={() => signOut()}>Sign out</button>
  //     </>
  //   );
  // }

  function openFeedBackModalForm() {
    setShowFeedBackPopUpForm(true);
  }

  function openFeedBackPopupItem(feedback) {
    setShowFeedBackPopupItem(feedback);
  }

  useEffect(() => {
    axios.get("/api/feedback").then((res) => setFeedbacks(res.data));
  }, []);

  return (
    <main className="bg-white  md:max-w-2xl mx-auto md:shadow-lg md:rounded-lg md:mt-8 overflow-hidden">
      <div className="bg-gradient-to-r from-cyan-400 to-blue-400 p-8">
        <h1 className="font-bold text-xl ">bashAcademy</h1>
        <p className="text-opacity-90 text-slate-700">
          Help me decide what i should build next
          {session ? (
            <div>Hello, {session.user.name.split(" ")[0]} Welcome Aboard</div>
          ) : (
            <button onClick={() => signOut()}>Sign out</button>
          )}
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
