import React from "react";
import { css } from "styled-components/macro";
import { StyleContext } from "../StyleProvider";
import { Icon } from "./Icon";

type InputProps = {
  value: string;
  label?: string;
  onChange?(value: string): void;
};

function Input({ value, label, onChange }: InputProps) {
  const { theme } = React.useContext(StyleContext);
  const readOnly = onChange === undefined;
  return (
    <div
      css={css`
        display: flex;
        height: ${theme.sizes.vertical};
        box-sizing: border-box;
        align-items: center;
        background-color: ${theme.colors.background.active};
        font-family: ${theme.font.family};
        font-size: ${theme.font.size.normal};
        border-radius: ${theme.spacing.border.radius};
        padding-top: ${theme.spacing.text.vertical};
        padding-bottom: ${theme.spacing.text.vertical};
        padding-left: ${theme.spacing.text.horizontal};
        padding-right: ${theme.spacing.text.horizontal};
        :focus-within {
          background-color: ${theme.colors.background.focus};
        }
        transition: ${theme.transitions.input.duration};
      `}
    >
      {label && (
        <label
          css={css`
            color: ${theme.colors.text.secondary};
            margin-right: ${theme.spacing.text.horizontal};
            font-weight: ${theme.font.weight.bold};
          `}
        >
          {label}
        </label>
      )}
      <input
        value={value}
        onChange={(event) => onChange?.(event.currentTarget.value)}
        readOnly={readOnly}
        autoComplete="off"
        spellCheck={false}
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
      {readOnly && (
        <div
          css={css`
            color: ${theme.colors.text.secondary};
          `}
        >
          <Icon icon="ReadOnly" />
        </div>
      )}
    </div>
  );
}

const InputMemo = React.memo(Input);

export { InputMemo as Input };
