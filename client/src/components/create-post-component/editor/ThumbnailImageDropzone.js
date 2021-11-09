import React, { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import classes from "./ThumbnailImageDropzone.module.css";
import _ from "lodash";
import Modal from "../../sub-components/Modal";
import ErrorComponent from "../../sub-components/ErrorComponent";
import useHttp from "../../../custom-hooks/use-http";
import { sendImage } from "../../../api/editorApi";
import Spinner from "../../sub-components/Spinner";
const serverDomain = process.env.REACT_APP_BASE_URL;

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
function ThumbnailImageDropzone(props) {
  //function to send the image and get the image link back
  const {
    sendRequest: sendImageToServer,
    status: sendImageStatus,
    data: imageData,
    error: sendImageError,
  } = useHttp(sendImage);
  const [showDrop, setShowDrop] = useState("From url");
  const imageInput = useRef("");
  const [preview, setPreview] = useState(null);
  const [errorState, setErrorState] = useState(null);
  const { fileRejections, open, getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    maxSize: 5242880,
    onDrop: handleDrop,
  });
  // function to handle file which is dropped into zone
  async function handleDrop(file, fileRejections) {
    if (!_.isEmpty(file)) {
      let imageSrc = await getBase64(file[0]);
      sendImageToServer(imageSrc).catch((error) => {
        console.log(error);
      });
    } else if (!!fileRejections) {
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
  useEffect(() => {
    if (sendImageError != null) {
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
            message={`${sendImageError.message} - ${sendImageError.statusCode}`}
          ></ErrorComponent>
        </Modal>,
      );
    }
    if (imageData != null && sendImageStatus == "completed") {
      setPreview({
        html: (
          <img
            className={classes["title-image"]}
            src={serverDomain + imageData.link}
          ></img>
        ),
        src: imageData.link,
      });
      props.allImageRef.current.add(imageData.link);
      props.thumbnailRef.current = serverDomain + imageData.link;
      props.setShowPrompt();
    }
  }, [sendImageStatus, imageData, sendImageError]);

  return (
    <section className={classes.container}>
      {sendImageStatus === "pending" && <Spinner></Spinner>}
      <button
        onClick={() => {
          setPreview(null);
          if (showDrop === "From local") {
            props.thumbnailRef.current = "";
            setShowDrop("From url");
          } else {
            props.thumbnailRef.current = "";
            setShowDrop("From local");
          }
        }}
      >
        {showDrop}
      </button>
      {showDrop === "From local" ? (
        <div>
          <input type="text" name="link" id="image" ref={imageInput} />
        </div>
      ) : (
        <div {...getRootProps({ className: classes["dropzone"] })}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
          {!!preview && showDrop !== "From local" && preview.html}
        </div>
      )}
      {!!preview && showDrop === "From local" && preview.html}
      {showDrop === "From local" && (
        <button
          onClick={(event) => {
            setPreview({
              html: (
                <img
                  className={classes["title-image"]}
                  src={imageInput.current.value}
                ></img>
              ),
              src: imageInput.current.value,
            });
            props.thumbnailRef.current = imageInput.current.value;
          }}
        >
          Set image
        </button>
      )}
      {errorState}
    </section>
  );
}

export default ThumbnailImageDropzone;
