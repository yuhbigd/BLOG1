import React, { useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import classes from "./ImageDropzone.module.css";
import _ from "lodash";
import Modal from "../sub-components/Modal";
import ErrorComponent from "../sub-components/ErrorComponent";
function ImageDropzone() {
  const imageInput = useRef("");
  const [preview, setPreview] = useState(null);
  const [errorState, setErrorState] = useState(null);
  const { fileRejections, open, getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    maxSize: 5242880,
    onDrop: handleDrop,
  });
  // function to handle file which is dropped into zone
  function handleDrop(file,fileRejections) {
    if (!_.isEmpty(file)) {
      let imageSrc = URL.createObjectURL(file[0]);
      setPreview({
        html: <img className={classes["title-image"]} src={imageSrc}></img>,
        src: imageSrc,
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

  return (
    <section className="container" style={{ marginBottom: "3em" }}>
      <div>
        <input type="text" name="link" id="image" ref={imageInput} />
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
          }}
        >
          Save
        </button>
      </div>
      <div {...getRootProps({ className: classes["dropzone"] })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
        {!!preview && preview.html}
      </div>
      {errorState}
    </section>
  );
}

export default ImageDropzone;
