import React from "react";
import classes from "./CommentBox.module.css";
import moment from "moment";
import { useHistory } from "react-router";
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
function CommentBox(props) {
  const history = useHistory();
  return (
    <div className={classes.container}>
      <div className={classes["avatar-container"]}>
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
                  nameWords(props.item.author.name).charAt(0).charCodeAt(0) % 3
                ],
            }}
          >
            {nameWords(props.item.author.name).toUpperCase()}
          </div>
        )}
      </div>
      <div className={classes["text-container"]}>
        <h5>{props.item.author.name}</h5>
        <p>{props.item.text}</p>
        <small>{moment(props.item.createAt).format("hh:mm DD/MM/YYYY")}</small>
      </div>
    </div>
  );
}

export default CommentBox;
