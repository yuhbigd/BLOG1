import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useMountedState, useUpdateEffect } from "react-use";
import { getSingleDraft } from "../../api/draftsApi";
import useHttp from "../../custom-hooks/use-http";
import CreatePost from "../createPostPages/CreatePost";

function DraftDetail(props) {
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
    }
  }, [DraftFromServer, getDraftStatus, DraftError]);
  return <div>{component}</div>;
}

export default DraftDetail;
