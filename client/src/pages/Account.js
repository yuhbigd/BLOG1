import React, { useState } from "react";
import ChangeAvatar from "../components/account-components/ChangeAvatar";
import Avatar from "../components/navigator-components/Avatar";
import classes from "./Account.module.css";

function Account(props) {
  // show change avatar modal
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const hideAvatarModalHandler = () => {
    setShowAvatarModal(false);
  };
  const showAvatarModalHandler = () => {
    setShowAvatarModal(true);
  };
  // onClickevent, handle error
  return (
    <div>
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
          <button>Change</button>
        </div>
        <h4>{`Email: ${props.reduxContext.email}`}</h4>
        <div className={classes["changeable-section"]}>
          <h4>{`Name: ${props.reduxContext.name}`}</h4>
          <button>Change</button>
        </div>
        {showAvatarModal && (
          <ChangeAvatar clickHandle={hideAvatarModalHandler}></ChangeAvatar>
        )}
      </div>
    </div>
  );
}

export default Account;
