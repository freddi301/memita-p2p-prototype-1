import React from "react";
import ReactDOM from "react-dom";

type TransitionateProps = {
  enterFrom: "left" | "right";
  children: React.ReactNode;
};
export function Transitionate({ children, enterFrom }: TransitionateProps) {
  const duration = 0.3;
  const [queue, setQueue] = React.useState<Array<React.ReactPortal>>([]);
  const lastItemRef = React.useRef<HTMLDivElement | null>(null);
  const continerRef = React.useRef<HTMLDivElement | null>(null);
  React.useLayoutEffect(() => {
    const key = Math.random().toString();
    const entering = document.createElement("div");
    entering.style.position = "absolute";
    entering.style.width = "100%";
    entering.style.height = "100%";
    entering.style.transform = transformMap[enterFrom].entering;
    entering.style.transition = `transform ${duration}s ease-in-out`;
    entering.style.pointerEvents = "none";
    entering.style.userSelect = "none";
    setTimeout(() => {
      entering.style.transform = "translate(0%, 0%)";
    }, 0);
    setTimeout(() => {
      entering.style.pointerEvents = "auto";
      entering.style.userSelect = "auto";
    }, duration * 1000);
    continerRef.current?.appendChild(entering);
    const portal = ReactDOM.createPortal(children, entering, key);
    setQueue((queue) => queue.concat(portal));
    if (lastItemRef.current) {
      lastItemRef.current.style.pointerEvents = "none";
      lastItemRef.current.style.userSelect = "none";
      lastItemRef.current.style.transition = `transform ${duration}s ease-in-out`;
      lastItemRef.current.style.transform = transformMap[enterFrom].leaving;
      setTimeout(() => {
        setQueue((queue) => queue.slice(1));
      }, duration * 1000);
    }
    lastItemRef.current = entering;
  }, [children, duration, enterFrom]);
  return (
    <div
      ref={continerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {queue}
    </div>
  );
}
const transformMap = {
  left: {
    leaving: "translate(100%, 0%)",
    entering: "translate(-100%, 0%)",
  },
  right: {
    leaving: "translate(-100%, 0%)",
    entering: "translate(100%, 0%)",
  },
} as const;