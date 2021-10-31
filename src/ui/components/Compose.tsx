import React from "react";
import { css } from "styled-components/macro";

export function Compose() {
  const [text, setText] = React.useState("");
  return (
    <div
      css={css`
        display: flex;
        margin: 8px 8px 8px 40px;
      `}
    >
      <textarea
        value={text}
        onChange={(event) => setText(event.currentTarget.value)}
        rows={text.split("\n").length || 1}
        css={css`
          background-color: #21252b;
          flex-grow: 1;
          resize: none;
          outline: none;
          border: none;
          padding: 8px 16px;
          color: inherit;
          font-size: inherit;
          font-family: inherit;
          border-radius: 4px;
        `}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            setText("");
          }
        }}
      />
    </div>
  );
}
