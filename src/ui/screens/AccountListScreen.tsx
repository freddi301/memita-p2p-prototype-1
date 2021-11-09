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

type AccountListScreenProps = {
  onCreate(): void;
  onHome(): void;
  onAccount(publicKey: string): void;
};
export function AccountListScreen({ onCreate, onHome, onAccount }: AccountListScreenProps) {
  const accountCount = FrontendFacade.useAccountListSize() ?? 0;
  return (
    <HeaderContentControlsLayout
      header={<Text text="Accounts" color="primary" weight="bold" size="big" />}
      content={
        <Virtuoso
          style={{ height: "100%" }}
          totalCount={accountCount}
          itemContent={(index) => <AccountItem index={index} onAccount={onAccount} />}
        />
      }
      controls={
        <ButtonGroup>
          <Button label="Home" icon={<Icon icon="Home" />} onClick={onHome} enabled={true} />
          <Button label="Import" icon={<Icon icon="Import" />} onClick={() => {}} enabled={false} />
          <Button label="Create" icon={<Icon icon="CreateAccount" />} onClick={onCreate} enabled={true} />
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
  if (!account) return null;
  const { publicKey, name } = account;
  return (
    <Clickable onClick={() => onAccount(publicKey)}>
      <div
        css={css`
          display: grid;
          grid-auto-flow: row;
          grid-auto-columns: auto;
          padding: ${theme.spacing.text.vertical} ${theme.spacing.text.horizontal};
        `}
      >
        <Text color="primary" size="normal" weight="bold" text={name} />
        <Text color="secondary" size="normal" weight="normal" text={publicKey} />
      </div>
    </Clickable>
  );
}
