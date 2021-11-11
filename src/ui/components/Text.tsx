import React from "react";
import { css } from "styled-components/macro";
import { StyleContext } from "../StyleProvider";

type TextProps = {
  color: "primary" | "secondary";
  weight: "normal" | "bold";
  size: "small" | "normal" | "big";
  text: string;
  textAlign?: "left" | "right";
  truncatedLine?: boolean;
};

function Text({ text, color, weight, size, textAlign, truncatedLine }: TextProps) {
  const { theme } = React.useContext(StyleContext);
  return (
    <div
      css={css`
        color: ${theme.colors.text[color]};
        font-family: ${theme.font.family};
        font-size: ${theme.font.size[size]};
        font-weight: ${theme.font.weight[weight]};
        white-space: pre-line;
        word-break: break-word;
        text-align: ${textAlign};
        position: relative;
      `}
    >
      {truncatedLine ? (
        <>
          <div
            css={css`
              color: transparent;
              user-select: none;
            `}
          >
            X
          </div>
          <div
            css={css`
              display: block;
              position: absolute;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              width: 100%;
              top: 0;
            `}
          >
            {text}
          </div>
        </>
      ) : (
        text
      )}
    </div>
  );
}

const TextMemo = React.memo(Text);

export { TextMemo as Text };
