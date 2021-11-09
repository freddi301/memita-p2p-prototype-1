import React from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Textarea } from "../components/Textarea";
import { HeaderContentControlsLayout } from "../components/HeaderContentControlsLayout";
import { Text } from "../components/Text";
import { Icon } from "../components/Icon";
import { ButtonGroup } from "../components/ButtonGroup";
import { css } from "styled-components/macro";
import { StyleContext } from "../StyleProvider";
import { FrontendFacade } from "../../logic/FrontendFacade";

type ContactScreenProps = {
  publicKey: string;
  onCancel(): void;
  onConversation(): void;
};

export function ContactScreen({ publicKey, onCancel, onConversation }: ContactScreenProps) {
  const { theme } = React.useContext(StyleContext);
  const [name, setName] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const contact = FrontendFacade.useContactByPublicKey(publicKey);
  const [isLoaded, setIsLoaded] = React.useState(false);
  React.useEffect(() => {
    if (!isLoaded && contact) {
      setName(contact.name);
      setNotes(contact.notes);
      setIsLoaded(true);
    }
  }, [contact, isLoaded]);
  const onSave = React.useCallback(() => {
    FrontendFacade.doUpdateContact(publicKey, name, notes);
  }, [name, notes, publicKey]);
  const onDelete = React.useCallback(() => {
    FrontendFacade.doDeleteContact(publicKey, name, notes);
    onCancel();
  }, [name, notes, onCancel, publicKey]);
  return (
    <HeaderContentControlsLayout
      header={<Text text="Contact" color="primary" weight="bold" size="big" />}
      content={
        <div
          css={css`
            display: grid;
            grid-auto-flow: row;
            grid-auto-columns: auto;
            padding: ${theme.spacing.text.vertical} ${theme.spacing.text.horizontal};
            row-gap: ${theme.spacing.gap};
          `}
        >
          <Input label="Name" value={name} onChange={setName} />
          <Textarea label="Notes" value={notes} onChange={setNotes} rows={5} />
          <Input label="Public Key" value={publicKey} />
        </div>
      }
      controls={
        <ButtonGroup>
          <Button label="Delete" icon={<Icon icon="DeleteContact" />} onClick={onDelete} enabled={isLoaded} />
          <Button label="Share" icon={<Icon icon="Share" />} onClick={() => {}} enabled={true} />
          <Button label="Back" icon={<Icon icon="Cancel" />} onClick={onCancel} enabled={true} />
          <Button label="Save" icon={<Icon icon="Save" />} onClick={onSave} enabled={isLoaded} />
          <Button label="Conversation" icon={<Icon icon="Conversation" />} onClick={onConversation} enabled={true} />
        </ButtonGroup>
      }
    />
  );
}
