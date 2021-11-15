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

type CreateAccountScreenProps = {};

export function CreateAccountScreen(props: CreateAccountScreenProps) {
  const navigationStack = React.useContext(NavigationContext);
  const { theme } = React.useContext(StyleContext);
  const [name, setName] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const onCreate = () => {
    FrontendFacade.doCreateAccount(name, notes);
    navigationStack.pop();
  };
  return (
    <HeaderContentControlsLayout
      header={
        <SimpleHeader>
          <Text text="Create Account" color="primary" weight="bold" size="big" />
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
          <Input label="Name" value={name} onChange={setName} />
          <Textarea label="Notes" value={notes} onChange={setNotes} rows={5} />
        </div>
      }
      controls={
        <ButtonGroup>
          <Button label="Create" icon="Save" onClick={onCreate} enabled={true} showLabel={false} />
        </ButtonGroup>
      }
    />
  );
}
