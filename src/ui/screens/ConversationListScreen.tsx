import React from "react";
import { Button } from "../components/Button";
import { HeaderContentControlsLayout } from "../components/HeaderContentControlsLayout";
import { Text } from "../components/Text";
import { Virtuoso } from "react-virtuoso";
import { Clickable } from "../components/Clickable";
import { Icon } from "../components/Icon";
import { ButtonGroup } from "../components/ButtonGroup";
import { css } from "styled-components/macro";
import { StyleContext } from "../StyleProvider";
import { FrontendFacade } from "../../logic/FrontendFacade";

type ConversationListScreenProps = {
  onHome(): void;
  myPublicKey: string;
  onConversation(myPublicKey: string, otherPublicKey: string): void;
};
export function ConversationListScreen({ myPublicKey, onHome, onConversation }: ConversationListScreenProps) {
  const conversationsCount = FrontendFacade.useConversationsListSize(myPublicKey) ?? 0;
  return (
    <HeaderContentControlsLayout
      header={<Text text="Conversations" color="primary" weight="bold" size="big" />}
      content={
        <Virtuoso
          style={{ height: "100%" }}
          totalCount={conversationsCount}
          itemContent={(index) => (
            <ConversationItem index={index} myPublicKey={myPublicKey} onConversation={onConversation} />
          )}
        />
      }
      controls={
        <ButtonGroup>
          <Button label="Home" icon={<Icon icon="Home" />} onClick={onHome} enabled={true} />
        </ButtonGroup>
      }
    />
  );
}

type ConversationItemProps = {
  index: number;
  myPublicKey: string;
  onConversation(myPublicKey: string, otherPublicKey: string): void;
};
function ConversationItem({ index, onConversation, myPublicKey }: ConversationItemProps) {
  const { theme } = React.useContext(StyleContext);
  const conversation = FrontendFacade.useConversationsListAtIndex(myPublicKey, index);
  const contact = FrontendFacade.useContactByPublicKey(conversation?.otherPublicKey ?? "");
  return (
    <Clickable
      onClick={() => {
        if (conversation) {
          onConversation(myPublicKey, conversation.otherPublicKey);
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
      </div>
    </Clickable>
  );
}

const dateTimeFormatter = Intl.DateTimeFormat([], { dateStyle: "short", timeStyle: "medium" });
