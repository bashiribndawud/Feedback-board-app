"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import FeedBackItem from "./components/FeedBackItem";
import FeedBackFormModal from "./components/FeedBackFormModal";
import Button from "./components/Button";
import FeedBackItemPopUp from "./components/FeedBackItemPopUp";
import { useSession, signIn, signOut, useClient } from "next-auth/react";
import axios from "axios";
import SignOut from "./components/icons/SignOut";
import SignIn from "./components/icons/SignIn";

export default function Home() {
  const [showFeedBackPopUpForm, setShowFeedBackPopUpForm] = useState(false);
  const [showFeedBackPopupItem, setShowFeedBackPopupItem] = useState(null);
  const [FeedBacks, setFeedbacks] = useState([]);
  const [feedbackId, setFeedbacksId] = useState("");
  const [voteLoading, setVoteLoading] = useState(false);
  const [sort, setSort] = useState("votes");
  const [lastId, setLastId] = useState('')
  const [votes, setVotes] = useState([]);
  const { data: session } = useSession();

  function openFeedBackModalForm() {
    setShowFeedBackPopUpForm(true);
  }

  function openFeedBackPopupItem(feedback) {
    setShowFeedBackPopupItem(feedback);
  }

  // GET -> get all feedbacks

  useEffect(() => {
    FetchAllFeedBacks();
  }, [sort]);

  // GET -> votes from all fetched feedbacks
  useEffect(() => {
    fetchVotes();
  }, [FeedBacks]);

  useEffect(() => {
    if (session?.user?.email) {
      const feedbackToVote = localStorage.getItem("going_to_vote");
      if (feedbackId) {
        axios
          .post("/api/vote", { feedbackId: feedbackToVote })
          .then((response) => {
            localStorage.removeItem("going_to_vote");
            fetchVotes();
          });
      }
      const feedBackToPost = localStorage.getItem("post_after_login");
      if (feedBackToPost) {
        const FeedbackData = JSON.parse(feedBackToPost);
        axios.post("/api/feedback", FeedbackData).then(async (res) => {
          await FetchAllFeedBacks();
          setShowFeedBackPopupItem(res.data);
          localStorage.removeItem("post_after_login");
        });
      }
      const feedBackComment = localStorage.getItem("comment_to_post");
      if (feedBackComment) {
        const FeedbackCommentData = JSON.parse(feedBackComment);
        axios.post("/api/comment", FeedbackCommentData).then(() => {
          axios
            .get("/api/feedback?id=" + FeedbackCommentData.feedbackId)
            .then((res) => {
              setShowFeedBackPopupItem(res.data);
              localStorage.removeItem("comment_to_post");
            });
        });
      }
    }
  }, [session?.user?.email]);

  async function fetchVotes() {
    setVoteLoading(true);
    const res = await axios.get(
      "/api/vote?feedbackIds=" + FeedBacks.map((f) => f._id).join(",")
    );
    setVotes(res.data);
    setVoteLoading(false);
  }
  function handleScroll(e){
    const html = window.document.querySelector('html');
    const howMuchScrolled = html.scrollTop;
    const howMuchIsToScroll = html.scrollHeight
    const leftToScroll = howMuchIsToScroll - howMuchScrolled - html.clientHeight;
    console.log({ leftToScroll });
  }
  function unregisterScrollListerner(){
    window.removeEventListener("scroll", handleScroll);
  }
  function registerScrollLsitener(){
    window.addEventListener('scroll', handleScroll)
  }
  useEffect(() => {
    registerScrollLsitener()

    return () => {unregisterScrollListerner();}
  },[])
  async function FetchAllFeedBacks() {
    const res = await axios.get(`/api/feedback?sort=${sort}&lastId=${lastId}`);
    setFeedbacks(res.data);
    setLastId(res.data[res.data.length - 1]._id)
  }

  function handleUserLogOut(e) {
    e.preventDefault();
    if (session?.user) {
      signOut();
    }
  }
  async function handleUserSignIn(e) {
    e.preventDefault();
    await signIn("google");
  }

  async function handleFeedbackupdate(newData) {
    setShowFeedBackPopupItem((prevItems) => {
      return { ...prevItems, ...newData };
    });
    await FetchAllFeedBacks();
  }


  return (
    <main className="bg-white  md:max-w-2xl mx-auto md:shadow-lg md:rounded-lg md:mt-8 overflow-hidden">
      <div className="bg-gradient-to-r from-cyan-400 to-blue-400 p-8">
        <h1 className="font-bold text-xl ">bashAcademy</h1>
        <p className="text-opacity-90 text-slate-700">
          Help me decide what i should build next
          {session && (
            <div className="font-bold flex justify-between items-center">
              <span>
                Hello {session.user.name.split(" ")[0]}, Welcome Aboard
              </span>
              <button
                onClick={handleUserLogOut}
                className="text-sm font-light flex items-center gap-1 bg-white p-2 rounded-lg shadow-lg"
              >
                <SignOut />
                Logout
              </button>
            </div>
          )}
          {!session?.user && (
            <div className="flex justify-end">
              <button
                onClick={handleUserSignIn}
                className="text-sm font-light flex gap-1 items-center bg-white p-2 rounded-lg shadow-lg"
              >
                <SignIn />
                SignIn
              </button>
            </div>
          )}
        </p>
      </div>
      <div className="bg-gray-100 px-8 py-4 flex border-b items-center">
        <div className="grow flex items-center">
          <span className="text-gray-400 text-sm">Sort by:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            name=""
            id=""
            className="bg-transparent py-2 px-2 text-gray-600"
          >
            <option value="votes">Most voted</option>
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
        <Button onClick={openFeedBackModalForm} primary>
          Make a suggestion
        </Button>
      </div>
      <div className="px-4 md:px-8">
        {FeedBacks.length > 0 &&
          FeedBacks.map((feedback) => (
            <FeedBackItem
              key={feedback.title}
              {...feedback}
              onOpen={() => openFeedBackPopupItem(feedback)}
              votes={votes.filter(
                (v) => v.feedbackId.toString() === feedback._id.toString()
              )}
              onVoteChange={fetchVotes}
              parentLoadingVotes={voteLoading}
            />
          ))}
      </div>
      {showFeedBackPopUpForm && (
        <FeedBackFormModal
          setShow={setShowFeedBackPopUpForm}
          onCreate={FetchAllFeedBacks}
        />
      )}
      {showFeedBackPopupItem && (
        <div className="fixed inset-0 bg-white md:bg-black md:bg-opacity-50 ">
          <FeedBackItemPopUp
            setShow={setShowFeedBackPopupItem}
            {...showFeedBackPopupItem}
            votes={votes.filter(
              (v) =>
                v.feedbackId.toString() === showFeedBackPopupItem._id.toString()
            )}
            onVoteChange={fetchVotes}
            onUpdate={handleFeedbackupdate}
          />
        </div>
      )}
    </main>
  );
}
