import React, { useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import classes from "./ImageZone.module.css";
import _ from "lodash";
import ErrorComponent from "../../sub-components/ErrorComponent";
import Modal from "../../sub-components/Modal";

// get base 64 from image
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

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
      setPreview({
        html: <p className={classes["title-image"]}>{file[0].path}</p>,
        src: file[0],
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

  const handleSaveClick = async (event) => {
    if (imageInput.current.value !== "") {
      props.editor
        .chain()
        .focus()
        .setImage({ src: imageInput.current.value })
        .run();
    } else if (!!preview) {
      try {
        const image = await getBase64(preview.src);
        await props.sendImageRequest(image);
      } catch (error) {
        console.log(error);
      }
    }
    props.onClick();
  };

  const handleCancelClick = (event) => {
    props.onClick();
  };
  return (
    <section className="container" style={{ position: "absolute" }}>
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
