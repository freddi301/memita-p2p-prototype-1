import React from "react";
import { Text } from "../components/Text";
import { HeaderContentControlsLayout } from "../components/HeaderContentControlsLayout";
import { Button } from "../components/Button";
import { ButtonGroup } from "../components/ButtonGroup";
import { NavigationContext } from "../NavigationStack";
import { FrontendFacade } from "../FrontendFacade";
import { css } from "styled-components/macro";
import { StyleContext } from "../StyleProvider";
import { selectFiles } from "../../other/fileDialog/fileDialog";

type HomeScreenProps = {};
export function HomeScreen(props: HomeScreenProps) {
  const { theme } = React.useContext(StyleContext);
  const navigationStack = React.useContext(NavigationContext);
  const accountCount = FrontendFacade.useAccountListSize();
  const contactsCount = FrontendFacade.useContactListSize();
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
      header={null}
      content={
        <div
          css={css`
            display: grid;
            grid-auto-flow: row;
            grid-auto-rows: auto;
            grid-row-gap: ${theme.spacing.gap};
          `}
        >
          {accountCount === 0 && <CreateAccountHint />}
          {contactsCount === 0 && <AddContactHint />}
        </div>
      }
      controls={
        <ButtonGroup>
          <Button
            icon="Conversations"
            enabled={true}
            label="Conversations"
            onClick={onConversations}
            showLabel={false}
          />
          <Button icon="Contacts" enabled={true} label="Contacts" onClick={onContacts} showLabel={false} />
          <Button icon="Account" enabled={true} label="Accounts" onClick={onAccounts} showLabel={false} />
        </ButtonGroup>
      }
    />
  );
}

function CreateAccountHint() {
  const { theme } = React.useContext(StyleContext);
  const navigationStack = React.useContext(NavigationContext);
  const onCreate = () => {
    navigationStack.push({ screen: "create-account" });
  };
  return (
    <div
      css={css`
        display: grid;
        grid-row-gap: ${theme.spacing.text.vertical};
        grid-auto-flow: row;
        grid-auto-rows: auto;
        padding: ${theme.spacing.text.vertical} ${theme.spacing.text.horizontal};
      `}
    >
      <div>
        <Text color="primary" size="normal" weight="normal" text="You don't have any accounts on this device" />
      </div>
      <div
        css={css`
          display: grid;
          grid-auto-flow: column;
          grid-column-gap: ${theme.spacing.text.horizontal};
        `}
      >
        <Button label="Login" icon="Import" onClick={() => {}} enabled={false} showLabel={true} />
        <Button label="Signup" icon="Create" onClick={onCreate} enabled={true} showLabel={true} />
      </div>
    </div>
  );
}

function AddContactHint() {
  const { theme } = React.useContext(StyleContext);
  const navigationStack = React.useContext(NavigationContext);
  const onCreate = () => {
    navigationStack.push({ screen: "create-contact" });
  };
  return (
    <div
      css={css`
        display: grid;
        grid-row-gap: ${theme.spacing.text.vertical};
        grid-auto-flow: row;
        grid-auto-rows: auto;
        padding: ${theme.spacing.text.vertical} ${theme.spacing.text.horizontal};
      `}
    >
      <div>
        <Text color="primary" size="normal" weight="normal" text="You don't have any contacts on this device" />
      </div>
      <div
        css={css`
          display: grid;
          grid-auto-flow: column;
          grid-column-gap: ${theme.spacing.text.horizontal};
        `}
      >
        <Button label="AddContact" icon="Create" onClick={onCreate} enabled={true} showLabel={true} />
      </div>
    </div>
  );
}
