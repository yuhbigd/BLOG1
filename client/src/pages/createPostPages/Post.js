import React from "react";
import ImageDropzone from "../../components/create-post-component/ImageDropzone";
import Editor from "../../components/create-post-component/editor/Editor";

function Post() {
  return (
    <div>
      <label htmlFor="title">title</label>
      <input type="text" name="title" id="title" placeholder="TITLE" />
      <ImageDropzone></ImageDropzone>
      <Editor></Editor>
    </div>
  );
}

export default Post;
