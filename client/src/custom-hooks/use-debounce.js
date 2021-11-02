import { useEffect } from "react";
import useTimeOut from "./use-timeout";
export default function useDebounce(callback, delay, dependencies) {
  const { reset, clear } = useTimeOut(callback, delay);
  useEffect(() => {
    reset();
    return () => {
      clear();
    };
  }, [...dependencies, reset, clear]);
  useEffect(() => {
    clear();
  }, []);
}
// useDebounce(()=>{},1000ms,[dependencies(usually state)])