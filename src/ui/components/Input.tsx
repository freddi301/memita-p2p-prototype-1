import React from "react";
import { css } from "styled-components/macro";
import { StyleContext } from "../StyleProvider";

type InputProps = {
  value: string;
  label?: string;
  onChange(value: string): void;
};

function Input({ value, label, onChange }: InputProps) {
  const { theme } = React.useContext(StyleContext);
  return (
    <div
      css={css`
        display: flex;
        background-color: ${theme.colors.background.active};
        font-family: ${theme.font.family};
        font-size: ${theme.font.size.normal};
        border-radius: ${theme.spacing.border.radius};
        box-sizing: border-box;
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
        <label
          css={css`
            color: ${theme.colors.text.secondary};
            margin-right: ${theme.spacing.input.horizontal};
            font-weight: ${theme.font.weight.bold};
          `}
        >
          {label}
        </label>
      )}
      <input
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        css={css`
          flex-grow: 1;
          color: ${theme.colors.text.primary};
          border: none;
          outline: none;
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

const InputMemo = React.memo(Input);

export { InputMemo as Input };
