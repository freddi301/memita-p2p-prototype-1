import React from "react";
import { css } from "styled-components/macro";

export function ShadowUp() {
  return (
    <div
      css={css`
        position: relative;
        overflow: visible;
      `}
    >
      <div
        css={css`
          position: absolute;
          width: 100%;
          height: 3px;
          top: -3px;
          box-shadow: #23252c 0 6px 6px -6px inset;
          transform: rotate(180deg);
        `}
      ></div>
    </div>
  );
}
