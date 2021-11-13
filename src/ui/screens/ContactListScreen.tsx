import React from "react";
import { Button } from "../components/Button";
import { HeaderContentControlsLayout } from "../components/HeaderContentControlsLayout";
import { Text } from "../components/Text";
import { Virtuoso } from "react-virtuoso";
import { Clickable } from "../components/Clickable";
import { Icon } from "../components/Icon";
import { ButtonGroup } from "../components/ButtonGroup";
import { css } from "styled-components/macro";
import { StyleContext } from "../StyleProvider";
import { FrontendFacade } from "../../logic/FrontendFacade";
import { NavigationContext } from "../NavigationStack";

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
      header={<Text text="Contacts" color="primary" weight="bold" size="big" />}
      content={
        <Virtuoso
          style={{ height: "100%" }}
          totalCount={contactCount}
          itemContent={(index) => <ContactItem index={index} onContact={onContact} />}
        />
      }
      controls={
        <ButtonGroup>
          <Button label="Create" icon={<Icon icon="Create" />} onClick={onCreate} enabled={true} />
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
