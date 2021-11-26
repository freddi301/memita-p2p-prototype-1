import React from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Textarea } from "../components/Textarea";
import { HeaderContentControlsLayout } from "../components/HeaderContentControlsLayout";
import { Text } from "../components/Text";
import { ButtonGroup } from "../components/ButtonGroup";
import { css } from "styled-components/macro";
import { StyleContext } from "../StyleProvider";
import { FrontendFacade } from "../FrontendFacade";
import { NavigationContext } from "../NavigationStack";
import { SimpleHeader } from "../components/SimpleHeader";
import { AccountPublicKey } from "../../other/AccountCryptography";

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
  const canCreate = name.trim().length > 0 && !!tryElse(() => AccountPublicKey.fromHex(publicKey), false);
  return (
    <HeaderContentControlsLayout
      header={
        <SimpleHeader>
          <Text text="Create Contact" color="primary" weight="bold" size="big" />
        </SimpleHeader>
      }
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
          <Input label="Name" value={name} onChange={setName} required />
          <Textarea label="Notes" value={notes} onChange={setNotes} />
          <Textarea label="Public Key" value={publicKey} onChange={setPublicKey} required />
        </div>
      }
      controls={
        <ButtonGroup>
          <Button label="Create" icon="Save" onClick={onCreate} enabled={canCreate} showLabel={false} />
        </ButtonGroup>
      }
    />
  );
}

function tryElse<R, O>(fun: () => R, otherwise: O) {
  try {
    return fun();
  } catch (error) {
    return otherwise;
  }
}
