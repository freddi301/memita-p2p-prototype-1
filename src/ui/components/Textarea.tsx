import React from "react";
import { css } from "styled-components/macro";
import { StyleContext } from "../StyleProvider";
import { Icon } from "./Icon";

type TextareaProps = {
  label?: string;
  value: string;
  onChange?(value: string): void;
  required?: boolean;
};

function Textarea({ value, label, onChange, required }: TextareaProps) {
  const { theme } = React.useContext(StyleContext);
  const readOnly = onChange === undefined;
  const ref = React.useRef<HTMLTextAreaElement>(null);
  React.useLayoutEffect(() => {
    if (ref.current) {
      ref.current.style.height = "";
      ref.current.style.height = ref.current.scrollHeight + "px";
    }
  }, [value]);
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
      <div
        css={css`
          display: flex;
          margin: ${theme.spacing.text.vertical} ${theme.spacing.text.horizontal} 0px ${theme.spacing.text.horizontal};
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
        <div
          css={css`
            flex-grow: 1;
          `}
        ></div>
        {required && (
          <div
            css={css`
              color: ${value === "" ? theme.colors.text.primary : theme.colors.text.secondary};
            `}
          >
            <Icon icon="Required" />
          </div>
        )}
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
      <textarea
        ref={ref}
        value={value}
        readOnly={readOnly}
        onChange={(event) => {
          onChange?.(event.currentTarget.value);
        }}
        autoComplete="off"
        spellCheck={false}
        rows={1}
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
