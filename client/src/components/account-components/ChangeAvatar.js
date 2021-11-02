import React, { useEffect } from "react";
import Modal from "../sub-components/Modal";
import { useState } from "react";
import AvatarEditor from "react-avatar-editor";
import classes from "./ChangeAvatar.module.css";
import { useDropzone } from "react-dropzone";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import ErrorComponent from "../sub-components/ErrorComponent";
import _ from "lodash";
import { sendAvatar } from "../../api/modifyAccountApi";
import Spinner from "../sub-components/Spinner";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addUser } from "../../state/actionCreator/userActions";
import useHttp from "../../custom-hooks/use-http";
import { bindActionCreators } from "redux";
function ChangeAvatar(props) {
  const [errorState, setErrorState] = useState(null);
  const [image, setImage] = useState(null);
  const { sendRequest, status, data, error: fetchError } = useHttp(sendAvatar);
  const [preview, setPreview] = useState(
    <div className={classes.preview}></div>,
  );
  const [isAvatarChangeShowed, setIsAvatarChangeShowed] = useState("");
  const [rotate, setRotate] = useState(0);
  const [scaleNumber, setScaleNumber] = useState(1);
  //avatar editor component ref

  let editor;
  function getAvatarEditor(e) {
    editor = e;
  }

  //user in redux

  const reduxContext = useSelector((state) => {
    return state.user;
  });
  const dispatch = useDispatch();
  const addUserHandler = bindActionCreators(addUser, dispatch);

  // dropzone hook initialization

  const { fileRejections, open, getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    maxSize: 5242880,
    onDrop: handleDrop,
  });

  // function to handle file which is dropped into zone
  function handleDrop(file, fileRejections) {
    if (!_.isEmpty(file)) {
      let img = URL.createObjectURL(file[0]);
      setImage(img);
      if (!isAvatarChangeShowed) {
        setIsAvatarChangeShowed(classes.show);
      }
    }
    //handle if file is an error
    else if (!!fileRejections) {
      let message = fileRejections[0].errors[0].code;
      message = message.concat([" ", fileRejections[0].errors[0].message]);
      setErrorState(
        <Modal
          clickHandle={() => {
            setErrorState(null);
          }}
        >
          <ErrorComponent
            clickHandle={() => {
              setErrorState(null);
            }}
            message={message}
          ></ErrorComponent>
        </Modal>,
      );
    }
  }

  // declare preview function when button was clicked
  function previewImageHandle(event) {
    event.preventDefault();
    if (image == null) {
      setErrorState(
        <Modal
          clickHandle={() => {
            setErrorState(null);
          }}
        >
          <ErrorComponent
            clickHandle={() => {
              setErrorState(null);
            }}
            message={"You haven't inserted any image yet"}
          ></ErrorComponent>
        </Modal>,
      );
    } else {
      let url = editor.getImageScaledToCanvas().toDataURL();
      setPreview(<img src={url}></img>);
    }
  }

  // rotating image
  function rotateLeft(event) {
    event.preventDefault();
    setRotate((pre) => {
      if (pre == -270) {
        return 0;
      } else {
        return pre - 90;
      }
    });
  }
  function rotateRight(event) {
    event.preventDefault();
    setRotate((pre) => {
      if (pre == 270) {
        return 0;
      } else {
        return pre + 90;
      }
    });
  }

  // scale event handler
  function scaleHandle(event) {
    const value = event.target.value;
    setScaleNumber(value);
  }
  //onclick handler for upload button
  const uploadClickHandle = (event) => {
    open();
  };

  //function for saving handle

  function onSave(event) {
    event.preventDefault();
    // bas64 avatar
    let url = editor.getImageScaledToCanvas().toDataURL();
    sendRequest(url);
  }

  // handle status

  useEffect(() => {
    if (fetchError != null) {
      setErrorState(
        <Modal
          clickHandle={() => {
            setErrorState(null);
          }}
        >
          <ErrorComponent
            clickHandle={() => {
              setErrorState(null);
            }}
            message={`${fetchError.error} - ${fetchError.status}`}
          ></ErrorComponent>
        </Modal>,
      );
    }
    if (data != null && status == "completed") {
      addUserHandler({ ...reduxContext, avatar: data.link });
      props.clickHandle();
    }
  }, [status, data, fetchError]);

  return (
    <Modal clickHandle={props.clickHandle}>
      <button className={classes.btn} onClick={uploadClickHandle}>
        {!isAvatarChangeShowed ? "Upload a picture" : "Change picture"}
      </button>
      <div className={classes["container"] + " " + isAvatarChangeShowed}>
        <div className="change-avatar-section">
          <div {...getRootProps()} className={classes.dropzone}>
            <AvatarEditor
              ref={getAvatarEditor}
              image={image}
              color={[0, 0, 0, 0.3]} // RGBA
              scale={parseFloat(scaleNumber)}
              rotate={rotate}
              borderRadius={5000}
              className={classes.editorCanvas}
              onClick={(event) => {
                event.stopPropagation();
              }}
            />
            <input {...getInputProps()} />
          </div>
          <label htmlFor="scale">Zoom</label>
          <input
            name="scale"
            type="range"
            onChange={scaleHandle}
            min={1}
            max={2}
            step={0.01}
            defaultValue={1}
            className={classes.rangeInput}
          />
          <p>Rotate</p>
          <div className={classes.rotateBtn}>
            <button onClick={rotateLeft}>
              <FaArrowLeft></FaArrowLeft>
            </button>
            <button onClick={rotateRight}>
              <FaArrowRight></FaArrowRight>
            </button>
          </div>
        </div>
        <div className={classes["button-div"]}>
          <button onClick={onSave}>Save</button>
          <button onClick={props.clickHandle}>Cancel</button>
        </div>
      </div>
      {errorState}
      {status === "pending" && <Spinner></Spinner>}
    </Modal>
  );
}

export default ChangeAvatar;
