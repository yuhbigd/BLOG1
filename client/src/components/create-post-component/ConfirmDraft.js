import React from "react";
import classes from "./ConfirmDraft.module.css";
import Modal from "../sub-components/Modal";
function ConfirmDraft(props) {
  return (
    <Modal clickHandle={props.hideComponent}>
      <div>
        <label htmlFor="draft-name">Draft name</label>
        <input type="text" name="draft-name" id="draft-name" />
        <div>
          <button
            onClick={async () => {
              await props.deleteRedundantImagesOnSave();
              props.hideComponent();
            }}
          >
            Save
          </button>
          <button onClick={props.hideComponent}>Cancel</button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDraft;
