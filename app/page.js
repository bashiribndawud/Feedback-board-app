"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import FeedBackItem from "./components/FeedBackItem";
import FeedBackFormModal from "./components/FeedBackFormModal";
import Button from "./components/Button";
import FeedBackItemPopUp from "./components/FeedBackItemPopUp";
import { useSession, signIn, signOut, useClient } from "next-auth/react";
import axios from "axios";
import SignOut from "./components/icons/SignOut";
import SignIn from "./components/icons/SignIn";
import Loader from "./components/Loader";
import Search from "./components/icons/Search";
import { debounce } from "lodash";

export default function Home() {
  const [showFeedBackPopUpForm, setShowFeedBackPopUpForm] = useState(false);
  const [showFeedBackPopupItem, setShowFeedBackPopupItem] = useState(null);
  const [FeedBacks, setFeedbacks] = useState([]);
  const [feedbackId, setFeedbacksId] = useState("");
  const waitingRef = useRef(false);
  const [waiting, setWaiting] = useState(false);
  const [voteLoading, setVoteLoading] = useState(false);
  const [sort, setSort] = useState("votes");
  const [fetchingFeedbacks, setFetchingFeedback] = useState(false);
  const fetchingFeedbacksRef = useRef(false);
  const everythingLoaded = useRef(false);
  const [searchPhrase, setsearchPhrase] = useState("");
  const loadedRows = useRef(0);
  const sortRef = useRef("votes");
  const searchPhraseRef = useRef("");
  const [votes, setVotes] = useState([]);
  const { data: session } = useSession();
  const debouncedFetchFeedbacks = useRef(
    debounce((append = false) => FetchAllFeedBacks(append), 300)
  );

  useEffect(() => {
    FetchAllFeedBacks();
  }, []);

  function openFeedBackModalForm() {
    setShowFeedBackPopUpForm(true);
  }

  function openFeedBackPopupItem(feedback) {
    setShowFeedBackPopupItem(feedback);
  }

  // GET -> get all feedbacks

  useEffect(() => {
    loadedRows.current = 0;
    sortRef.current = sort;
    everythingLoaded.current = false;
    searchPhraseRef.current = searchPhrase;
    if (FeedBacks?.length > 0) {
      setFeedbacks([]);
    }
    setWaiting(true);
    waitingRef.current = true;
    debouncedFetchFeedbacks.current();
  }, [sort, searchPhrase]);

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
      "/api/vote?feedbackIds=" + FeedBacks?.map((f) => f._id).join(",")
    );
    setVotes(res.data);
    setVoteLoading(false);
  }
  function handleScroll(e) {
    const html = window.document.querySelector("html");
    const howMuchScrolled = html.scrollTop;
    const howMuchIsToScroll = html.scrollHeight;
    const leftToScroll =
      howMuchIsToScroll - howMuchScrolled - html.clientHeight;
    if (leftToScroll <= 100) {
      FetchAllFeedBacks(true);
    }
  }
  function unregisterScrollListerner() {
    window.removeEventListener("scroll", handleScroll);
  }
  function registerScrollLsitener() {
    window.addEventListener("scroll", handleScroll);
  }
  useEffect(() => {
    registerScrollLsitener();

    return () => {
      unregisterScrollListerner();
    };
  }, []);

  async function FetchAllFeedBacks(append = false) {
    // if we are already fetching stop here
    if (fetchingFeedbacksRef.current) return;
    if (everythingLoaded.current) return;
    fetchingFeedbacksRef.current = true;
    setFetchingFeedback(true);
    axios
      .get(
        `/api/feedback?sort=${sortRef.current}&loadedRows=${loadedRows.current}&search=${searchPhraseRef.current}`
      )
      .then((res) => {
        if (append) {
          setFeedbacks((currentFeebacks) => [...currentFeebacks, ...res.data]);
        } else {
          setFeedbacks(res.data);
        }
        if (res.data?.length > 0) {
          loadedRows.current += res.data.length;
        }
        if (res.data?.length === 0) {
          everythingLoaded.current = false;
        }
        fetchingFeedbacksRef.current = false;
        setFetchingFeedback(false);
        waitingRef.current = false;
        setWaiting(false);
      });
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
    <main className="bg-white md:mb-8  md:max-w-2xl mx-auto md:shadow-lg md:rounded-lg md:mt-8 overflow-hidden">
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
      <div className="bg-gray-100 px-8 py-4 flex border-b items-center flex-wrap">
        <div className="grow flex items-center gap-4 text-gray-600 flex-wrap">
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              lastId.current = "";
            }}
            name=""
            id=""
            className="bg-transparent py-2 px-2 "
          >
            <option value="votes">Most voted</option>
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
          <div className="relative">
            <Search className="w-4 h-4 absolute top-3 left-2 pointer-events-none" />
            <input
              className="bg-transparent p-2 pl-8 focus:border-none focus:outline-blue-400 rounded-md"
              type="text"
              placeholder="Search..."
              value={searchPhrase}
              onChange={(e) => setsearchPhrase(e.target.value)}
            />
          </div>
        </div>
        <Button onClick={openFeedBackModalForm} primary className="mt-4 sm:mt-0">
          Make a suggestion
        </Button>
      </div>
      <div className="px-4 md:px-8">
        {FeedBacks?.length === 0 && !fetchingFeedbacks && !waiting && (
          <div className="p-4 text-4xl text-gray-500">Nothing Found :( </div>
        )}

        {FeedBacks?.map((feedback) => (
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
        {(fetchingFeedbacks || waiting) && (
          <div className="p-2 flex items-center justify-center">
            <Loader />
          </div>
        )}
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
