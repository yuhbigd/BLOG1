import React, { useState } from "react";
import { useHistory } from "react-router";
import classes from "./MpSubmenu.module.css";
import { CSSTransition } from "react-transition-group";

function MpSubmenu(props) {
  const history = useHistory();
  const [className, setClassName] = useState("");
  const handleClick = (source) => {
    history.push(source);
  };
  if (!props.isPageWide) {
    return (
      <CSSTransition
        in={props.isShow}
        timeout={300}
        unmountOnExit
        mountOnEnter
        classNames={{
          enter: classes.MyClassEnter,
          enterActive: classes.MyClassEnterActive,
          enterDone: classes.MyClassEnterDone,
          exit: classes.MyClassEnterDone,
          exitActive: classes.MyClassExitActive,
          exitDone: classes.MyClassExit,
        }}
      >
        <ul className={classes.list}>
          <li
            className={classes["dropdown__item"]}
            onClick={() => {
              handleClick("/create");
            }}
          >
            Create new
          </li>
          <li
            className={classes["dropdown__item"]}
            onClick={() => {
              handleClick("/drafts");
            }}
          >
            My drafts
          </li>
          <li
            className={classes["dropdown__item"]}
            onClick={() => {
              handleClick("/u/posts");
            }}
          >
            My posts
          </li>
        </ul>
      </CSSTransition>
    );
  } else {
    return (
      <CSSTransition
        in={props.isShow}
        timeout={300}
        unmountOnExit
        mountOnEnter
        classNames={{
          enter: classes.MyClassEnter,
          enterActive: classes.MyClassEnterActive,
          enterDone: classes.MyClassEnterDone,
          exit: classes.MyClassEnterDone,
          exitActive: classes.MyClassExitActive,
          exitDone: classes.MyClassExit,
        }}
        onEnter={() => {
          setClassName(classes.show);
        }}
      >
        <ul className={classes.list + " " + className}>
          <li
            className={classes["dropdown__item"]}
            onClick={() => {
              handleClick("/create");
              props.onClick();
            }}
          >
            Create new
          </li>
          <li
            className={classes["dropdown__item"]}
            onClick={() => {
              handleClick("/drafts");
              props.onClick();
            }}
          >
            My drafts
          </li>
          <li
            className={classes["dropdown__item"]}
            onClick={() => {
              handleClick("/u/posts");
              props.onClick();
            }}
          >
            My posts
          </li>
        </ul>
      </CSSTransition>
    );
  }
}

export default MpSubmenu;
