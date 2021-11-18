import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router";

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}
function Post() {
  const params = useParams();
  // console.log(params.slugUrl);
  return <div></div>;
}

export default Post;
