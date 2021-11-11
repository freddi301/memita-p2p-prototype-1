import React from "react";
import { Text } from "../components/Text";
import { Icon } from "../components/Icon";
import { HeaderContentControlsLayout } from "../components/HeaderContentControlsLayout";
import { Button } from "../components/Button";
import { ButtonGroup } from "../components/ButtonGroup";

type HomeScreenProps = {
  onAccounts(): void;
  onContacts(): void;
  onConversations(): void;
};
export function HomeScreen({ onAccounts, onContacts, onConversations }: HomeScreenProps) {
  return (
    <HeaderContentControlsLayout
      header={<Text text="Home" color="primary" weight="bold" size="big" />}
      content={null}
      controls={
        <ButtonGroup>
          <Button icon={<Icon icon="Conversations" />} enabled={true} label="Conversations" onClick={onConversations} />
          <Button icon={<Icon icon="Contacts" />} enabled={true} label="Contacts" onClick={onContacts} />
          <Button icon={<Icon icon="Account" />} enabled={true} label="Accounts" onClick={onAccounts} />
        </ButtonGroup>
      }
    />
  );
}
