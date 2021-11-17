import { NavLink } from "react-router-dom";
import logo from "./logo192.png";
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
import MpSubmenu from "../navigator-components/MpSubmenu";
export default (props) => {
  const history = useHistory();
  const isPageWide = useMediaQuery("(max-width: 600px)");
  const [navClassName, setNavClassName] = useState(classes.nav);
  const [MpSubMenu, setMpSubMenu] = useState(false);
  function hideMpSubMenu() {
    if (!isPageWide) {
      setMpSubMenu(false);
    }
  }
  function showMpSubMenu() {
    if (!isPageWide) {
      setMpSubMenu(true);
    }
  }
  const hideNavInSmallScreen = (event) => {
    if (isPageWide) {
      setNavClassName(classes.nav + " " + classes.hide);
    }
  };
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
        <img src={logo} alt="Logo" />
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
          {_.isEmpty(reduxContext) && (
            <>
              <li className={classes["main-navigator--item"]}>
                <NavLink
                  to="/login"
                  activeClassName={classes.active}
                  onClick={hideNavInSmallScreen}
                >
                  Login
                </NavLink>
                <div className={classes["bottom-line"]}></div>
              </li>
              <li className={classes["main-navigator--item"]}>
                <NavLink
                  to="/signup"
                  className={classes.signup}
                  onClick={hideNavInSmallScreen}
                >
                  Signup
                </NavLink>
              </li>
            </>
          )}
          {!_.isEmpty(reduxContext) && (
            <>
              <li
                className={classes["main-navigator--item"]}
                onMouseEnter={showMpSubMenu}
                onMouseLeave={hideMpSubMenu}
              >
                <NavLink
                  to="/create"
                  activeClassName={classes.active}
                  onClick={(event) => {
                    event.preventDefault();
                    setMpSubMenu(!MpSubMenu);
                  }}
                >
                  My stuffs
                </NavLink>
                <div className={classes["bottom-line"]}></div>
                {!isPageWide && (
                  <MpSubmenu
                    isShow={MpSubMenu}
                    isPageWide={isPageWide}
                    onClick={hideNavInSmallScreen}
                  ></MpSubmenu>
                )}
              </li>
              {isPageWide && (
                <MpSubmenu
                  isShow={MpSubMenu}
                  isPageWide={isPageWide}
                  onClick={hideNavInSmallScreen}
                ></MpSubmenu>
              )}

              {isPageWide && (
                <DropDownMenu
                  isPageWide={true}
                  className={classes["main-navigator--item"]}
                  bottomLineClass={classes["bottom-line"]}
                  onClick={hideNavInSmallScreen}
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
                <Avatar></Avatar>
                {!isPageWide && (
                  <DropDownMenu
                    isPageWide={false}
                    showDrop={showDropDownMenu}
                    onClick={hideNavInSmallScreen}
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
