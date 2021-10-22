import React, { forwardRef, useImperativeHandle, useRef } from "react";
import Modal from "../sub-components/Modal";
import classes from "./ChangePassword.module.css";
function ChangePassword(props, ref) {
  const passwordRef = useRef("");
  const newPasswordRef = useRef("");
  const reNewPasswordRef = useRef("");
  useImperativeHandle(ref, () => {
    return {
      get password() {
        return passwordRef.current;
      },
      get newPassword() {
        return newPasswordRef.current;
      },
      get reNewPassword() {
        return reNewPasswordRef.current;
      },
    };
  });
  return (
    <Modal clickHandle={props.clickHandle}>
      <form style={{ marginTop: "15px" }}>
        <div className={[classes["input-div"]]}>
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            name="password"
            id="password"
            ref={passwordRef}
          />
        </div>
        <div className={[classes["input-div"]]}>
          <label htmlFor="newPassword">New password: </label>
          <input
            type="password"
            name="newPassword"
            id="newPassword"
            ref={newPasswordRef}
          />
        </div>
        <div className={[classes["input-div"]]}>
          <label htmlFor="password">Confirm new password: </label>
          <input
            type="password"
            name="reNewPassword"
            id="reNewPassword"
            ref={reNewPasswordRef}
          />
        </div>
      </form>
      <div className={[classes["button-div"]]}>
        <button onClick={props.onSave}>Save</button>
        <button onClick={props.clickHandle}>Cancel</button>
      </div>
    </Modal>
  );
}

export default forwardRef(ChangePassword);
