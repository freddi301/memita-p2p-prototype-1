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

type SelectContactScreenProps = {
  onSelect(accountPublicKey: string): void;
};
export function SelectContactScreen({ onSelect }: SelectContactScreenProps) {
  const navigationStack = React.useContext(NavigationContext);
  const onContacts = () => {
    navigationStack.push({ screen: "contact-list" });
  };
  const accountCount = FrontendFacade.useContactListSize() ?? 0;
  const onContact = (publicKey: string) => {
    onSelect(publicKey);
  };
  const onCreate = () => {
    navigationStack.push({ screen: "create-contact" });
  };
  return (
    <HeaderContentControlsLayout
      header={
        <SimpleHeader>
          <Text text="Select a contact" color="primary" weight="bold" size="big" />
        </SimpleHeader>
      }
      content={
        !accountCount ? (
          <EmptyListPlaceholder>No contacts</EmptyListPlaceholder>
        ) : (
          <Virtuoso
            style={{ height: "100%" }}
            totalCount={accountCount}
            itemContent={(index) => <ContactItem index={index} onContact={onContact} />}
          />
        )
      }
      controls={
        <ButtonGroup>
          <Button icon="Contacts" enabled={true} label="Contacts" onClick={onContacts} showLabel={false} />
          <Button icon="Create" enabled={true} label="Create" onClick={onCreate} showLabel={true} />
        </ButtonGroup>
      }
    />
  );
}

type ContactItemProps = {
  index: number;
  onContact(publicKey: string): void;
};
function ContactItem({ index, onContact }: ContactItemProps) {
  const { theme } = React.useContext(StyleContext);
  const account = FrontendFacade.useContactListAtIndex(index);
  return (
    <Clickable
      onClick={() => {
        if (account) {
          onContact(account.publicKey);
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
        <Text color="secondary" size="normal" weight="normal" text={account?.publicKey ?? "..."} truncatedLine={true} />
      </div>
    </Clickable>
  );
}
