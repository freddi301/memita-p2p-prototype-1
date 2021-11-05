import React from "react";
import { css } from "styled-components/macro";
import { StyleContext } from "../StyleProvider";

type TextareaProps = {
  value: string;
  label?: string;
  rows: number;
  onChange(value: string): void;
};

function Textarea({ value, label, rows, onChange }: TextareaProps) {
  const { theme } = React.useContext(StyleContext);
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        background-color: ${theme.colors.background.active};
        font-family: ${theme.font.family};
        font-size: ${theme.font.size.normal};
        border-radius: ${theme.spacing.border.radius};
        border: ${theme.spacing.border.size} solid
          ${theme.colors.background.active};
        padding-top: ${theme.spacing.text.vertical};
        padding-bottom: ${theme.spacing.text.vertical};
        padding-left: ${theme.spacing.text.horizontal};
        padding-right: ${theme.spacing.text.horizontal};
        :hover {
          border: ${theme.spacing.border.size} solid
            ${theme.colors.background.focus};
        }
        :focus-within {
          border: ${theme.spacing.border.size} solid
            ${theme.colors.background.focus};
        }
        transition: ${theme.transitions.input.duration};
      `}
    >
      {label && (
        <div
          css={css`
            color: ${theme.colors.text.secondary};
            font-weight: ${theme.font.weight.bold};
          `}
        >
          {label}
        </div>
      )}
      <textarea
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        rows={rows}
        css={css`
          color: ${theme.colors.text.primary};
          border: none;
          outline: none;
          resize: none;
          background-color: inherit;
          font-family: inherit;
          font-size: inherit;
          padding: 0px;
          margin: 0px;
        `}
      />
    </div>
  );
}

const TextareaMemo = React.memo(Textarea);

export { TextareaMemo as Textarea };
