import React from "react";
import { css } from "styled-components/macro";
import { StyleContext } from "../StyleProvider";

type ButtonGroupProps = {
  children: React.ReactNode;
};
export function ButtonGroup({ children }: ButtonGroupProps) {
  const { theme } = React.useContext(StyleContext);
  return (
    <div
      css={css`
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: max-content;
        grid-template-rows: auto;
        grid-column-gap: ${theme.spacing.gap};
        align-items: center;
        justify-content: end;
        padding-top: ${theme.spacing.text.vertical};
        padding-bottom: ${theme.spacing.text.vertical};
        padding-left: ${theme.spacing.text.horizontal};
        padding-right: ${theme.spacing.text.horizontal};
      `}
    >
      {children}
    </div>
  );
}
