import React from "react";
import { HeaderContentControlsLayout } from "../components/HeaderContentControlsLayout";
import { Text } from "../components/Text";
import { Virtuoso } from "react-virtuoso";
import { Clickable } from "../components/Clickable";
import { css } from "styled-components/macro";
import { StyleContext } from "../StyleProvider";
import { FrontendFacade } from "../FrontendFacade";
import { NavigationContext } from "../NavigationStack";
import { EmptyListPlaceholder } from "../components/EmptyListPlaceholder";
import { ButtonGroup } from "../components/ButtonGroup";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";

type ConversationListScreenProps = {
  myPublicKey: string;
};
export function ConversationListScreen({ myPublicKey }: ConversationListScreenProps) {
  const navigationStack = React.useContext(NavigationContext);
  const { theme } = React.useContext(StyleContext);
  const account = FrontendFacade.useAccountByPublicKey(myPublicKey);
  const onConversation = (otherPublicKey: string) => {
    navigationStack.push({ screen: "conversation", otherPublicKey });
  };
  const onCreate = () => {
    navigationStack.push({ screen: "contact-list" });
  };
  const conversationsCount = FrontendFacade.useConversationsListSize(myPublicKey) ?? 0;
  return (
    <HeaderContentControlsLayout
      header={
        <div
          css={css`
            display: grid;
            grid-auto-flow: row;
            grid-auto-columns: auto;
            padding: ${theme.spacing.text.vertical} ${theme.spacing.text.horizontal};
          `}
        >
          <Text color="primary" size="normal" weight="bold" text={account?.name ?? "..."} />
          <Text color="secondary" size="normal" weight="normal" text={myPublicKey} />
        </div>
      }
      content={
        !conversationsCount ? (
          <EmptyListPlaceholder>No conversations</EmptyListPlaceholder>
        ) : (
          <Virtuoso
            style={{ height: "100%" }}
            totalCount={conversationsCount}
            itemContent={(index) => (
              <ConversationLisItem index={index} myPublicKey={myPublicKey} onConversation={onConversation} />
            )}
          />
        )
      }
      controls={
        <ButtonGroup>
          <Button label="Create" icon="Create" onClick={onCreate} enabled={true} showLabel={false} />
        </ButtonGroup>
      }
    />
  );
}

type ConversationItemProps = {
  index: number;
  myPublicKey: string;
  onConversation(otherPublicKey: string): void;
};
export function ConversationLisItem({ index, onConversation, myPublicKey }: ConversationItemProps) {
  const { theme } = React.useContext(StyleContext);
  const conversation = FrontendFacade.useConversationsListAtIndex(myPublicKey, index);
  const contact = FrontendFacade.useContactByPublicKey(conversation?.otherPublicKey ?? "");
  return (
    <Clickable
      onClick={() => {
        if (conversation) {
          onConversation(conversation.otherPublicKey);
        }
      }}
    >
      <div
        css={css`
          display: grid;
          grid-template-columns: 1fr auto;
          grid-template-rows: auto auto;
          padding: ${theme.spacing.text.vertical} ${theme.spacing.text.horizontal};
        `}
      >
        <div
          css={css`
            grid-column: 1;
            grid-row: 1;
          `}
        >
          <Text color="primary" size="normal" weight="bold" text={contact?.name ?? "..."} />
        </div>
        <div
          css={css`
            grid-column: 2;
            grid-row: 1;
          `}
        >
          <Text
            color="secondary"
            size="small"
            weight="normal"
            text={conversation ? dateTimeFormatter.format(conversation?.lastMessage.createdAtEpoch) : "..."}
          />
        </div>
        <div
          css={css`
            grid-column: 1 / span 2;
            grid-row: 2;
            display: flex;
          `}
        >
          <div
            css={css`
              flex-grow: 1;
            `}
          >
            <Text
              color="primary"
              size="normal"
              weight="normal"
              truncatedLine={true}
              text={conversation?.lastMessage.text ?? "..."}
            />
          </div>
          {conversation && conversation.lastMessage.attachments.length > 0 && (
            <div
              css={css`
                color: ${theme.colors.text.secondary};
                font-family: ${theme.font.family};
                font-size: ${theme.font.size.normal};
                margin-left: ${theme.spacing.text.vertical};
                display: flex;
                align-items: center;
                justify-content: center;
              `}
            >
              <Icon icon="Attachment" />
              <div
                css={css`
                  margin-left: ${theme.spacing.text.vertical};
                `}
              >
                {conversation.lastMessage.attachments.length}
              </div>
            </div>
          )}
        </div>
      </div>
    </Clickable>
  );
}

const dateTimeFormatter = Intl.DateTimeFormat([], { dateStyle: "short", timeStyle: "medium" });
