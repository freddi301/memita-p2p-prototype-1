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

type ContactListScreenProps = {
  onCreate(): void;
  onHome(): void;
  onContact(publicKey: string): void;
};
export function ContactListScreen({ onCreate, onHome, onContact }: ContactListScreenProps) {
  const contactCount = FrontendFacade.useContactListSize() ?? 0;
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
          <Button label="Home" icon={<Icon icon="Home" />} onClick={onHome} enabled={true} />
          <Button label="Create" icon={<Icon icon="CreateAccount" />} onClick={onCreate} enabled={true} />
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
  if (!contact) return null;
  const { publicKey, name } = contact;
  return (
    <Clickable onClick={() => onContact(publicKey)}>
      <div
        css={css`
          display: grid;
          grid-auto-flow: row;
          grid-auto-columns: auto;
          padding: ${theme.spacing.text.vertical} ${theme.spacing.text.horizontal};
        `}
      >
        <Text color="primary" size="normal" weight="bold" text={name} />
        <Text color="secondary" size="normal" weight="normal" text={publicKey} />
      </div>
    </Clickable>
  );
}
