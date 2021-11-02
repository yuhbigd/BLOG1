import { useEffect, useRef } from "react";

export default (callback, dependencies) => {
  const isFirstTime = useRef(true);
  useEffect(() => {
    if (isFirstTime) {
      isFirstTime.current = false;
      return;
    }
    callback();
  }, [dependencies]);
};
// use(()=>{},[]) this will not run when app first time render