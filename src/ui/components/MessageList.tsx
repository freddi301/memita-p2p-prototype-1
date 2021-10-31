import React from "react";
import { VariableSizeList } from "react-window";
import { AutoSizer } from "react-virtualized";
import { css } from "styled-components/macro";

export function MessageList() {
  return (
    <AutoSizer>
      {({ width, height }) => {
        if (!width) return null;
        return (
          <VariableSizeList
            width={width}
            height={height}
            itemCount={1000}
            itemSize={(index) => {
              return heightFromText(width, textFromIndex(index));
            }}
            overscanCount={10}
          >
            {MessageListItemMemo}
          </VariableSizeList>
        );
      }}
    </AutoSizer>
  );
}

type MessageProps = {
  text: string;
  side: "left" | "right";
};
function Message({ text, side }: MessageProps) {
  const bySide = {
    left: {
      left: 8,
      right: 40,
    },
    right: {
      left: 40,
      right: 8,
    },
  };
  return (
    <div
      css={css`
        background-color: #21252b;
        padding: 8px 16px;
        margin-left: ${bySide[side].left}px;
        margin-right: ${bySide[side].right}px;
        white-space: pre-line;
        word-break: break-word;
        border-radius: 4px;
      `}
    >
      {text}
    </div>
  );
}

export const textFromIndex = (index: number) => "a".repeat(index + 1);
export const heightFromText = (() => {
  const parent = document.createElement("div");
  parent.style.position = "fixed";
  parent.style.top = "0px";
  parent.style.left = "0px";
  parent.style.visibility = "hidden";
  const child = document.createElement("div");
  child.style.whiteSpace = "pre-line";
  child.style.wordBreak = "break-word";
  child.style.padding = "8px 16px";
  child.style.marginLeft = "48px";
  child.style.fontFamily = "Roboto";
  parent.appendChild(child);
  document.body.appendChild(parent);
  return (width: number, text: string) => {
    parent.style.width = `${width}px`;
    child.innerText = text;
    return child.offsetHeight + 8;
  };
})();

type MessageListItemProps = {
  index: number;
  style: React.CSSProperties;
};
function MessageListItem({ index, style }: MessageListItemProps) {
  return (
    <div key={index} style={style}>
      <Message
        text={textFromIndex(index)}
        side={index % 2 === 0 ? "left" : "right"}
      />
    </div>
  );
}
export const MessageListItemMemo = React.memo(MessageListItem);
