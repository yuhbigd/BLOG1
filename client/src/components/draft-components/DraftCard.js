import React, { useState } from "react";
import classes from "./DraftCard.module.css";
import { Link } from "react-router-dom";
import Modal from "../sub-components/Modal";
import AlertComponent from "../sub-components/AlertComponent";
import { FaTimes } from "react-icons/fa";

function DraftCard(props) {
  const [showAlert, setShowAlert] = useState(false);
  function hideAlertComponent(event) {
    setShowAlert(false);
  }
  function showAlertComponent(event) {
    setShowAlert(true);
  }
  return (
    <Link className={classes.card} to={"/drafts" + "/" + props.id}>
      <p>{props.name}</p>
      <button
        onClick={(event) => {
          event.stopPropagation();
          event.preventDefault();
          showAlertComponent();
        }}
        title={"delete"}
      >
        <FaTimes></FaTimes>
      </button>
      {showAlert && (
        <Modal
          clickHandle={(event) => {
            event.stopPropagation();
            event.preventDefault();
            hideAlertComponent();
          }}
        >
          <AlertComponent
            title={"Are you sure"}
            message={"You are about to delete this draft"}
            clickHandle={(event) => {
              event.stopPropagation();
              event.preventDefault();
              hideAlertComponent();
            }}
            sureHandle={(event) => {
              event.stopPropagation();
              event.preventDefault();
              props.close();
              hideAlertComponent();
            }}
          ></AlertComponent>
        </Modal>
      )}
    </Link>
  );
}

export default DraftCard;
