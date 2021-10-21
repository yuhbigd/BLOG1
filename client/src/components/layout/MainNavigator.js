import { NavLink } from "react-router-dom";
import useMediaQuery from "../../custom-hooks/use-media-query";
import classes from "./MainNavigator.module.css";
import { FaBars, FaTimes } from "react-icons/fa";
import { useEffect } from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import _ from "lodash";
import Avatar from "../navigator-components/Avatar";
import DropDownMenu from "../navigator-components/DropDownMenu";
export default (props) => {
  const history = useHistory();
  const isPageWide = useMediaQuery("(max-width: 600px)");
  const [navClassName, setNavClassName] = useState(classes.nav);
  const reduxContext = useSelector((state) => {
    return state.user;
  });

  const [showDropDownMenu, setShowDropDownMenu] = useState("");
  function showDrop(event) {
    setShowDropDownMenu("show");
  }
  function hideDrop(event) {
    setShowDropDownMenu("");
  }

  useEffect(() => {
    if (isPageWide) {
      setNavClassName((pre) => {
        return pre + " " + classes.hideNav;
      });
    } else if (!isPageWide) {
      setNavClassName(classes.nav);
    }
  }, [isPageWide]);

  function barIconClickHandle(event) {
    event.preventDefault();
    setNavClassName(classes.nav + " " + classes.open);
  }

  function timesIconClickHandle(event) {
    event.preventDefault();
    setNavClassName(classes.nav + " " + classes.hide);
  }

  function logoClickHandle(event) {
    history.push(`/`);
  }

  return (
    <header className={classes.header}>
      <div className={classes.logo} onClick={logoClickHandle}>
        <img src="./logo192.png" alt="Logo" />
      </div>
      {isPageWide && (
        <div>
          <FaBars
            className={classes["bar-icon"]}
            onClick={barIconClickHandle}
          ></FaBars>
        </div>
      )}
      <nav className={navClassName}>
        {isPageWide && (
          <FaTimes
            className={classes.timesIcon}
            onClick={timesIconClickHandle}
          ></FaTimes>
        )}
        <ul className={classes["main-navigator"]}>
          <li className={classes["main-navigator--item"]}>
            <NavLink
              to="/images"
              activeClassName={classes.active}
              onClick={(event) => {
                if (isPageWide) {
                  setNavClassName(classes.nav + " " + classes.hide);
                }
              }}
            >
              Discover
            </NavLink>
            <div className={classes["bottom-line"]}></div>
          </li>
          {_.isEmpty(reduxContext) && (
            <>
              <li className={classes["main-navigator--item"]}>
                <NavLink
                  to="/login"
                  activeClassName={classes.active}
                  onClick={(event) => {
                    if (isPageWide) {
                      setNavClassName(classes.nav + " " + classes.hide);
                    }
                  }}
                >
                  Login
                </NavLink>
                <div className={classes["bottom-line"]}></div>
              </li>
              <li className={classes["main-navigator--item"]}>
                <NavLink
                  to="/signup"
                  className={classes.signup}
                  onClick={(event) => {
                    if (isPageWide) {
                      setNavClassName(classes.nav + " " + classes.hide);
                    }
                  }}
                >
                  Signup
                </NavLink>
              </li>
            </>
          )}
          {!_.isEmpty(reduxContext) && (
            <>
              {isPageWide && (
                <DropDownMenu
                  isPageWide={true}
                  className={classes["main-navigator--item"]}
                  bottomLineClass={classes["bottom-line"]}
                ></DropDownMenu>
              )}
              <li
                className={
                  classes.avatar + " " + classes["main-navigator--item"]
                }
                onMouseEnter={showDrop}
                onMouseLeave={hideDrop}
                style={
                  reduxContext.avatar == ""
                    ? {
                        paddingLeft: "25px",
                        paddingRight: "25px",
                      }
                    : {}
                }
              >
                <Avatar
                  name={reduxContext.name}
                  avatarLink={reduxContext.avatar}
                ></Avatar>
                {!isPageWide && (
                  <DropDownMenu
                    isPageWide={false}
                    showDrop={showDropDownMenu}
                  ></DropDownMenu>
                )}
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};
