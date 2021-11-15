import React, { useEffect, useRef, useState } from "react";
import { updateDraft } from "../../api/draftsApi";
import ConfirmDraft from "../../components/create-post-component/ConfirmDraft";
import Editor from "../../components/create-post-component/editor/Editor";
import Spinner from "../../components/sub-components/Spinner";
import useHttp from "../../custom-hooks/use-http";
import classes from "./CreatePost.module.css";
function CreatePost(props) {
  const titleRef = useRef();
  const editorRef = useRef();
  const idRef = useRef();
  const [showDraftConfirm, setShowDraftConfirm] = useState(false);
  const {
    sendRequest: sendDraftToServer,
    status: sendDraftStatus,
    data: draftData,
    error: sendDraftError,
  } = useHttp(updateDraft);
  function updateDraftData() {
    const thumbnailImage = editorRef.current.thumbnailImage();
    const HTMLContent = editorRef.current.getHTMLContent();
    const JSONContent = editorRef.current.getJSONContent();
    const data = {
      contentHtml: HTMLContent,
      contentJson: JSONContent,
      thumbnailImage,
      title: titleRef.current.value,
    };
    sendDraftToServer({ id: idRef.current, data });
  }
  //for draft detail
  useEffect(() => {
    if (props.id) {
      idRef.current = props.id;
    }
    if (props.draft) {
      if (props.draft.title) {
        titleRef.current.value = props.draft.title;
      }
    }
  }, []);
  // con phan public post chua lam :]
  return (
    <div className={classes.container}>
      {sendDraftStatus === "pending" && <Spinner></Spinner>}
      <textarea
        style={{ borderRadius: "5px" }}
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
      {props.draft ? (
        <Editor
          ref={editorRef}
          contentJson={props.draft.contentJson}
          thumbnailImg={props.draft.thumbnailImage}
        ></Editor>
      ) : (
        <Editor ref={editorRef} contentJson={null} thumbnailImg={""}></Editor>
      )}
      <div className={classes["button-div"]}>
        <button className={classes["public-button"]}>
          Public this article
        </button>
        <button
          className={classes["draft-button"]}
          onClick={async () => {
            // editorRef.current.savePost();
            if (!idRef.current) {
              setShowDraftConfirm(true);
            } else {
              const update = updateDraftData();
              const deleteImages =
                editorRef.current.deleteRedundantImagesOnSave();
              await Promise.all([update, deleteImages]);
            }
          }}
        >
          Save to drafts
        </button>
      </div>
      {showDraftConfirm === true && (
        <ConfirmDraft
          hideComponent={() => {
            setShowDraftConfirm(false);
          }}
          deleteRedundantImagesOnSave={
            editorRef.current.deleteRedundantImagesOnSave
          }
          titleRef={titleRef}
          idRef={idRef}
          thumbnailImage={editorRef.current.thumbnailImage}
          HTMLContent={editorRef.current.getHTMLContent}
          JSONContent={editorRef.current.getJSONContent}
        ></ConfirmDraft>
      )}
    </div>
  );
}

export default CreatePost;
