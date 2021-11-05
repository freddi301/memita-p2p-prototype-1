import React from "react";
import { StackLayout } from "../components/StackLayout";
import { Text } from "../components/Text";
import { Clickable } from "../components/Clickable";

type HomeScreenProps = {
  onAccounts(): void;
};
export function HomeScreen({ onAccounts }: HomeScreenProps) {
  return (
    <StackLayout type="vertical" align="start" gap={false} padding={false}>
      <Clickable onClick={onAccounts}>
        <StackLayout type="vertical" align="start" gap={true} padding={true}>
          <Text color="primary" size="normal" weight="normal" text="Accounts" />
        </StackLayout>
      </Clickable>
    </StackLayout>
  );
}
