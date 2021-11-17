import React from "react";
import { css } from "styled-components/macro";
import { StyleContext } from "../StyleProvider";

type FileViewProps = { name: string; src: string; width: number; height: number };
export function FileView({ name, src, height, width }: FileViewProps) {
  const { theme } = React.useContext(StyleContext);
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        justify-content: center;
        width: ${width}px;
        height: ${height}px;
      `}
    >
      {(() => {
        if (/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(name)) {
          return (
            <img
              src={src}
              alt=""
              css={css`
                max-width: ${width}px;
                max-height: ${height}px;
              `}
            />
          );
        }
        if (/\.(?:wav|mp3|m4a)$/i.test(name)) {
          return (
            <audio
              controls
              css={css`
                width: ${width}px;
                height: ${height}px;
              `}
            >
              <source src={src} type="audio/mpeg" />
            </audio>
          );
        }
        if (/\.(?:mkv|mp4)$/i.test(name)) {
          return (
            <video
              controls
              css={css`
                width: ${width}px;
                height: ${height}px;
              `}
            >
              <source src={src} type="video/mp4" />
            </video>
          );
        }
        if (/\.pdf$/i.test(name)) {
          return (
            <iframe
              width={width}
              height={height}
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
              width: ${width}px;
              height: ${height}px;
              color: ${theme.colors.text.primary};
              font-family: ${theme.font.family};
              font-size: ${theme.font.size.normal};
              font-weight: ${theme.font.weight.normal};
              margin: 0px;
            `}
          >
            file
          </div>
        );
      })()}
    </div>
  );
}
