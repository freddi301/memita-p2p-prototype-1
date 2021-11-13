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
import { NavigationContext } from "../NavigationStack";

type CreateContactScreenProps = {};

export function CreateContactScreen(props: CreateContactScreenProps) {
  const navigationStack = React.useContext(NavigationContext);
  const { theme } = React.useContext(StyleContext);
  const [publicKey, setPublicKey] = React.useState("");
  const [name, setName] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const onCreate = () => {
    FrontendFacade.doUpdateContact(publicKey, name, notes);
    navigationStack.pop();
  };
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
          <Button label="Create" icon={<Icon icon="Save" />} onClick={onCreate} enabled={true} />
        </ButtonGroup>
      }
    />
  );
}
