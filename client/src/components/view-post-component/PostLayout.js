import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { useMountedState, useUpdateEffect } from "react-use";
import { getSinglePost } from "../../api/postArticleApi";
import useHttp from "../../custom-hooks/use-http";
import parse from "html-react-parser";
import classes from "./PostLayout.module.css";
import moment from "moment";
function PostLayout(props) {
  const isMount = useMountedState();
  const params = useParams();
  const history = useHistory();
  const [content, setContent] = useState(null);
  const {
    sendRequest: getPostFromServer,
    status: getPostStatus,
    data: PostFromServer,
    error: postError,
  } = useHttp(getSinglePost);
  useEffect(() => {
    getPostFromServer(params.slugUrl);
  }, []);
  useUpdateEffect(() => {
    if (getPostStatus === "completed" && !postError) {
      if (isMount()) {
        const mainContent = parse(PostFromServer.article.contentHtml);
        const content = (
          <>
            <img
              src={PostFromServer.article.thumbnailImage}
              className={classes.thumbnailImage}
            ></img>
            <h1 className={classes.title}>{PostFromServer.article.title}</h1>
            <div className={"my-editor ProseMirror"}>{mainContent}</div>
            <div>
              <p>
                Created by:{" "}
                {
                  <a href={`/u/${PostFromServer.article.author._id}`}>
                    {PostFromServer.article.author.name}
                  </a>
                }
              </p>
              <small>
                At{" "}
                {moment(PostFromServer.article.createAt).format(
                  "hh:mm DD/MM/YYYY",
                )}
              </small>
            </div>
          </>
        );
        setContent(content);
      }
    } else if (postError) {
      history.push("/");
    }
  }, [PostFromServer, getPostStatus, postError]);
  return <div>{content}</div>;
}

export default PostLayout;
