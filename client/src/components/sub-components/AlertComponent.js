import React from "react";
import { FaBell } from "react-icons/fa";
import classes from "./Announcement.module.css";

function AlertComponent(props) {
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <button onClick={props.clickHandle}>Cancel</button>
          <button onClick={props.sureHandle}>I'm sure</button>
        </div>
      </div>
    </div>
  );
}

export default AlertComponent;
