import React from "react";
import { Text } from "./Text";
import { Clickable } from "./Clickable";
import { css } from "styled-components/macro";
import { StyleContext } from "../StyleProvider";
import { FrontendFacade, useSrcFromHash } from "../FrontendFacade";

type PostItemProps = {
  hash: string;
};
export function PostItem({ hash }: PostItemProps) {
  const { theme } = React.useContext(StyleContext);
  const post = FrontendFacade.usePostByHash(hash);
  const contact = FrontendFacade.useContactByPublicKey(post?.authorPublicKey ?? "");
  const account = FrontendFacade.useAccountByPublicKey(post?.authorPublicKey ?? "");
  const author = contact ?? account;
  return (
    <Clickable onClick={() => {}}>
      <div
        css={css`
          display: grid;
          grid-template-columns: 1fr auto;
          grid-template-rows: min-content min-content min-content;
          padding: ${theme.spacing.text.vertical} ${theme.spacing.text.horizontal};
        `}
      >
        <div
          css={css`
            grid-row: 1;
            grid-column: 1;
          `}
        >
          <Text color="primary" size="normal" weight="bold" text={author?.name ?? "..."} />
        </div>
        <div
          css={css`
            grid-row: 1;
            grid-column: 2;
            display: flex;
            align-items: flex-end;
          `}
        >
          <Text
            color="secondary"
            size="small"
            weight="normal"
            text={post ? dateTimeFormatter.format(post.createdAtEpoch) : "..."}
            textAlign="right"
          />
        </div>
        <div
          css={css`
            grid-row: 2;
            grid-column: 1 / span 2;
          `}
        >
          <Text color="primary" size="normal" weight="normal" text={post ? post.text.trim() : "..."} />
        </div>
        <div
          css={css`
            grid-column: 1 / span 2;
            grid-row: 3;
            margin-top: ${theme.spacing.text.vertical};
            position: relative;
            overflow-x: auto;
          `}
        >
          <div
            css={css`
              display: flex;
              align-items: center;
            `}
          >
            {post?.attachments.map(({ name, contentHash }, index) => {
              return <FileView key={index} name={name} hash={contentHash} />;
            })}
          </div>
        </div>
      </div>
    </Clickable>
  );
}
const dateTimeFormatter = Intl.DateTimeFormat([], { dateStyle: "short", timeStyle: "medium" });
type FileViewProps = { name: string; hash: string };
function FileView({ name, hash }: FileViewProps) {
  const { theme } = React.useContext(StyleContext);
  const src = useSrcFromHash(hash);
  const width = 200;
  const height = 200;
  if (src === null) return null;
  if (/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(name)) {
    return (
      <img
        src={src}
        alt=""
        css={css`
          width: 100%;
          max-height: 80vh;
          object-fit: contain;
        `}
      />
    );
  }
  if (/\.(?:wav|mp3|m4a)$/i.test(name)) {
    return (
      <audio
        controls
        css={css`
          width: 100%;
          height: 50px;
        `}
      >
        <source src={src} />
      </audio>
    );
  }
  if (/\.(?:mkv|mp4)$/i.test(name)) {
    return (
      <video
        controls
        css={css`
          width: 100%;
          max-height: 80vh;
        `}
      >
        <source src={src} />
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
}
