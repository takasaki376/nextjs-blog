import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export const Modal = (props) => {
  const ref = useRef();
  const [mounted, setMounted] = useState(false);

  if (!props.open) {
    return null;
  }
  useEffect(() => {
    ref.current = document.querySelector("#modal");
    setMounted(true);
  }, []);

  return mounted ? createPortal(props.children, ref.current) : null;
};
