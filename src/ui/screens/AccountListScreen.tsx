import React from "react";
import { Button } from "../components/Button";
import { HeaderContentControlsLayout } from "../components/HeaderContentControlsLayout";
import { Text } from "../components/Text";
import { Virtuoso } from "react-virtuoso";
import { Clickable } from "../components/Clickable";
import { ButtonGroup } from "../components/ButtonGroup";
import { css } from "styled-components/macro";
import { StyleContext } from "../StyleProvider";
import { FrontendFacade } from "../FrontendFacade";
import { NavigationContext } from "../NavigationStack";
import { EmptyListPlaceholder } from "../components/EmptyListPlaceholder";
import { SimpleHeader } from "../components/SimpleHeader";

type AccountListScreenProps = {};
export function AccountListScreen(props: AccountListScreenProps) {
  const navigationStack = React.useContext(NavigationContext);
  const accountCount = FrontendFacade.useAccountListSize() ?? 0;
  const onAccount = (publicKey: string) => {
    navigationStack.push({ screen: "account", publicKey });
  };
  const onCreate = () => {
    navigationStack.push({ screen: "create-account" });
  };
  return (
    <HeaderContentControlsLayout
      header={
        <SimpleHeader>
          <Text text="Accounts" color="primary" weight="bold" size="big" />
        </SimpleHeader>
      }
      content={
        !accountCount ? (
          <EmptyListPlaceholder>No accounts</EmptyListPlaceholder>
        ) : (
          <Virtuoso
            style={{ height: "100%" }}
            totalCount={accountCount}
            itemContent={(index) => <AccountItem index={index} onAccount={onAccount} />}
          />
        )
      }
      controls={
        <ButtonGroup>
          <Button label="Import" icon="Import" onClick={() => {}} enabled={false} showLabel={true} />
          <Button label="Create" icon="Create" onClick={onCreate} enabled={true} showLabel={false} />
        </ButtonGroup>
      }
    />
  );
}

type AccountItemProps = {
  index: number;
  onAccount(publicKey: string): void;
};
function AccountItem({ index, onAccount }: AccountItemProps) {
  const { theme } = React.useContext(StyleContext);
  const account = FrontendFacade.useAccountListAtIndex(index);
  return (
    <Clickable
      onClick={() => {
        if (account) {
          onAccount(account.publicKey);
        }
      }}
    >
      <div
        css={css`
          display: grid;
          grid-auto-flow: row;
          grid-auto-columns: auto;
          padding: ${theme.spacing.text.vertical} ${theme.spacing.text.horizontal};
        `}
      >
        <Text color="primary" size="normal" weight="bold" text={account?.name ?? "..."} />
        <Text color="secondary" size="normal" weight="normal" text={account?.publicKey ?? "..."} truncatedLine={true} />
      </div>
    </Clickable>
  );
}
