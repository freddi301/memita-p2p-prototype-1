import React from "react";
import { Button } from "../components/Button";
import { HeaderContentControlsLayout } from "../components/HeaderContentControlsLayout";
import { StackLayout } from "../components/StackLayout";
import { Text } from "../components/Text";
import { StyleContext } from "../StyleProvider";
import { Virtuoso } from "react-virtuoso";

type AccountListScreenProps = {
  onCreate(): void;
};
export function AccountListScreen({ onCreate }: AccountListScreenProps) {
  const { theme } = React.useContext(StyleContext);
  return (
    <HeaderContentControlsLayout
      header={
        <StackLayout type="vertical" align="start" gap={true}>
          <Text text="Accounts" color="primary" weight="bold" size="big" />
        </StackLayout>
      }
      content={
        <Virtuoso
          style={{ height: "100%" }}
          totalCount={200}
          itemContent={(index) => (
            <StackLayout type="vertical" align="start" gap={false}>
              <Text
                color="primary"
                size="normal"
                weight="bold"
                text={`User${index}`}
              />
              <Text
                color="secondary"
                size="normal"
                weight="normal"
                text={`Utente${index}`}
              />
            </StackLayout>
          )}
        />
      }
      controls={
        <StackLayout type="horizontal" align="end" gap={true}>
          <Button
            label="Create Account"
            icon={theme.icons.CreateAccount}
            onClick={onCreate}
          />
          <Button label="Home" icon={theme.icons.Home} onClick={() => {}} />
        </StackLayout>
      }
    />
  );
}
