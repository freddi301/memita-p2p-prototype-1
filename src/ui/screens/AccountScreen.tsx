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

type AccountScreenProps = {
  onCancel(): void;
};

export function AccountScreen({ onCancel }: AccountScreenProps) {
  const { theme } = React.useContext(StyleContext);
  const [name, setName] = React.useState("");
  const [notes, setNotes] = React.useState("");
  return (
    <HeaderContentControlsLayout
      header={<Text text="Account" color="primary" weight="bold" size="big" />}
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
          <Input label="Public Key" value={"xxx"} onChange={() => {}} />
          <Textarea label="Notes" value={notes} onChange={setNotes} rows={5} />
        </div>
      }
      controls={
        <ButtonGroup>
          <Button label="Share" icon={<Icon icon="Share" />} onClick={() => {}} enabled={true} />
          <Button label="Export" icon={<Icon icon="Export" />} onClick={() => {}} enabled={true} />
          <Button label="Back" icon={<Icon icon="Cancel" />} onClick={onCancel} enabled={true} />
          <Button label="Save" icon={<Icon icon="Save" />} onClick={() => {}} enabled={false} />
        </ButtonGroup>
      }
    />
  );
}
