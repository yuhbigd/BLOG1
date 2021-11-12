import React, { useEffect, useRef, useState } from "react";
import { changeAccountInfo, changePassword } from "../../api/modifyAccountApi";
import ChangeAvatar from "../../components/account-components/ChangeAvatar";
import ChangePassword from "../../components/account-components/ChangePassword";
import Avatar from "../../components/navigator-components/Avatar";
import Announcement from "../../components/sub-components/Announcement";
import ErrorComponent from "../../components/sub-components/ErrorComponent";
import Modal from "../../components/sub-components/Modal";
import Spinner from "../../components/sub-components/Spinner";
import useHttp from "../../custom-hooks/use-http";
import classes from "./Account.module.css";
function errorMess(setErrorState, message) {
  return (
    <Modal
      clickHandle={() => {
        setErrorState(null);
      }}
    >
      <ErrorComponent
        clickHandle={() => {
          setErrorState(null);
        }}
        message={message}
      ></ErrorComponent>
    </Modal>
  );
}

function createAnnouncementModal(setAnnouncementState, title, message) {
  return (
    <Modal
      clickHandle={() => {
        window.location.href = "/login";
      }}
    >
      <Announcement
        clickHandle={() => {
          window.location.href = "/login";
        }}
        message={message}
        title={title}
      ></Announcement>
    </Modal>
  );
}
function Account(props) {
  // show error modal
  const [errorState, setErrorState] = useState(null);

  // show announcement modal
  const [announcementState, setAnnouncementState] = useState(null);

  // show change avatar modal
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // change name
  const [disabledNameInput, setDisabledNameInput] = useState(true);
  const nameRef = useRef("");
  const {
    sendRequest: sendNameRequest,
    status: nameStatus,
    data: nameData,
    error: nameError,
  } = useHttp(changeAccountInfo);

  //password input ref
  const passRef = useRef();
  const {
    sendRequest: sendPassRequest,
    status: passStatus,
    data: passData,
    error: passError,
  } = useHttp(changePassword);

  //show and hide password input
  const [showPassInputModal, setShowPassInputModal] = useState(false);
  const hidePassInputModalHandler = () => {
    setShowPassInputModal(false);
  };
  const showPassInputModalHandler = () => {
    setShowPassInputModal(true);
  };

  //show and hide Avatar modal
  const hideAvatarModalHandler = () => {
    setShowAvatarModal(false);
  };
  const showAvatarModalHandler = () => {
    setShowAvatarModal(true);
  };

  // change name handler
  function beginChangeNameHandle(event) {
    event.preventDefault();
    setDisabledNameInput(false);
  }
  async function changeNameHandle(event) {
    if (nameRef.current.value === props.reduxContext.name) {
      const errorModal = errorMess(
        setErrorState,
        "Your new name cannot be the same as your current name. Please enter a new name not like your current name ",
      );
      setErrorState(errorModal);
    } else if (nameRef.current.value) {
      sendNameRequest({
        name: nameRef.current.value,
      });
      if (nameStatus === "completed" && nameData !== null) {
        props.changeUser({
          ...props.reduxContext,
          name: nameRef.current.value,
        });
      } else if (nameError !== null) {
        const errorModal = errorMess(setErrorState, nameError.message);
        setErrorState(errorModal);
      }
    } else {
      const errorModal = errorMess(setErrorState, "Name cannot be empty");
      setErrorState(errorModal);
    }
    setDisabledNameInput(true);
  }

  //changePasswordHandler
  async function changePassHandle() {
    const currentPass = passRef.current.password.value;
    const newPass = passRef.current.newPassword.value;
    const reNewPass = passRef.current.reNewPassword.value;
    if (newPass !== reNewPass) {
      const errorModal = errorMess(
        setErrorState,
        "Password and Confirm Password should match",
      );
      setErrorState(errorModal);
    } else {
      sendPassRequest({
        password: currentPass,
        newPassword: newPass,
      });
    }
  }
  useEffect(() => {
    if (passData !== null && passError === null) {
      const announcementModal = createAnnouncementModal(
        setAnnouncementState,
        "DONE",
        "Please re-login",
      );
      setAnnouncementState(announcementModal);
    }
    if (passError !== null) {
      const errorModal = errorMess(setErrorState, passError.message);
      setErrorState(errorModal);
    }
  }, [passError, passStatus, passData]);
  // const isPending = nameStatus === "pending" || passStatus === "pending";
  return (
    <div>
      {errorState}
      {announcementState}
      {nameStatus === "pending" && <Spinner></Spinner>}
      <div className={classes.avatar} onClick={showAvatarModalHandler}>
        <Avatar></Avatar>
      </div>
      <div className={classes.container}>
        <h4>{`ID: ${props.reduxContext._id}`}</h4>
        <div className={classes["changeable-section"]}>
          <h4>
            {"Password: "}
            <span style={{ fontSize: "0.7rem" }}>⚫⚫⚫⚫⚫⚫</span>
          </h4>
          <button onClick={showPassInputModalHandler}>Change</button>
        </div>
        <h4>{`Email: ${props.reduxContext.email}`}</h4>
        <div className={classes["changeable-section"]}>
          <h4>{`Name: `}</h4>
          <input
            type="text"
            name="name"
            id="name"
            disabled={disabledNameInput}
            defaultValue={props.reduxContext.name}
            ref={nameRef}
          />
          {disabledNameInput ? (
            <button onClick={beginChangeNameHandle}>Change</button>
          ) : (
            <button onClick={changeNameHandle}>Save</button>
          )}
        </div>
        {showAvatarModal && (
          <ChangeAvatar clickHandle={hideAvatarModalHandler}></ChangeAvatar>
        )}
        {showPassInputModal && (
          <ChangePassword
            clickHandle={hidePassInputModalHandler}
            onSave={changePassHandle}
            ref={passRef}
          ></ChangePassword>
        )}
      </div>
    </div>
  );
}

export default Account;
