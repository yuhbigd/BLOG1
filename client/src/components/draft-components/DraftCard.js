import React from "react";
import classes from "./DraftCard.module.css";
import { Link } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

function DraftCard(props) {
  return (
    <Link className={classes.card} to={"/drafts?page=2"}>
      <div className={classes.container}>
        <button
          style={{ padding: "15px" }}
          onClick={(event) => {
            event.stopPropagation();
            event.preventDefault();
            props.close();
          }}
        >
          close
        </button>
        {props.name}
      </div>
    </Link>
  );
}

export default DraftCard;
