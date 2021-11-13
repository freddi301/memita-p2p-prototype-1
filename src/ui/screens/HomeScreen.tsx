import React from "react";
import { Text } from "../components/Text";
import { Icon } from "../components/Icon";
import { HeaderContentControlsLayout } from "../components/HeaderContentControlsLayout";
import { Button } from "../components/Button";
import { ButtonGroup } from "../components/ButtonGroup";
import { NavigationContext } from "../NavigationStack";

type HomeScreenProps = {};
export function HomeScreen(props: HomeScreenProps) {
  const navigationStack = React.useContext(NavigationContext);
  const onContacts = () => {
    navigationStack.push({ screen: "contact-list" });
  };
  const onAccounts = () => {
    navigationStack.push({ screen: "account-list" });
  };
  const onConversations = () => {
    navigationStack.push({ screen: "conversation-list" });
  };
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
