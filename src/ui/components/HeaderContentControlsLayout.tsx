import React from "react";
import { css } from "styled-components/macro";
import { StyleContext } from "../StyleProvider";

type HeaderContentControlsLayoutProps = {
  header: React.ReactNode;
  content: React.ReactNode;
  controls: React.ReactNode;
};

export function HeaderContentControlsLayout({ header, content, controls }: HeaderContentControlsLayoutProps) {
  const { theme, controlsPosition } = React.useContext(StyleContext);
  switch (controlsPosition) {
    case "bottom": {
      return (
        <div
          css={css`
            height: 100%;
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows:
              calc(${theme.sizes.vertical} + ${theme.spacing.text.vertical} * 2)
              1fr
              calc(${theme.sizes.vertical} + ${theme.spacing.text.vertical} * 2);
          `}
        >
          <div
            css={css`
              grid-column: 1;
              grid-row: 1;
              align-self: center;
              padding-left: ${theme.spacing.text.horizontal};
            `}
          >
            {header}
          </div>
          <div
            css={css`
              grid-column: 1;
              grid-row: 2;
              overflow-y: auto;
              border-top: 1px solid ${theme.colors.background.active};
              border-bottom: 1px solid ${theme.colors.background.active};
            `}
          >
            {content}
          </div>
          <div
            css={css`
              grid-column: 1;
              grid-row: 3;
            `}
          >
            {controls}
          </div>
        </div>
      );
    }
    case "top": {
      return (
        <div
          css={css`
            height: 100%;
            display: grid;
            grid-template-columns: auto 1fr;
            grid-template-rows:
              calc(${theme.sizes.vertical} + ${theme.spacing.text.vertical} * 2)
              1fr;
          `}
        >
          <div
            css={css`
              grid-column: 1;
              grid-row: 1;
              align-self: center;
              padding-left: ${theme.spacing.text.horizontal};
            `}
          >
            {header}
          </div>
          <div
            css={css`
              grid-column: 2;
              grid-row: 1;
            `}
          >
            {controls}
          </div>
          <div
            css={css`
              grid-column: 1 / span 2;
              grid-row: 2;
              overflow-y: auto;
              border-top: 1px solid ${theme.colors.background.active};
            `}
          >
            {content}
          </div>
        </div>
      );
    }
  }
}
