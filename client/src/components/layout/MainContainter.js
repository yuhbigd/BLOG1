import React from "react";
import classes from "./MainContainer.module.css";
function MainContainter(props) {
  return <div className={classes["main-container"]}>{props.children}</div>;
}

export default MainContainter;
