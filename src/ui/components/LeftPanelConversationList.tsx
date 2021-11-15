import React from "react";
import { StyleContext } from "../StyleProvider";
import { FrontendFacade } from "../FrontendFacade";
import { ConversationLisItem } from "../screens/ConversationListScreen";
import { css } from "styled-components/macro";
import { Virtuoso } from "react-virtuoso";
import { NavigationContext } from "../NavigationStack";
import { Text } from "./Text";

type LeftPanelConversationListProps = { currentAccountPublicKey: string };
export function LeftPanelConversationList({ currentAccountPublicKey }: LeftPanelConversationListProps) {
  const { theme } = React.useContext(StyleContext);
  const navigationStack = React.useContext(NavigationContext);
  const account = FrontendFacade.useAccountByPublicKey(currentAccountPublicKey);
  const conversationsCount = FrontendFacade.useConversationsListSize(currentAccountPublicKey) ?? 0;
  const onConversation = (otherPublicKey: string) => {
    navigationStack.push({ screen: "conversation", otherPublicKey });
  };
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        height: 100%;
      `}
    >
      <div
        css={css`
          display: grid;
          grid-auto-flow: row;
          grid-auto-columns: auto;
          padding: ${theme.spacing.text.vertical} ${theme.spacing.text.horizontal};
          border-bottom: 1px solid ${theme.colors.background.active};
        `}
      >
        <Text color="primary" size="normal" weight="bold" text={account?.name ?? "..."} />
        <Text color="secondary" size="normal" weight="normal" text={currentAccountPublicKey} />
      </div>
      <Virtuoso
        style={{ flexGrow: 1 }}
        totalCount={conversationsCount}
        itemContent={(index) => (
          <ConversationLisItem index={index} myPublicKey={currentAccountPublicKey} onConversation={onConversation} />
        )}
      />
    </div>
  );
}
