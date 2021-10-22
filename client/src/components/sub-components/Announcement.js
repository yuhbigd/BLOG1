import React from "react";
import { FaBell } from "react-icons/fa";
import classes from "./Announcement.module.css";

function Announcement(props) {
  return (
    <div className={classes.container}>
      <div className={classes["announcement-bg"]}>
        <div className={classes["icon"]}>
          <FaBell></FaBell>
        </div>
      </div>
      <div className={classes["message-section"]}>
        <h2>{props.title}</h2>
        <p>{props.message}</p>
        <button onClick={props.clickHandle}>OK, 👍</button>
      </div>
    </div>
  );
}

export default Announcement;
