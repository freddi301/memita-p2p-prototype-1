import React from "react";
import { HeaderContentControlsLayout } from "../components/HeaderContentControlsLayout";
import { Text } from "../components/Text";
import { Virtuoso } from "react-virtuoso";
import { css } from "styled-components/macro";
import { StyleContext } from "../StyleProvider";
import { FrontendFacade } from "../FrontendFacade";
import "emoji-mart/css/emoji-mart.css";
import { MessageEditor } from "../components/MessageEditor";
import { EmptyListPlaceholder } from "../components/EmptyListPlaceholder";
import { PostItem } from "../components/PostItem";

type WallScreenProps = {
  authorPublicKey: string;
};
export function WallScreen({ authorPublicKey }: WallScreenProps) {
  const { theme } = React.useContext(StyleContext);
  const onPublish = (text: string, attachments: Array<{ name: string; contentHash: string }>) => {
    FrontendFacade.doPost(authorPublicKey, new Date().getTime(), text, attachments);
  };
  const contact = FrontendFacade.useContactByPublicKey(authorPublicKey);
  const account = FrontendFacade.useAccountByPublicKey(authorPublicKey);
  const author = contact ?? account;
  const postCount = FrontendFacade.usePostListSize(authorPublicKey) ?? 0;
  return (
    <HeaderContentControlsLayout
      header={
        <div
          css={css`
            display: grid;
            grid-auto-flow: row;
            grid-auto-columns: auto;
            padding: ${theme.spacing.text.vertical} ${theme.spacing.text.horizontal};
            height: calc(${theme.sizes.vertical} + ${theme.spacing.text.vertical} * 2);
            box-sizing: border-box;
          `}
        >
          <Text color="primary" size="normal" weight="bold" text={author?.name ?? "..."} />
          <Text color="secondary" size="normal" weight="normal" text={authorPublicKey} truncatedLine={true} />
        </div>
      }
      content={
        <div
          css={css`
            height: 100%;
            display: flex;
            justify-content: center;
          `}
        >
          <div
            css={css`
              width: 600px;
              display: flex;
              flex-direction: column;
            `}
          >
            {account && <MessageEditor onSend={onPublish} submitOnEnter={false} />}
            {postCount === 0 && (
              <div
                css={css`
                  flex-grow: 1;
                `}
              >
                <EmptyListPlaceholder>No posts</EmptyListPlaceholder>
              </div>
            )}
            {postCount !== 0 && (
              <Virtuoso
                style={{ flexGrow: 1, overflow: "overlay overlay" }}
                totalCount={postCount}
                increaseViewportBy={5000}
                itemContent={(index) => <WallItem index={index} authorPublicKey={authorPublicKey} />}
              />
            )}
          </div>
        </div>
      }
      controls={null}
    />
  );
}

type WallItemProps = {
  index: number;
  authorPublicKey: string;
};
function WallItem({ index, authorPublicKey }: WallItemProps) {
  const postHash = FrontendFacade.usePostListAtIndex(authorPublicKey, index);
  if (!postHash)
    return (
      <div
        css={css`
          height: 50px;
        `}
      ></div>
    );
  return <PostItem hash={postHash} />;
}
