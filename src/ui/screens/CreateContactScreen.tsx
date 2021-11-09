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

type CreateContactScreenProps = {
  onCancel(): void;
  onContact(publickKey: string): void;
};

export function CreateContactScreen({ onCancel, onContact }: CreateContactScreenProps) {
  const { theme } = React.useContext(StyleContext);
  const [publicKey, setPublicKey] = React.useState("");
  const [name, setName] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const onCreate = React.useCallback(() => {
    FrontendFacade.doUpdateContact(publicKey, name, notes);
    onContact(publicKey);
  }, [publicKey, name, notes, onContact]);
  return (
    <HeaderContentControlsLayout
      header={<Text text="Create Contact" color="primary" weight="bold" size="big" />}
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
          <Textarea label="Public Key" value={publicKey} onChange={setPublicKey} rows={5} />
        </div>
      }
      controls={
        <ButtonGroup>
          <Button label="Cancel" icon={<Icon icon="Cancel" />} onClick={onCancel} enabled={true} />
          <Button label="Create" icon={<Icon icon="CreateAccount" />} onClick={onCreate} enabled={true} />
        </ButtonGroup>
      }
    />
  );
}
