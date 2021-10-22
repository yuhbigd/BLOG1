import classes from "./Spinner.module.css";
import reactDOM from "react-dom";

export default function Spinner(props) {
  const getModalDomElement = document.querySelector("#modal");

  return reactDOM.createPortal(
    <div className={classes["lds-ring"]}>
      <div></div>
      <div></div>
      <div></div>
    </div>,
    getModalDomElement,
  );
}
