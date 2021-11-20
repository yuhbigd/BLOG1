import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import classes from "./Login.module.css";
import isEmail from "validator/lib/isEmail";
import useHttp from "../../custom-hooks/use-http";
import { login } from "../../api/authApi";
import Spinner from "../../components/sub-components/Spinner";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { addUser } from "../../state/actionCreator/userActions";

// update redux
// show dialog signup update redux update navbar ...

function Login(props) {
  const history = useHistory();
  const email = useRef("");
  const password = useRef("");
  const [error, setError] = useState("");
  const { sendRequest, status, data, error: fetchError } = useHttp(login);
  const reduxContext = useSelector((state) => {
    return state.showModal;
  });
  const dispatch = useDispatch();
  const addUserHandler = bindActionCreators(addUser, dispatch);

  async function submitHandle(event) {
    event.preventDefault();
    const tokenCaptcha = await window.getReCaptchaToken();
    const emailValue = email.current.value;
    const passwordValue = password.current.value.trim();

    const checkEmail = isEmail(emailValue);
    if (!checkEmail) {
      setError("Your email is incorrect format");
      return;
    }

    await sendRequest({
      email: email.current.value,
      password: passwordValue,
      tokenCaptcha,
    });
  }

  useEffect(() => {
    if (fetchError != null) {
      console.log(fetchError);
      setError(fetchError.error || fetchError.message);
    }
    if (data != null && status == "completed") {
      addUserHandler(data.user);
      history.push("/");
    }
  }, [status, data, fetchError]);

  return (
    <div className={classes.container}>
      {status === "pending" && <Spinner></Spinner>}
      <div className={classes.login}>
        <div>
          <h1 className={classes["signup-heading"]}>Log in</h1>
        </div>

        {error != "" && <div className={classes["error-div"]}>{error}</div>}

        <form
          action="#"
          className={classes["signup-form"]}
          onSubmit={submitHandle}
        >
          <label htmlFor="email" className={classes["email-label"]}>
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className={classes["email-input"]}
            placeholder="Eg: Email@example.com"
            ref={email}
          />
          <label htmlFor="password" className={classes["password-label"]}>
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className={classes["password-input"]}
            placeholder="password"
            ref={password}
          />
          <button className={classes["signup-submit"]}>Log in</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
