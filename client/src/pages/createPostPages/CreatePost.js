import React, { useRef } from "react";
// import ImageDropzone from "../../components/create-post-component/editor/ImageDropzone";
import Editor from "../../components/create-post-component/editor/Editor";
import classes from "./CreatePost.module.css";
function CreatePost() {
  const titleRef = useRef();
  return (
    <div className={classes.container}>
      <textarea
        placeholder="Post title!"
        className={classes.title}
        rows="1"
        ref={titleRef}
        onInput={(event) => {
          titleRef.current.style.height = "auto";
          titleRef.current.style.height = titleRef.current.scrollHeight + "px";
          if (titleRef.current.value.length > 150) {
            titleRef.current.value = titleRef.current.value.substring(0, 151);
          }
        }}
      ></textarea>
      {/* <ImageDropzone></ImageDropzone> */}
      <Editor></Editor>
    </div>
  );
}

export default CreatePost;
