import React from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Textarea } from "../components/Textarea";
import { HeaderContentControlsLayout } from "../components/HeaderContentControlsLayout";
import { StackLayout } from "../components/StackLayout";
import { Text } from "../components/Text";
import { StyleContext } from "../StyleProvider";

type CreateAccountScreenProps = {
  onCancel(): void;
};

export function CreateAccountScreen({ onCancel }: CreateAccountScreenProps) {
  const [name, setName] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const { theme } = React.useContext(StyleContext);
  return (
    <HeaderContentControlsLayout
      header={
        <StackLayout type="horizontal" align="start" gap={true}>
          <Text
            text="Create Account"
            color="primary"
            weight="bold"
            size="big"
          />
        </StackLayout>
      }
      content={
        <StackLayout type="vertical" align="start" gap={true}>
          <Input label="Name" value={name} onChange={setName} />
          <Textarea label="Notes" value={notes} onChange={setNotes} rows={5} />
        </StackLayout>
      }
      controls={
        <StackLayout type="horizontal" align="end" gap={true}>
          <Button
            label="Create Account"
            icon={theme.icons.CreateAccount}
            onClick={() => {}}
          />
          <Button label="Cancel" icon={theme.icons.Cancel} onClick={onCancel} />
        </StackLayout>
      }
    />
  );
}
