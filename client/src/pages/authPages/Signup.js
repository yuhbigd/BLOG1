import React, { useEffect, useRef, useState } from "react";
import classes from "./Signup.module.css";
import isEmail from "validator/lib/isEmail";
import useHttp from "../../custom-hooks/use-http";
import { signup } from "../../api/authApi";
import Spinner from "../../components/sub-components/Spinner";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { addUser } from "../../state/actionCreator/userActions";

// update redux
// show dialog signup update redux update navbar ...

function Signup(props) {
  const history = useHistory();
  const email = useRef("");
  const password = useRef("");
  const name = useRef("");
  const [error, setError] = useState("");
  const { sendRequest, status, data, error: fetchError } = useHttp(signup);
  const dispatch = useDispatch();
  const addUserHandler = bindActionCreators(addUser, dispatch);

  async function submitHandle(event) {
    event.preventDefault();
    const emailValue = email.current.value;
    const passwordValue = password.current.value;

    const checkEmail = isEmail(emailValue);
    if (!checkEmail) {
      setError("Your email is in incorrect format");
      return;
    }
    const tokenCaptcha = await window.getReCaptchaToken;
    await sendRequest({
      email: email.current.value,
      password: passwordValue,
      name: name.current.value,
      tokenCaptcha,
    });
  }

  useEffect(() => {
    if (fetchError != null) {
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
      <div className={classes.signup}>
        <div>
          <h1 className={classes["signup--heading"]}>Signup</h1>
        </div>

        {error != "" && (
          <div className={classes["form--error-div"]}>{error}</div>
        )}

        <form
          action="#"
          className={classes["signup-form"]}
          onSubmit={submitHandle}
        >
          <label htmlFor="email" className={classes["form--label"]}>
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className={classes["form--input"]}
            placeholder="Eg: Email@example.com"
            ref={email}
          />
          <label htmlFor="password" className={classes["form--label"]}>
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className={classes["form--input"]}
            placeholder="password"
            ref={password}
          />
          <label htmlFor="name" className={classes["form--label"]}>
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className={classes["form--input"]}
            placeholder="Your full name"
            ref={name}
          />
          <button className={classes["signup--submit"]}>Signup</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
