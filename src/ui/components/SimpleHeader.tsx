import React from "react";
import { css } from "styled-components/macro";
import { StyleContext } from "../StyleProvider";

type SimpleHeaderProps = {
  children: React.ReactNode;
};
export function SimpleHeader({ children }: SimpleHeaderProps) {
  const { theme } = React.useContext(StyleContext);
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        padding: ${theme.spacing.text.vertical} ${theme.spacing.text.horizontal};
        height: calc(${theme.sizes.vertical} + ${theme.spacing.text.vertical} * 2);
        box-sizing: border-box;
      `}
    >
      {children}
    </div>
  );
}
