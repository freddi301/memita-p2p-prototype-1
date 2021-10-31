import React from "react";
import { css } from "styled-components/macro";

export function ShadowDown() {
  return (
    <div
      css={css`
        position: relative;
        overflow: visible;
        z-index: 1;
      `}
    >
      <div
        css={css`
          position: absolute;
          width: 100%;
          height: 3px;
          box-shadow: #23252c 0 6px 6px -6px inset;
        `}
      ></div>
    </div>
  );
}
