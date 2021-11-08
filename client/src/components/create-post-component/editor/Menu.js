import React from "react";
import useMediaQuery from "../../../custom-hooks/use-media-query";
import classes from "./Menu.module.css";
import MenuBar from "./MenuBar";
import MenuBar_mb from "./MenuBar_mb";
function Menu(props) {
  const isPageWide = useMediaQuery("(max-width: 600px)");
  return (
    <div className={classes["menu-container"]}>
      {!isPageWide && (
        <MenuBar
          editor={props.editor}
          sendImageRequest={props.sendImageRequest}
        ></MenuBar>
      )}
      {isPageWide && (
        <MenuBar_mb
          editor={props.editor}
          sendImageRequest={props.sendImageRequest}
        ></MenuBar_mb>
      )}
    </div>
  );
}

export default Menu;
