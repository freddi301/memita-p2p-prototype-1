import React from "react";
import { css } from "styled-components/macro";
import { StyleContext } from "../StyleProvider";
import { IconName } from "../theme";
import { Icon } from "./Icon";

type ButtonProps = {
  label: string;
  icon?: IconName;
  enabled: boolean;
  onClick(): void;
  showLabel: boolean;
};

function Button({ label, icon, onClick, enabled, showLabel }: ButtonProps) {
  const { theme } = React.useContext(StyleContext);
  const ref = React.useRef<HTMLButtonElement>(null);
  return (
    <button
      ref={ref}
      onClick={() => {
        onClick();
      }}
      disabled={!enabled}
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
        user-select: none;
        box-sizing: border-box;
        :focus {
          background-color: ${theme.colors.background.focus};
        }
        padding-top: ${theme.spacing.text.vertical};
        padding-bottom: ${theme.spacing.text.vertical};
        padding-left: ${showLabel ? theme.spacing.text.horizontal : ""};
        padding-right: ${showLabel ? theme.spacing.text.horizontal : ""};
        transition: ${theme.transitions.input.duration};
      `}
      onMouseEnter={() => {
        ref.current?.focus();
      }}
      onMouseLeave={() => {
        ref.current?.blur();
      }}
    >
      {icon && <Icon icon={icon} />}
      {icon && showLabel && (
        <div
          css={css`
            width: ${theme.spacing.text.horizontal};
          `}
        ></div>
      )}
      {showLabel && label}
    </button>
  );
}

const ButtonMemo = React.memo(Button);

export { ButtonMemo as Button };
