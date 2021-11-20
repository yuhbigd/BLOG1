import React from "react";
import { Link, useHistory } from "react-router-dom";
import classes from "./PostCard.module.css";
import moment from "moment";
const COLOR = ["#c563fa", "#6cff5e", "#FF865E"];
let nameWords = (name) => {
  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => {
      return word.charAt(0);
    })
    .reduce((word, char) => {
      return word + char;
    }, "");
};

function PostCard(props) {
  const now = moment();
  const history = useHistory();
  return (
    <Link className={classes["card"]} to={"/posts/" + props.item.slugUrl}>
      <div className={classes["card__header"]}>
        <img
          src={props.item.thumbnailImage}
          alt="card__image"
          className={classes["card__image"]}
        />
      </div>
      <div className={classes["card__body"]}>
        <h4 title={props.item.title}>{props.item.title}</h4>
      </div>
      <div className={classes["card__footer"]}>
        <div className={classes["user"]} title={props.item.author.name}>
          {props.item.author.avatar ? (
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
          ) : (
            <div
              className={classes["user__avatar--words"]}
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                history.push(`/u/${props.item.author._id}`);
              }}
              style={{
                background:
                  COLOR[
                    nameWords(props.item.author.name).charAt(0).charCodeAt(0) %
                      3
                  ],
              }}
            >
              {nameWords(props.item.author.name).toUpperCase()}
            </div>
          )}
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
              <small>{moment(props.item.createAt).from(now)}</small>
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

export default PostCard;
