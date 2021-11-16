import React from "react";
import { css } from "styled-components/macro";
import { NavigationContext } from "../NavigationStack";
import { StyleContext } from "../StyleProvider";
import { Clickable } from "./Clickable";
import { Icon } from "./Icon";

type HeaderContentControlsLayoutProps = {
  header: React.ReactNode;
  content: React.ReactNode;
  controls: React.ReactNode;
};

export function HeaderContentControlsLayout({ header, content, controls }: HeaderContentControlsLayoutProps) {
  const { theme } = React.useContext(StyleContext);
  const navigationStack = React.useContext(NavigationContext);
  const back = () => {
    navigationStack.pop();
  };
  return (
    <div
      css={css`
        height: 100%;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr auto;
      `}
    >
      {header && (
        <div
          css={css`
            grid-column: 1;
            grid-row: 1;
            height: calc(${theme.sizes.vertical} + ${theme.spacing.text.vertical} * 2);
            border-bottom: 1px solid ${theme.colors.background.active};
            display: flex;
          `}
        >
          <Clickable onClick={back}>
            <div
              css={css`
                padding: ${theme.spacing.text.vertical} ${theme.spacing.text.vertical};
                display: flex;
                align-items: center;
                justify-content: center;
                width: 56px;
                height: 56px;
                box-sizing: border-box;
                color: ${theme.colors.text.secondary};
                font-size: ${theme.font.size.big};
              `}
            >
              <Icon icon="Back" />
            </div>
          </Clickable>
          <div
            css={css`
              flex-grow: 1;
            `}
          >
            {header}
          </div>
        </div>
      )}
      <div
        css={css`
          grid-column: 1;
          grid-row: 2;
          overflow-y: auto;
        `}
      >
        {content}
      </div>
      {controls && (
        <div
          css={css`
            grid-column: 1;
            grid-row: 3;
            height: calc(${theme.sizes.vertical} + ${theme.spacing.text.vertical} * 2);
            border-top: 1px solid ${theme.colors.background.active};
          `}
        >
          {controls}
        </div>
      )}
    </div>
  );
}
