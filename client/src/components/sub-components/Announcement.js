import React from "react";
import { FaRegPaperPlane } from "react-icons/fa";
import classes from "./Announcement.module.css";
function Announcement(props) {
  return (
    <div className={classes.container}>
      <FaRegPaperPlane className={classes.icon}></FaRegPaperPlane>
      <h2>{props.message}</h2>
      <button onClick={props.clickHandle}>OK 😄</button>
    </div>
  );
}

export default Announcement;
