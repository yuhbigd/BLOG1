import React from "react";
import { MdOutlineSettings } from "react-icons/md";
import { FaSignOutAlt } from "react-icons/fa";
import classes from "./DropDownMenu.module.css";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";
function DropDownMenu(props) {
  const history = useHistory();
  //send a logout request to server
  async function logOutHandle(event) {
    await fetch(`${process.env.REACT_APP_BASE_URL}/logout`, {
      credentials: "include", //enable set cookies
    });
    window.location.href = "/";
  }
  function settingHandle(event) {
    history.push("/account");
  }
  if (!props.isPageWide) {
    const showDrop = props.showDrop;
    const dropClass =
      showDrop == ""
        ? classes["dropdown-list"]
        : classes["dropdown-list"] + " " + classes["show"];

    return (
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
    );
  } else {
    return (
      <>
        <li className={props.className} onClick={settingHandle}>
          <NavLink to="/account">Setting</NavLink>
          <MdOutlineSettings style={{ color: "#fff" }}></MdOutlineSettings>
          <div className={props.bottomLineClass}></div>
        </li>
        <li className={props.className} onClick={logOutHandle}>
          <NavLink to="/">Logout</NavLink>
          <FaSignOutAlt style={{ color: "#fff" }}></FaSignOutAlt>
          <div className={props.bottomLineClass}></div>
        </li>
      </>
    );
  }
}

export default DropDownMenu;
