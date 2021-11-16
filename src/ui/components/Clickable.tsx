import React from "react";
import { css } from "styled-components/macro";
import { StyleContext } from "../StyleProvider";

type ClickableProps = {
  children: React.ReactNode;
  onClick(): void;
};
export function Clickable({ children, onClick }: ClickableProps) {
  const { theme } = React.useContext(StyleContext);
  return (
    <div
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          onClick();
        }
      }}
      css={css`
        outline: none;
        cursor: pointer;
        user-select: none;
        :focus {
          background-color: ${theme.colors.background.focus};
        }
        :hover {
          background-color: ${theme.colors.background.focus};
        }
        transition: ${theme.transitions.input.duration};
      `}
    >
      {children}
    </div>
  );
}
