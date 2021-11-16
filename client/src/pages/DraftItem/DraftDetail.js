import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router";
import { useMountedState, useUpdateEffect } from "react-use";
import { getSingleDraft } from "../../api/draftsApi";
import useHttp from "../../custom-hooks/use-http";
import CreatePost from "../createPostPages/CreatePost";

function DraftDetail(props) {
  const history = useHistory();
  const isMount = useMountedState();
  const [component, setComponent] = useState(null);
  const params = useParams();
  const {
    sendRequest: getDraftFromServer,
    status: getDraftStatus,
    data: DraftFromServer,
    error: DraftError,
  } = useHttp(getSingleDraft);
  useEffect(() => {
    getDraftFromServer(params.draftId);
  }, []);
  useUpdateEffect(() => {
    if (getDraftStatus === "completed" && !DraftError) {
      if (isMount()) {
        setComponent(
          <CreatePost
            draft={DraftFromServer.data}
            id={params.draftId}
          ></CreatePost>,
        );
      }
    } else if (DraftError) {
      history.push("/");
    }
  }, [DraftFromServer, getDraftStatus, DraftError]);
  return <div>{component}</div>;
}

export default DraftDetail;
