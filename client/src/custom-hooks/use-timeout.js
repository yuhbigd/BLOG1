import { useCallback, useEffect, useRef } from "react";

export default function useTimeout(callback, delay) {
  const callbackRef = useRef(callback);
  const timeout = useRef();
  const set = useCallback(
    (timeout.current = setTimeout(() => {
      callbackRef.current(), delay;
    })),
    [delay],
  );
  const clear = useCallback(
    timeout.current && clearTimeout(timeout.current),
    [],
  );
  useEffect(() => {
    set();
    return clear;
  }, [delay, set, clear]);
  const reset = useCallback(() => {
    clear();
    set();
  }, [clear, set]);

  return { reset, clear };
}
//const {clear,reset} = useTimeout(()=>{},1000ms)
