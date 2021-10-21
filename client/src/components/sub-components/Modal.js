import styles from "./Modal.module.css";
import React, { useEffect, useRef, useState } from "react";
import reactDOM from "react-dom";
import BackDrop from "./BackDrop";
import useMediaQuery from "../../custom-hooks/use-media-query";
// chinh lai de luon can giua khi thay doi
const ModalContent = (props) => {
  const isPageWidth = useMediaQuery("(max-width: 600px)");
  const wH = useRef("");
  const [size, setSize] = useState(null);
  useEffect(() => {
    setSize({
      height: wH.current.clientHeight,
      width: wH.current.clientWidth,
    });
  }, [isPageWidth]);
  return (
    <div
      className={styles.modal}
      ref={wH}
    >
      {props.children}
    </div>
  );
};
const getModalDomElement = document.querySelector("#modal");
const Modal = (props) => {
  return (
    <>
      <BackDrop onHideCart={props.clickHandle}></BackDrop>
      {reactDOM.createPortal(
        <ModalContent>{props.children}</ModalContent>,
        getModalDomElement,
      )}
    </>
  );
};
export default Modal;
