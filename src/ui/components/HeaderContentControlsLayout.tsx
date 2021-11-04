import React from "react";
import { css } from "styled-components/macro";

type HeaderContentControlsLayoutProps = {
  header: React.ReactNode;
  content: React.ReactNode;
  controls: React.ReactNode;
};
export function HeaderContentControlsLayout({
  header,
  content,
  controls,
}: HeaderContentControlsLayoutProps) {
  return (
    <div
      css={css`
        height: 100%;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: min-content 1fr min-content;
      `}
    >
      <div
        css={css`
          grid-column: 1;
          grid-row: 1;
        `}
      >
        {header}
      </div>
      <div
        css={css`
          grid-column: 1;
          grid-row: 2;
          overflow-y: auto;
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
