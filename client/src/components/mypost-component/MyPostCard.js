import React from "react";
import { FaTimes } from "react-icons/fa";
import { Link, useHistory } from "react-router-dom";
import classes from "./MyPostCard.module.css";

function MyPostCard(props) {
  const history = useHistory();
  return (
    <Link className={classes["card"]} to={"/posts/" + props.item.slugUrl}>
      <button
        className={classes["delete-button"]}
        title={"Delete this post"}
        onClick={(event) => {
          event.stopPropagation();
          event.preventDefault();
          props.onDelete();
        }}
      >
        <FaTimes />
      </button>
      <button
        onClick={(event) => {
          event.stopPropagation();
          event.preventDefault();
          history.push(`/myposts/${props.item.slugUrl}`);
        }}
        className={classes["update-button"]}
      >
        Update post
      </button>
      <div className={classes["card__header"]}>
        <img
          src={props.item.thumbnailImage}
          alt="card__image"
          className={classes["card__image"]}
        />
      </div>
      <div className={classes["card__body"]}>
        <h4>{props.item.title}</h4>
      </div>
      <div className={classes["card__footer"]}>
        <div className={classes["user"]} title={props.item.author.name}>
          <img
            src={`${process.env.REACT_APP_STORAGE_URL}${props.item.author.avatar}`}
            alt="user__image"
            className={classes["user__image"]}
            onClick={(event) => {
              event.stopPropagation();
              event.preventDefault();
              history.push(`/u/${props.item.author._id}`);
            }}
          />
          <div className={classes["user__info"]}>
            <Link
              to={`/u/${props.item.author._id}`}
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <h5>{props.item.author.name}</h5>
            </Link>
            <div className={classes["post__info"]}>
              <small>{props.item.createAt}</small>
              <small>
                {"Views: "}
                {props.item.totalViews}
              </small>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default MyPostCard;
