import React from "react";
import { css } from "styled-components/macro";
import { StyleContext } from "../StyleProvider";
import { Text } from "./Text";

type EmptyListPlaceholderProps = { children: string };
export function EmptyListPlaceholder({ children }: EmptyListPlaceholderProps) {
  const { theme } = React.useContext(StyleContext);
  return (
    <div
      css={css`
        padding: ${theme.spacing.text.vertical} ${theme.spacing.text.horizontal};
      `}
    >
      <Text color="secondary" size="normal" weight="normal" text={children} />
    </div>
  );
}
