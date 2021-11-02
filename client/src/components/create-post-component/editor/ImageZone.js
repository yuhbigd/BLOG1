import React, { useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import classes from "./ImageZone.module.css";
import _ from "lodash";
import ErrorComponent from "../../sub-components/ErrorComponent";
import Modal from "../../sub-components/Modal";
function ImageZone(props) {
  const imageInput = useRef("");
  const [preview, setPreview] = useState(null);
  const [errorState, setErrorState] = useState(null);
  const { fileRejections, open, getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    maxSize: 5242880,
    onDrop: handleDrop,
  });
  // function to handle file which is dropped into zone
  function handleDrop(file, fileRejections) {
    if (!_.isEmpty(file)) {
      let imageSrc = URL.createObjectURL(file[0]);
      setPreview({
        html: <p className={classes["title-image"]}>{file[0].path}</p>,
        src: imageSrc,
      });
    }
    //handle if file is not valid
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

  const handleSaveClick = (event) => {
    if (!!preview) {
      props.editor.chain().focus().setImage({ src: preview.src }).run();
    }
    if (imageInput.current.value) {
      props.editor
        .chain()
        .focus()
        .setImage({ src: imageInput.current.value })
        .run();
    }
    props.onClick();
  };

  const handleCancelClick = (event) => {
    props.onClick();
  };
  return (
    <section className="container" style={{ marginBottom: "3em" }}>
      <div>
        <input
          type="text"
          name="link"
          id="image"
          ref={imageInput}
          placeholder={"Get image from URL"}
        />
        <button onClick={handleSaveClick}>Save</button>
      </div>
      <div {...getRootProps({ className: classes["dropzone"] })}>
        <input {...getInputProps()} />
        {!preview && (
          <p>
            Or drag 'n' drop some local files here, or click to select local
            files
          </p>
        )}
        {!!preview && preview.html}
      </div>
      <button onClick={handleCancelClick}>save</button>
      {errorState}
    </section>
  );
}

export default ImageZone;
