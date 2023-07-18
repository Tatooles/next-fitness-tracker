import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function Modal({
  children,
  isOpen,
  handleClose,
}: {
  children: any;
  isOpen: boolean;
  handleClose: () => void;
}) {
  useEffect(() => {
    // Prevent background scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // This is where we will use a portal
  // Return two divs within that portal, the actual modal with the children inside, and the background 1/2 opacity div
  return createPortal(
    <>
      <div
        onClick={handleClose}
        className="fixed top-0 left-0 bottom-0 right-0 z-10 bg-slate-700 bg-opacity-50"
      ></div>
      {children}
    </>,
    document.getElementById("modal")!
  );
}
