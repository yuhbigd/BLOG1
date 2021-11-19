import React, { useEffect, useRef, useState } from "react";
import { useMountedState, useUpdateEffect } from "react-use";
import { saveComment } from "../../api/commentApi";
import useHttp from "../../custom-hooks/use-http";
import Spinner from "../sub-components/Spinner";
import Modal from "../sub-components/Modal";
import ErrorComponent from "../sub-components/ErrorComponent";
import classes from "./NewCommentForm.module.css";
function NewCommentForm(props) {
  const isMount = useMountedState();
  const [error, setError] = useState(null);
  const {
    sendRequest: sendCommentToServer,
    status: sendCommentStatus,
    data: commentFromServer,
    error: sendCommentError,
  } = useHttp(saveComment);
  const commentAreaRef = useRef();
  function resizeTextArea() {
    commentAreaRef.current.style.height = "auto";
    commentAreaRef.current.style.height =
      commentAreaRef.current.scrollHeight + "px";
    if (commentAreaRef.current.value.length > 250) {
      commentAreaRef.current.value = commentAreaRef.current.value.substring(
        0,
        251,
      );
    }
  }
  useEffect(() => {
    window.onresize = function (event) {
      resizeTextArea();
    };
    return () => {
      window.onresize = () => {};
    };
  }, []);
  const isPosting = useRef(false);
  function postComment() {
    if (!isPosting.current) {
      if (commentAreaRef.current.value.trim()) {
        isPosting.current = true;
        sendCommentToServer({
          text: commentAreaRef.current.value,
          slug: props.slug,
        });
      }
    }
  }
  useUpdateEffect(() => {
    if (isMount()) {
      if (sendCommentStatus === "completed" && commentFromServer) {
        isPosting.current = false;
      } else if (sendCommentStatus === "completed" && !commentFromServer) {
        setError(
          <Modal
            clickHandle={() => {
              setError(null);
            }}
          >
            <ErrorComponent
              clickHandle={() => {
                setError(null);
              }}
              message={`${sendCommentError.message} - ${sendCommentError.statusCode}`}
            ></ErrorComponent>
          </Modal>,
        );
      }
    }
  }, [commentFromServer, sendCommentStatus]);
  return (
    <>
      {sendCommentStatus === "pending" && <Spinner />}
      {error}
      <div className={classes.control}>
        <label htmlFor="comment">Your Comment</label>
        <textarea
          id="comment"
          ref={commentAreaRef}
          onInput={(event) => {
            resizeTextArea();
          }}
        ></textarea>
      </div>
      <div className={classes.actions}>
        <button className={classes["add-button"]} onClick={postComment}>
          Add Comment
        </button>
      </div>
    </>
  );
}

export default NewCommentForm;
