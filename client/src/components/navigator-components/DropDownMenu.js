import React from "react";
import { MdOutlineSettings } from "react-icons/md";
import { FaSignOutAlt } from "react-icons/fa";
import classes from "./DropDownMenu.module.css";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
function DropDownMenu(props) {
  const history = useHistory();
  //send a logout request to server
  async function logOutHandle(event) {
    await fetch(`${process.env.REACT_APP_BASE_URL}/logout`, {
      credentials: "include", //enable set cookies
    });
    window.location.href = "/";
  }
  function settingHandle() {
    history.push("/account");
  }
  if (!props.isPageWide) {
    const showDrop = props.showDrop;
    const dropClass =
      showDrop == ""
        ? classes["dropdown-list"]
        : classes["dropdown-list"] + " " + classes["show"];

    return (
      <CSSTransition
        in={props.showDrop !== ""}
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
        <ul className={dropClass}>
          <li className={classes["dropdown__item"]} onClick={settingHandle}>
            <MdOutlineSettings></MdOutlineSettings>
            <span className="dropdown__text">Setting</span>
          </li>
          <li className={classes["dropdown__item"]} onClick={logOutHandle}>
            <FaSignOutAlt></FaSignOutAlt>
            <span className="dropdown__text">Logout</span>
          </li>
        </ul>
      </CSSTransition>
    );
  } else {
    return (
      <>
        <li className={props.className} onMouseUp={props.onClick}>
          <NavLink to="/account">Setting</NavLink>
          <MdOutlineSettings
            style={{ color: "#fff" }}
            className={classes.icon}
          ></MdOutlineSettings>
          <div className={props.bottomLineClass}></div>
        </li>
        <li className={props.className} onClick={logOutHandle}>
          <NavLink to="/">Logout</NavLink>
          <FaSignOutAlt
            style={{ color: "#fff" }}
            className={classes.icon}
          ></FaSignOutAlt>
          <div className={props.bottomLineClass}></div>
        </li>
      </>
    );
  }
}

export default DropDownMenu;
