import React from "react";

export function TruncatedLine({ text }: { text: string }) {
  return (
    <span style={{ position: "relative", display: "block" }}>
      <span style={{ color: "transparent" }}>X</span>
      <span
        style={{
          display: "block",
          position: "absolute",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          width: "100%",
          top: 0,
        }}
      >
        {text}
      </span>
    </span>
  );
}
