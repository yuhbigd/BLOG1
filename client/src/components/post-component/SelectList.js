import React, { useState } from "react";
import classes from "./SelectList.module.css";
import {
  FaSortAmountDown,
  FaSortAmountDownAlt,
  FaAngleDown,
} from "react-icons/fa";
import { CSSTransition } from "react-transition-group";
function SelectList(props) {
  const [isShow, setIsShow] = useState(false);
  const [label, setLabel] = useState(props.label[0]);
  let list;
  if (props.icon === true) {
    list = (
      <ul className={classes["ul_list"]}>
        {props.label.map((label, index) => {
          let icon;
          if (label === "Desc") {
            icon = <FaSortAmountDown />;
          } else {
            icon = <FaSortAmountDownAlt />;
          }
          return (
            <li
              key={label}
              onClick={() => {
                setLabel(label);
                setIsShow(!isShow);
                props.onChange(props.value[index]);
              }}
            >
              {label} {icon}
            </li>
          );
        })}
      </ul>
    );
  } else {
    list = (
      <ul className={classes["ul_list"]}>
        {props.label.map((label, index) => {
          return (
            <li
              key={(label)}
              onClick={() => {
                setLabel(label);
                setIsShow(!isShow);
                props.onChange(props.value[index]);
              }}
            >
              {label}
            </li>
          );
        })}
      </ul>
    );
  }
  return (
    <div className={classes.container} title={props.title}>
      <div
        className={classes.title}
        onClick={() => {
          setIsShow(!isShow);
        }}
      >
        {props.label[0] === "Newest" ? "Sort by: " + label : label}
        <FaAngleDown />
      </div>
      <CSSTransition
        in={isShow}
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
        {list}
      </CSSTransition>
    </div>
  );
}

export default SelectList;
