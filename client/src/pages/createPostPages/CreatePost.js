import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { useMountedState, useUpdateEffect } from "react-use";
import { updateDraft } from "../../api/draftsApi";
import { publicArticle } from "../../api/postArticleApi";
import ConfirmDraft from "../../components/create-post-component/ConfirmDraft";
import Editor from "../../components/create-post-component/editor/Editor";
import AlertComponent from "../../components/sub-components/AlertComponent";
import ErrorComponent from "../../components/sub-components/ErrorComponent";
import Modal from "../../components/sub-components/Modal";
import Spinner from "../../components/sub-components/Spinner";
import useHttp from "../../custom-hooks/use-http";
import classes from "./CreatePost.module.css";
function CreatePost(props) {
  //public alert
  const [showAlert, setShowAlert] = useState(false);
  function hideAlertComponent(event) {
    setShowAlert(false);
  }
  function showAlertComponent(event) {
    setShowAlert(true);
  }
  const history = useHistory();
  const isMount = useMountedState();
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
    return sendDraftToServer({ id: idRef.current, data });
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
  // public post
  const {
    sendRequest: sendArticleToServer,
    status: sendArticleStatus,
    data: articleData,
    error: sendArticleError,
  } = useHttp(publicArticle);
  const [errorState, setErrorState] = useState(null);
  function sendArticle() {
    const thumbnailImage = editorRef.current.thumbnailImage();
    const HTMLContent = editorRef.current.getHTMLContent();
    const JSONContent = editorRef.current.getJSONContent();
    const data = {
      contentHtml: HTMLContent,
      contentJson: JSONContent,
      thumbnailImage: thumbnailImage,
      title: titleRef.current.value,
    };
    return sendArticleToServer(data);
  }
  useUpdateEffect(() => {
    if (isMount()) {
      if (sendArticleError != null) {
        setErrorState(
          <Modal
            clickHandle={() => {
              setErrorState(null);
            }}
          >
            <ErrorComponent
              clickHandle={() => {
                setErrorState(null);
              }}
              message={`${sendArticleError.message} - ${sendArticleError.statusCode}`}
            ></ErrorComponent>
          </Modal>,
        );
      }
      if (articleData && sendArticleStatus === "completed") {
        history.push(`/posts/${articleData.article.slugUrl}`);
      }
    }
  }, [sendArticleStatus, articleData, sendArticleError]);

  function resizeTextArea() {
    titleRef.current.style.height = "auto";
    titleRef.current.style.height = titleRef.current.scrollHeight + "px";
    if (titleRef.current.value.length > 150) {
      titleRef.current.value = titleRef.current.value.substring(0, 151);
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
  return (
    <div className={classes.container}>
      {(sendDraftStatus === "pending" || sendArticleStatus === "pending") && (
        <Spinner></Spinner>
      )}
      <textarea
        style={{ borderRadius: "5px" }}
        placeholder="Post title!"
        className={classes.title}
        rows="1"
        ref={titleRef}
        onInput={(event) => {
          resizeTextArea();
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
        <button
          className={classes["public-button"]}
          onClick={showAlertComponent}
        >
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
      {errorState}
      {showAlert && (
        <Modal
          clickHandle={(event) => {
            event.stopPropagation();
            event.preventDefault();
            hideAlertComponent();
          }}
        >
          <AlertComponent
            title={"Are you sure?"}
            message={"You are about to public this post"}
            clickHandle={(event) => {
              event.stopPropagation();
              event.preventDefault();
              hideAlertComponent();
            }}
            sureHandle={async (event) => {
              event.stopPropagation();
              event.preventDefault();
              const sendData = sendArticle();
              const deleteImages =
                editorRef.current.deleteRedundantImagesOnSave();
              await Promise.all([sendData, deleteImages]);
              if (isMount()) {
                hideAlertComponent();
              }
            }}
          ></AlertComponent>
        </Modal>
      )}
    </div>
  );
}

export default CreatePost;
