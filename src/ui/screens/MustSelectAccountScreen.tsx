import React from "react";
import { NavigationContext } from "../NavigationStack";
import { HeaderContentControlsLayout } from "../components/HeaderContentControlsLayout";
import { ButtonGroup } from "../components/ButtonGroup";
import { Button } from "../components/Button";
import { Text } from "../components/Text";
import { Virtuoso } from "react-virtuoso";
import { FrontendFacade } from "../FrontendFacade";
import { StyleContext } from "../StyleProvider";
import { Clickable } from "../components/Clickable";
import { css } from "styled-components/macro";
import { EmptyListPlaceholder } from "../components/EmptyListPlaceholder";
import { SimpleHeader } from "../components/SimpleHeader";

type MustSelectAccountScreenProps = {
  onUse(accountPublicKey: string): void;
};
export function MustSelectAccountScreen({ onUse }: MustSelectAccountScreenProps) {
  const navigationStack = React.useContext(NavigationContext);
  const onAccounts = () => {
    navigationStack.push({ screen: "account-list" });
  };
  const accountCount = FrontendFacade.useAccountListSize() ?? 0;
  const onAccount = (publicKey: string) => {
    onUse(publicKey);
  };
  const onCreate = () => {
    navigationStack.push({ screen: "create-account" });
  };
  return (
    <HeaderContentControlsLayout
      header={
        <SimpleHeader>
          <Text text="You must select an account" color="primary" weight="bold" size="big" />
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
          <Button icon="Account" enabled={true} label="Accounts" onClick={onAccounts} showLabel={false} />
          <Button icon="Create" enabled={true} label="Create" onClick={onCreate} showLabel={true} />
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
        <Text color="secondary" size="normal" weight="normal" text={account?.publicKey ?? "..."} />
      </div>
    </Clickable>
  );
}
