import React from "react";
import { css } from "styled-components/macro";
import { StyleContext } from "../StyleProvider";

type TextareaProps = {
  value: string;
  label?: string;
  rows: number;
  onChange(value: string): void;
  actions?: React.ReactNode;
  onKeyDown?: React.HTMLProps<HTMLTextAreaElement>["onKeyDown"];
  onBlur?: React.HTMLProps<HTMLTextAreaElement>["onBlur"];
};

function Textarea({ value, label, rows, onChange, actions, onKeyDown, onBlur }: TextareaProps) {
  const { theme } = React.useContext(StyleContext);
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        min-height: ${theme.sizes.vertical};
        justify-content: center;
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
      <div
        css={css`
          display: flex;
          align-items: end;
        `}
      >
        <textarea
          value={value}
          onChange={(event) => onChange(event.currentTarget.value)}
          rows={rows}
          autoComplete="off"
          spellCheck={false}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          css={css`
            flex-grow: 1;
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
        <div>{actions}</div>
      </div>
    </div>
  );
}

const TextareaMemo = React.memo(Textarea);

export { TextareaMemo as Textarea };
