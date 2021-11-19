import React, { useRef, useState } from "react";
import { useHistory, useParams } from "react-router";
import { useMountedState } from "react-use";
import { removeImagesRedundancy } from "../../api/editorApi";
import { deleteArticle, updateArticle } from "../../api/postArticleApi";
import useHttp from "../../custom-hooks/use-http";
import Editor from "../create-post-component/editor/Editor";
import AlertComponent from "../sub-components/AlertComponent";
import Modal from "../sub-components/Modal";
import Spinner from "../sub-components/Spinner";
import classes from "./DetailPost.module.css";
function DetailPost(props) {
  const [showAlert, setShowAlert] = useState(null);
  function hideAlertComponent(event) {
    setShowAlert(null);
  }

  const history = useHistory();
  const isMount = useMountedState();
  const editorRef = useRef();
  const params = useParams();
  const {
    sendRequest: deletePostFromServer,
    status: deletePostFromServerStatus,
    data: deletedPostFromServer,
  } = useHttp(deleteArticle);
  const { sendRequest: deleteRedundantImage } = useHttp(removeImagesRedundancy);
  const { sendRequest: sendPostToServer, status: sendPostStatus } =
    useHttp(updateArticle);
  function updatePostData() {
    const thumbnailImage = editorRef.current.thumbnailImage();
    const HTMLContent = editorRef.current.getHTMLContent();
    const JSONContent = editorRef.current.getJSONContent();
    const data = {
      contentHtml: HTMLContent,
      contentJson: JSONContent,
      thumbnailImage,
    };
    return sendPostToServer({ slug: props.slug, data });
  }
  function updateAlertComponent(event) {
    const component = (
      <Modal
        clickHandle={(event) => {
          event.stopPropagation();
          event.preventDefault();
          hideAlertComponent();
        }}
      >
        <AlertComponent
          title={"Update this post?"}
          message={"Are you sure?"}
          clickHandle={(event) => {
            event.stopPropagation();
            event.preventDefault();
            hideAlertComponent();
          }}
          sureHandle={async (event) => {
            event.stopPropagation();
            event.preventDefault();
            const deleteImages =
              editorRef.current.deleteRedundantImagesOnSave();
            const update = updatePostData();
            await Promise.all([update, deleteImages]);
            if (isMount()) {
              hideAlertComponent();
            }
          }}
        ></AlertComponent>
      </Modal>
    );
    setShowAlert(component);
  }
  function deleteAlertComponent(event) {
    const component = (
      <Modal
        clickHandle={(event) => {
          event.stopPropagation();
          event.preventDefault();
          hideAlertComponent();
        }}
      >
        <AlertComponent
          title={"Delete this post?"}
          message={"Are you sure?"}
          clickHandle={(event) => {
            event.stopPropagation();
            event.preventDefault();
            hideAlertComponent();
          }}
          sureHandle={async (event) => {
            event.stopPropagation();
            event.preventDefault();

            deleteRedundantImage({
              images: editorRef.current.getAllImages(),
            });
            deletePostFromServer(props.slug).then(() => {
              if (isMount()) {
                history.push("/myposts");
              }
            });
          }}
        ></AlertComponent>
      </Modal>
    );
    setShowAlert(component);
  }
  return (
    <div className={classes.container}>
      {showAlert}
      {(sendPostStatus === "pending" ||
        deletePostFromServerStatus === "pending") && <Spinner />}
      <h1>{props.article.title}</h1>
      <Editor
        ref={editorRef}
        contentJson={props.article.contentJson}
        thumbnailImg={props.article.thumbnailImage}
      />
      <div className={classes["button-div"]}>
        <button
          className={classes["public-button"]}
          onClick={(event) => {
            !(
              sendPostStatus === "pending" ||
              deletePostFromServerStatus === "pending"
            ) && updateAlertComponent(event);
          }}
        >
          Update this post
        </button>
        <button
          className={classes["delete-button"]}
          onClick={(event) => {
            !(
              sendPostStatus === "pending" ||
              deletePostFromServerStatus === "pending"
            ) && deleteAlertComponent(event);
          }}
        >
          Delete this post
        </button>
      </div>
    </div>
  );
}

export default DetailPost;
