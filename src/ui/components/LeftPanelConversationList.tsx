import React from "react";
import { StyleContext } from "../StyleProvider";
import { FrontendFacade } from "../FrontendFacade";
import { ConversationLisItem } from "../screens/ConversationListScreen";
import { css } from "styled-components/macro";
import { Virtuoso } from "react-virtuoso";
import { NavigationContext } from "../NavigationStack";
import { Text } from "./Text";
import { Clickable } from "./Clickable";
import { EmptyListPlaceholder } from "./EmptyListPlaceholder";

type LeftPanelConversationListProps = { currentAccountPublicKey: string };
export function LeftPanelConversationList({ currentAccountPublicKey }: LeftPanelConversationListProps) {
  const { theme } = React.useContext(StyleContext);
  const navigationStack = React.useContext(NavigationContext);
  const account = FrontendFacade.useAccountByPublicKey(currentAccountPublicKey);
  const conversationsCount = FrontendFacade.useConversationsListSize(currentAccountPublicKey) ?? 0;
  const onConversation = (otherPublicKey: string) => {
    navigationStack.push({ screen: "conversation", otherPublicKey });
  };
  const selectAccount = () => {
    navigationStack.push({ screen: "select-account" });
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
          border-bottom: 1px solid ${theme.colors.background.active};
        `}
      >
        <Clickable onClick={selectAccount}>
          <div
            css={css`
              padding: ${theme.spacing.text.vertical} ${theme.spacing.text.horizontal};
              height: calc(${theme.sizes.vertical} + ${theme.spacing.text.vertical} * 2);
              box-sizing: border-box;
              align-items: center;
            `}
          >
            <Text color="primary" size="normal" weight="bold" text={account?.name ?? "..."} />
            <Text color="secondary" size="normal" weight="normal" text={currentAccountPublicKey} />
          </div>
        </Clickable>
      </div>
      {!conversationsCount ? (
        <EmptyListPlaceholder>No conversations</EmptyListPlaceholder>
      ) : (
        <Virtuoso
          style={{ flexGrow: 1 }}
          totalCount={conversationsCount}
          itemContent={(index) => (
            <ConversationLisItem index={index} myPublicKey={currentAccountPublicKey} onConversation={onConversation} />
          )}
        />
      )}
    </div>
  );
}
