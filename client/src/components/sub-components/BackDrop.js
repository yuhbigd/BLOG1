import styles from "./Modal.module.css";
import reactDOM from "react-dom";
function BackDrop(props) {
  const getModalDomElement = document.querySelector("#modal");
  return (
    <>
      {reactDOM.createPortal(
        <div className={styles.backdrop} onClick={props.onHideCart}></div>,
        getModalDomElement,
      )}
    </>
  );
}

export default BackDrop;
