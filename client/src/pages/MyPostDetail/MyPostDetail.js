import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router";
import { useMountedState, useUpdateEffect } from "react-use";
import { getSinglePost } from "../../api/postArticleApi";
import DetailPost from "../../components/my-post-detail-components/DetailPost";
import useHttp from "../../custom-hooks/use-http";

function MyPostDetail(props) {
  const history = useHistory();
  const isMount = useMountedState();
  const [component, setComponent] = useState(null);
  const params = useParams();
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
        console.log(PostFromServer.article);
        setComponent(
          <DetailPost
            article={PostFromServer.article}
            slug={params.slugUrl}
          ></DetailPost>,
        );
      }
    } else if (postError) {
      history.push("/");
    }
  }, [PostFromServer, getPostStatus, postError]);
  return <div>{component}</div>;
}

export default MyPostDetail;
