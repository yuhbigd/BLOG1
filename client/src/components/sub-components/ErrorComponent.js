import React from "react";
import { FaTimes } from "react-icons/fa";
import classes from "./Error.module.css";
function ErrorComponent(props) {
  return (
    <div className={classes.container}>
      <div className={classes["error-bg"]}>
        <div className={classes["icon"]}>
          <FaTimes></FaTimes>
        </div>
      </div>
      <div className={classes["message-section"]}>
        <h2>Ooops</h2>
        <p>{props.message}</p>
        <button onClick={props.clickHandle}>OK, 👍</button>
      </div>
    </div>
  );
}

export default ErrorComponent;
