import { useReducer, useCallback } from "react";
import { useMountedState } from "react-use";
function httpReducer(state, action) {
  if (action.type === "SEND") {
    return {
      data: null,
      error: null,
      status: "pending",
    };
  }

  if (action.type === "SUCCESS") {
    return {
      data: action.responseData,
      error: null,
      status: "completed",
    };
  }

  if (action.type === "ERROR") {
    return {
      data: null,
      error: action.errorMessage,
      status: "completed",
    };
  }

  return state;
}

function useHttp(requestFunction, startWithPending = false) {
  const isMounted = useMountedState();
  const [httpState, dispatch] = useReducer(httpReducer, {
    status: startWithPending ? "pending" : null,
    data: null,
    error: null,
  });
  const sendRequest = useCallback(
    async function (requestData) {
      dispatch({ type: "SEND" });
      try {
        const responseData = await requestFunction(requestData);
        if (isMounted()) {
          dispatch({ type: "SUCCESS", responseData });
        }
      } catch (error) {
        if (isMounted()) {
          dispatch({
            type: "ERROR",
            errorMessage: {
              message: error.message || "Something went wrong!",
              statusCode: error.statusCode,
            },
          });
        }
      }
    },
    [requestFunction],
  );
  return {
    sendRequest,
    ...httpState,
  };
}

export default useHttp;
