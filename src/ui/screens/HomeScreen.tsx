import React from "react";
import { StackLayout } from "../components/StackLayout";
import { Text } from "../components/Text";
import { Clickable } from "../components/Clickable";
import { Icon } from "../components/Icon";
import { HeaderContentControlsLayout } from "../components/HeaderContentControlsLayout";
import { Button } from "../components/Button";

type HomeScreenProps = {
  onAccounts(): void;
  onContacts(): void;
};
export function HomeScreen({ onAccounts, onContacts }: HomeScreenProps) {
  return (
    <HeaderContentControlsLayout
      header={
        <StackLayout type="horizontal" align="start" gap={true} padding={true}>
          <Text text="Home" color="primary" weight="bold" size="big" />
        </StackLayout>
      }
      content={null}
      controls={
        <StackLayout type="horizontal" align="end" gap={true} padding={true}>
          <Button
            icon={<Icon icon="Account" />}
            enabled={true}
            label="Accounts"
            onClick={onAccounts}
          />
          <Button
            icon={<Icon icon="Contacts" />}
            enabled={true}
            label="Contacts"
            onClick={onContacts}
          />
        </StackLayout>
      }
    />
  );
}
