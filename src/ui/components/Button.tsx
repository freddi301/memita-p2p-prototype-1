import React from "react";
import { css } from "styled-components/macro";
import { StyleContext } from "../StyleProvider";

type ButtonProps = {
  label: string;
  icon: React.ReactNode;
  enabled: boolean;
  onClick(): void;
};

function Button({ label, icon, onClick, enabled }: ButtonProps) {
  const { theme, showButtonIcon, showButtonLabel } = React.useContext(StyleContext);
  const ref = React.useRef<HTMLButtonElement | null>(null);
  return (
    <button
      ref={ref}
      onClick={() => {
        onClick();
      }}
      css={css`
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: ${theme.sizes.vertical};
        height: ${theme.sizes.vertical};
        color: ${enabled ? theme.colors.text.primary : theme.colors.text.secondary};
        background-color: ${theme.colors.background.active};
        font-family: ${theme.font.family};
        font-size: ${theme.font.size.normal};
        border-radius: ${theme.spacing.border.radius};
        border: none;
        outline: none;
        cursor: pointer;
        box-sizing: border-box;
        :focus {
          background-color: ${theme.colors.background.focus};
        }
        padding-top: ${theme.spacing.text.vertical};
        padding-bottom: ${theme.spacing.text.vertical};
        padding-left: ${showButtonLabel ? theme.spacing.text.horizontal : ""};
        padding-right: ${showButtonLabel ? theme.spacing.text.horizontal : ""};
        transition: ${theme.transitions.input.duration};
      `}
      onMouseEnter={() => {
        ref.current?.focus();
      }}
      onMouseLeave={() => {
        ref.current?.blur();
      }}
    >
      {showButtonIcon && icon}
      {showButtonIcon && showButtonLabel && (
        <div
          css={css`
            width: ${theme.spacing.text.horizontal};
          `}
        ></div>
      )}
      {showButtonLabel && label}
    </button>
  );
}

const ButtonMemo = React.memo(Button);

export { ButtonMemo as Button };
