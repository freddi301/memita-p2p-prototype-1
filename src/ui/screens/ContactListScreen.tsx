import React from "react";
import { Button } from "../components/Button";
import { HeaderContentControlsLayout } from "../components/HeaderContentControlsLayout";
import { Text } from "../components/Text";
import { Virtuoso } from "react-virtuoso";
import { Clickable } from "../components/Clickable";
import { ButtonGroup } from "../components/ButtonGroup";
import { css } from "styled-components/macro";
import { StyleContext } from "../StyleProvider";
import { FrontendFacade } from "../FrontendFacade";
import { NavigationContext } from "../NavigationStack";
import { EmptyListPlaceholder } from "../components/EmptyListPlaceholder";
import { SimpleHeader } from "../components/SimpleHeader";

type ContactListScreenProps = {};
export function ContactListScreen(props: ContactListScreenProps) {
  const navigationStack = React.useContext(NavigationContext);
  const contactCount = FrontendFacade.useContactListSize() ?? 0;
  const onContact = (publicKey: string) => {
    navigationStack.push({ screen: "contact", publicKey });
  };
  const onCreate = () => {
    navigationStack.push({ screen: "create-contact" });
  };
  return (
    <HeaderContentControlsLayout
      header={
        <SimpleHeader>
          <Text text="Contacts" color="primary" weight="bold" size="big" />
        </SimpleHeader>
      }
      content={
        !contactCount ? (
          <EmptyListPlaceholder>No Contacts</EmptyListPlaceholder>
        ) : (
          <Virtuoso
            style={{ height: "100%" }}
            totalCount={contactCount}
            itemContent={(index) => <ContactItem index={index} onContact={onContact} />}
          />
        )
      }
      controls={
        <ButtonGroup>
          <Button label="Create" icon="Create" onClick={onCreate} enabled={true} showLabel={false} />
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
  const contact = FrontendFacade.useContactListAtIndex(index);
  return (
    <Clickable
      onClick={() => {
        if (contact) {
          onContact(contact.publicKey);
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
        <Text color="primary" size="normal" weight="bold" text={contact?.name ?? "..."} />
        <Text color="secondary" size="normal" weight="normal" text={contact?.publicKey ?? "..."} />
      </div>
    </Clickable>
  );
}
