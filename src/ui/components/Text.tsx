import React from "react";
import { css } from "styled-components/macro";
import { StyleContext } from "../StyleProvider";

type TextProps = {
  color: "primary" | "secondary";
  weight: "normal" | "bold";
  size: "small" | "normal" | "big";
  text: string;
  textAlign?: "left" | "right";
};

function Text({ text, color, weight, size, textAlign }: TextProps) {
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
      `}
    >
      {text}
    </div>
  );
}

const TextMemo = React.memo(Text);

export { TextMemo as Text };
