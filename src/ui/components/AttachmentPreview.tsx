import React from "react";
import { Text } from "./Text";
import { css } from "styled-components/macro";
import { StyleContext } from "../StyleProvider";

export type Attachment = { type: string; name: string; content: Uint8Array };

type AttachmentPreviewProps = { attachment: Attachment };
export function AttachmentPreview({ attachment: { type, name, content } }: AttachmentPreviewProps) {
  const { theme } = React.useContext(StyleContext);
  const src = React.useMemo(() => window.URL.createObjectURL(new Blob([content], { type })), [content, type]);
  return (
    <div>
      <div
        css={css`
          display: flex;
          align-items: center;
          justify-content: center;
        `}
      >
        {(() => {
          if (type.startsWith("image/")) {
            return (
              <img
                src={src}
                alt={name}
                css={css`
                  max-width: 300px;
                  max-height: 300px;
                `}
              />
            );
          }
          if (type === "application/pdf") {
            return (
              <iframe
                width={300}
                height={300}
                css={css`
                  border: none;
                `}
                title={name}
                src={src}
              ></iframe>
            );
          }
          return (
            <div
              css={css`
                width: 300px;
                height: 300px;
                overflow: hidden;
                color: ${theme.colors.text.primary};
                font-family: ${theme.font.family};
                font-size: ${theme.font.size.normal};
                font-weight: ${theme.font.weight.normal};
                margin: 0px;
              `}
            >
              {new TextDecoder().decode(content)}
            </div>
          );
        })()}
      </div>
      <div
        css={css`
          padding: ${theme.spacing.text.vertical};
        `}
      >
        <Text color="secondary" size="normal" weight="normal" text={name} truncatedLine={true} />
      </div>
    </div>
  );
}
