import React from "react";
import { Link } from "react-router-dom";
import classes from "./PostCard.module.css";
function PostCard(props) {
  return (
    <Link className={classes["card"]} to="/">
      <div className={classes["card__header"]}>
        <img
          src="https://storage.googleapis.com/nodejs---storage.appspot.com/public/uploads/posts/images/6168fbb9c5d5be8d88eb5c3f+2021-11-17_15-54-47.498Z+0bd4.png"
          alt="card__image"
          className={classes["card__image"]}
        />
      </div>
      <div className={classes["card__body"]}>
        <h4>What's new in 2022 Tech</h4>
      </div>
      <div className={classes["card__footer"]}>
        <Link
          className={classes["user"]}
          to="/create"
          title="Jane Doe"
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <img
            src={`${process.env.REACT_APP_STORAGE_URL}public/uploads/images/avatar-25b0cf12d9c19762.png`}
            alt="user__image"
            className={classes["user__image"]}
          />
          <div className={classes["user__info"]}>
            <h5>Jane Doe</h5>
            <small>2h ago</small>
            <small>Total view: 2</small>
          </div>
        </Link>
      </div>
    </Link>
  );
}

export default PostCard;
