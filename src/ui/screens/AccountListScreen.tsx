import React from "react";
import { Button } from "../components/Button";
import { HeaderContentControlsLayout } from "../components/HeaderContentControlsLayout";
import { StackLayout } from "../components/StackLayout";
import { Text } from "../components/Text";
import { Virtuoso } from "react-virtuoso";
import { Clickable } from "../components/Clickable";
import { Icon } from "../components/Icon";

type AccountListScreenProps = {
  onCreate(): void;
  onHome(): void;
  onAccount(): void;
};
export function AccountListScreen({
  onCreate,
  onHome,
  onAccount,
}: AccountListScreenProps) {
  return (
    <HeaderContentControlsLayout
      header={
        <StackLayout type="vertical" align="start" gap={true} padding={true}>
          <Text text="Accounts" color="primary" weight="bold" size="big" />
        </StackLayout>
      }
      content={
        <Virtuoso
          style={{ height: "100%" }}
          totalCount={200}
          itemContent={(index) => (
            <Clickable onClick={onAccount}>
              <StackLayout
                type="vertical"
                align="start"
                gap={false}
                padding={true}
              >
                <Text
                  color="primary"
                  size="normal"
                  weight="bold"
                  text={`Account Name ${index}`}
                />
                <Text
                  color="secondary"
                  size="normal"
                  weight="normal"
                  text={`xxxx ${index}`}
                />
              </StackLayout>
            </Clickable>
          )}
        />
      }
      controls={
        <StackLayout type="horizontal" align="end" gap={true} padding={true}>
          <Button
            label="Home"
            icon={<Icon icon="Home" />}
            onClick={onHome}
            enabled={true}
          />
          <Button
            label="Import"
            icon={<Icon icon="Import" />}
            onClick={() => {}}
            enabled={true}
          />
          <Button
            label="Create"
            icon={<Icon icon="CreateAccount" />}
            onClick={onCreate}
            enabled={true}
          />
        </StackLayout>
      }
    />
  );
}
