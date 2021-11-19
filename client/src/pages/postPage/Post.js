import React, { useEffect } from "react";
import { useParams } from "react-router";
import PostLayout from "../../components/view-post-component/PostLayout";
import CommentSection from "../../components/view-post-component/CommentSection";
import classes from "./Post.module.css";
function Post() {
  const params = useParams();
  return (
    <div className={classes.container}>
      <PostLayout />
      <CommentSection slug={params.slugUrl} />
    </div>
  );
}

export default Post;
