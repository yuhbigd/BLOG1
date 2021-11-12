import React, { useEffect, useRef, useState } from "react";
import classes from "./ConfirmDraft.module.css";
import Modal from "../sub-components/Modal";
import useHttp from "../../custom-hooks/use-http";
import { saveDraft } from "../../api/draftsApi";
import ErrorComponent from "../sub-components/ErrorComponent";
import Spinner from "../sub-components/Spinner";
function ConfirmDraft(props) {
  const nameRef = useRef();
  const [errorState, setErrorState] = useState(null);
  const {
    sendRequest: sendDraftToServer,
    status: sendDraftStatus,
    data: draftData,
    error: sendDraftError,
  } = useHttp(saveDraft);
  function sendDraftData() {
    const thumbnailImage = props.thumbnailImage();
    const HTMLContent = props.HTMLContent();
    const JSONContent = props.JSONContent();
    const name = nameRef.current.value;
    const data = {
      name: name,
      contentHtml: HTMLContent,
      contentJson: JSONContent,
      thumbnailImage,
      title: props.titleRef.current.value,
    };
    return sendDraftToServer(data);
  }
  useEffect(() => {
    if (sendDraftError != null) {
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
            message={`${sendDraftError.message} - ${sendDraftError.statusCode}`}
          ></ErrorComponent>
        </Modal>,
      );
    }
    if (draftData != null && sendDraftStatus == "completed") {
      props.hideComponent();
    }
  }, [sendDraftStatus, draftData, sendDraftError]);
  return (
    <Modal clickHandle={props.hideComponent}>
      <div className={classes["container"]}>
        <label htmlFor="draft-name">Draft name</label>
        <input
          type="text"
          name="draft-name"
          id="draft-name"
          placeholder="Type here"
          ref={nameRef}
        />
        <div className={classes["button-container"]}>
          <button
            onClick={async () => {
              await props.deleteRedundantImagesOnSave();
              await sendDraftData();
            }}
            className={classes["save-button"]}
          >
            Save
          </button>
          <button
            onClick={props.hideComponent}
            className={classes["cancel-button"]}
          >
            Cancel
          </button>
        </div>
      </div>
      {errorState}
      {sendDraftStatus === "pending" && <Spinner></Spinner>}
    </Modal>
  );
}

export default ConfirmDraft;
