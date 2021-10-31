import React from "react";
import { css } from "styled-components/macro";

export function Account({ name, accountPublicKey }: AccountProps) {
  return (
    <div
      css={css`
        padding: 8px 16px;
        background-color: #282c34;
      `}
    >
      <div>{name}</div>
      <div
        css={css`
          color: #7f848e;
        `}
      >
        {accountPublicKey}
      </div>
    </div>
  );
}
type AccountProps = {
  name: string;
  accountPublicKey: string;
};
