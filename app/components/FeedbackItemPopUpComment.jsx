// "use client"
import React, { useState } from "react";
import Button from "./Button";
import Avatar from "./Avatar";

const FeedbackItemPopUpComment = () => {
  const [commentText, setCommentText] = useState("");
  return (
    <div className="p-8">
      <div className="flex gap-4 mb-8">
        <Avatar />
        <div>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci,
            ipsa voluptatem? Cupiditate corrupti debitis aut expedita suscipit
            exercitationem illo voluptas consequuntur aspernatur eos natus modi
            eveniet quisquam autem in dolores quos tempore, fuga similique?
            Magni nostrum quos est deserunt aperiam?
          </p>
          <div className="text-sm text-gray-400 mt-2">Anonymous &middot; a few seconds ago</div>
        </div>
      </div>
      <form action="">
        <textarea
          name=""
          id=""
          className="border rounded-md w-full p-2 focus:outline-blue-400"
          placeholder="Let us know what you think"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        ></textarea>
        <div className="flex justify-end gap-2 mt-2">
          <Button>Attach files</Button>
          <Button primary disabled={commentText === ""}>
            Comment
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackItemPopUpComment;
