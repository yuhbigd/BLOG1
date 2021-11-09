import React, { useRef, useState } from "react";
import ConfirmDraft from "../../components/create-post-component/ConfirmDraft";
import Editor from "../../components/create-post-component/editor/Editor";
import classes from "./CreatePost.module.css";
function CreatePost() {
  const titleRef = useRef();
  const editorRef = useRef();
  const [showDraftConfirm, setShowDraftConfirm] = useState(false);
  return (
    <div className={classes.container}>
      <textarea
        placeholder="Post title!"
        className={classes.title}
        rows="1"
        ref={titleRef}
        onInput={(event) => {
          titleRef.current.style.height = "auto";
          titleRef.current.style.height = titleRef.current.scrollHeight + "px";
          if (titleRef.current.value.length > 150) {
            titleRef.current.value = titleRef.current.value.substring(0, 151);
          }
        }}
      ></textarea>
      <Editor ref={editorRef}></Editor>
      <button
        onClick={() => {
          // editorRef.current.savePost();
          setShowDraftConfirm(true);
        }}
      >
        Save to drafts
      </button>
      {showDraftConfirm === true && (
        <ConfirmDraft
          hideComponent={() => {
            setShowDraftConfirm(false);
          }}
          deleteRedundantImagesOnSave={
            editorRef.current.deleteRedundantImagesOnSave
          }
        ></ConfirmDraft>
      )}
    </div>
  );
}

export default CreatePost;
