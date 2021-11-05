import React from "react";
import { css } from "styled-components/macro";
import { StyleContext } from "../StyleProvider";

type TextProps = {
  color: "primary" | "secondary";
  weight: "normal" | "bold";
  size: "normal" | "big";
  text: string;
};

function Text({ text, color, weight, size }: TextProps) {
  const { theme } = React.useContext(StyleContext);
  return (
    <div
      css={css`
        color: ${theme.colors.text[color]};
        font-family: ${theme.font.family};
        font-size: ${theme.font.size[size]};
        font-weight: ${theme.font.weight[weight]};
        box-sizing: border-box;
        border: ${theme.spacing.border.size} solid transparent;
        white-space: pre-line;
        word-break: break-word;
        transition: ${theme.transitions.input.duration};
      `}
    >
      {text}
    </div>
  );
}

const TextMemo = React.memo(Text);

export { TextMemo as Text };
