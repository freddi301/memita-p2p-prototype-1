import React from "react";
import { css } from "styled-components/macro";
import { StyleContext } from "../StyleProvider";

type TextareaProps = {
  label?: string;
  value: string;
  onChange(value: string): void;
  rows: number;
};

function Textarea({ value, label, rows, onChange }: TextareaProps) {
  const { theme } = React.useContext(StyleContext);
  return (
    <div
      css={css`
        min-height: ${theme.sizes.vertical};
        box-sizing: border-box;
        background-color: ${theme.colors.background.active};
        font-family: ${theme.font.family};
        font-size: ${theme.font.size.normal};
        border-radius: ${theme.spacing.border.radius};
        :focus-within {
          background-color: ${theme.colors.background.focus};
        }
        transition: ${theme.transitions.input.duration};
      `}
    >
      {label && (
        <div
          css={css`
            color: ${theme.colors.text.secondary};
            font-weight: ${theme.font.weight.bold};
            margin-top: ${theme.spacing.text.vertical};
            margin-left: ${theme.spacing.text.horizontal};
            margin-right: ${theme.spacing.text.horizontal};
          `}
        >
          {label}
        </div>
      )}
      <textarea
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        rows={rows}
        autoComplete="off"
        spellCheck={false}
        css={css`
          width: calc(100% - ${theme.spacing.text.horizontal} * 2);
          color: ${theme.colors.text.primary};
          border: none;
          outline: none;
          resize: none;
          background-color: inherit;
          font-family: inherit;
          font-size: inherit;
          padding: 0px;
          margin-top: ${theme.spacing.text.vertical};
          margin-bottom: ${theme.spacing.text.vertical};
          margin-left: ${theme.spacing.text.horizontal};
          margin-right: ${theme.spacing.text.horizontal};
        `}
      />
    </div>
  );
}

const TextareaMemo = React.memo(Textarea);

export { TextareaMemo as Textarea };
