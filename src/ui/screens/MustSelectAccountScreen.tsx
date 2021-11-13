import React from "react";
import { NavigationContext } from "../NavigationStack";
import { HeaderContentControlsLayout } from "../components/HeaderContentControlsLayout";
import { ButtonGroup } from "../components/ButtonGroup";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { Text } from "../components/Text";

export function MustSelectAccountScreen() {
  const navigationStack = React.useContext(NavigationContext);
  const onAccounts = () => {
    navigationStack.push({ screen: "account-list" });
  };
  return (
    <HeaderContentControlsLayout
      header={<Text text="Need to select account" color="primary" weight="bold" size="big" />}
      content={null}
      controls={
        <ButtonGroup>
          <Button icon={<Icon icon="Account" />} enabled={true} label="Accounts" onClick={onAccounts} />
        </ButtonGroup>
      }
    />
  );
}
