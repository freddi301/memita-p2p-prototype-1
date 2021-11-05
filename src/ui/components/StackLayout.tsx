import React from "react";
import { css } from "styled-components/macro";
import { StyleContext } from "../StyleProvider";

type StackLayoutProps = {
  type: "vertical" | "horizontal";
  align: "start" | "end";
  gap: boolean;
  padding: boolean;
  children: React.ReactNode;
};
export function StackLayout({
  type,
  children,
  align,
  gap,
  padding,
}: StackLayoutProps) {
  const { theme } = React.useContext(StyleContext);
  switch (type) {
    case "vertical": {
      return (
        <div
          css={css`
            display: grid;
            grid-auto-flow: row;
            grid-auto-rows: auto;
            grid-template-columns: auto;
            grid-row-gap: ${gap ? theme.spacing.gap : ""};
            padding-top: ${padding ? theme.spacing.text.vertical : ""};
            padding-bottom: ${padding ? theme.spacing.text.vertical : ""};
            padding-left: ${padding ? theme.spacing.text.horizontal : ""};
            padding-right: ${padding ? theme.spacing.text.horizontal : ""};
          `}
        >
          {children}
        </div>
      );
    }
    case "horizontal": {
      return (
        <div
          css={css`
            display: grid;
            grid-auto-flow: column;
            grid-template-columns: ${align === "end" ? "1fr" : ""};
            grid-auto-columns: max-content;
            grid-template-rows: auto;
            grid-column-gap: ${gap ? theme.spacing.gap : ""};
            padding-top: ${padding ? theme.spacing.text.vertical : ""};
            padding-bottom: ${padding ? theme.spacing.text.vertical : ""};
            padding-left: ${padding ? theme.spacing.text.horizontal : ""};
            padding-right: ${padding ? theme.spacing.text.horizontal : ""};
          `}
        >
          {align === "end" && <div></div>}
          {children}
        </div>
      );
    }
  }
}
