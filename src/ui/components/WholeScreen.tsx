import React from "react";
import { css } from "styled-components/macro";
import { StyleContext } from "../StyleProvider";

type WholeScreenProps = {
  children: React.ReactNode;
};
export function WholeScreen({ children }: WholeScreenProps) {
  const { theme } = React.useContext(StyleContext);
  return (
    <div
      css={css`
        width: 100vw;
        height: 100vh;
        background-color: ${theme.colors.background.passive};
      `}
    >
      {children}
    </div>
  );
}
