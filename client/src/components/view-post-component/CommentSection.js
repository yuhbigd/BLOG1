import React, { useEffect, useRef, useState } from "react";
import NewCommentForm from "./NewCommentForm";
import classes from "./CommentSection.module.css";
import { useMountedState } from "react-use";
import useHttp from "../../custom-hooks/use-http";
import { getComments, getNumberOfComments } from "../../api/commentApi";
import CommentBox from "./CommentBox";
function CommentSection(props) {
  const [comments, setComments] = useState({ data: [] });
  const [showMoreButton, setShowMoreButton] = useState(false);
  const numberOfComments = useRef(0);
  const allComments = useRef([]);
  const isMount = useMountedState();
  const {
    sendRequest: getCommentsFromServer,
    status: getCommentsStatus,
    data: commentsFromServer,
    error: getCommentsError,
  } = useHttp(getComments);
  // if component is mounted
  useEffect(() => {
    (async () => {
      //get and set number of post
      let number;
      try {
        number = await getNumberOfComments(props.slug);
      } catch (err) {
        number = { count: 0 };
      }
      if (isMount()) {
        numberOfComments.current = number.count;
        if (number.count > 10) {
          setShowMoreButton(true);
        }
        callRequestComments();
      }
    })();
  }, []);
  function callRequestComments() {
    getCommentsFromServer({ slug: props.slug });
  }
  function appendComments(begin, end) {
    if (comments.data.length < allComments.current.length) {
      const data = [...comments.data].concat(
        allComments.current.slice(begin, end),
      );
      if (data.length === allComments.current.length) {
        setShowMoreButton(false);
      }
      setComments({ data: data });
    }
  }
  function prependComments(item) {
    let newArray = comments.data.slice();
    newArray.unshift(item);
    setComments({ data: newArray });
  }
  useEffect(() => {
    if (isMount()) {
      if (getCommentsStatus === "completed" && commentsFromServer) {
        allComments.current = commentsFromServer.data.comments;
        appendComments(0, 10);
      }
    }
  }, [getCommentsStatus, commentsFromServer]);
  return (
    <div>
      <NewCommentForm slug={props.slug} prependComments={prependComments} />
      <div className={classes["comments-container"]}>
        {comments.data.length > 0 &&
          comments.data.map((item) => {
            return <CommentBox key={item._id} item={item} />;
          })}
      </div>
      {showMoreButton && (
        <button
          onClick={() => {
            appendComments(comments.data.length, comments.data.length + 10);
          }}
          className={classes["more-button"]}
        >
          More
        </button>
      )}
    </div>
  );
}

export default CommentSection;
