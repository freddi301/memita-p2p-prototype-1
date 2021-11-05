import React from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Textarea } from "../components/Textarea";
import { HeaderContentControlsLayout } from "../components/HeaderContentControlsLayout";
import { StackLayout } from "../components/StackLayout";
import { Text } from "../components/Text";
import { Icon } from "../components/Icon";

type CreateContactScreenProps = {
  onCancel(): void;
};

export function CreateContactScreen({ onCancel }: CreateContactScreenProps) {
  const [name, setName] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [publicKey, setPublicKey] = React.useState("");
  return (
    <HeaderContentControlsLayout
      header={
        <StackLayout type="horizontal" align="start" gap={true} padding={true}>
          <Text
            text="Create Contact"
            color="primary"
            weight="bold"
            size="big"
          />
        </StackLayout>
      }
      content={
        <StackLayout type="vertical" align="start" gap={true} padding={true}>
          <Input label="Name" value={name} onChange={setName} />
          <Textarea label="Notes" value={notes} onChange={setNotes} rows={5} />
          <Textarea
            label="Public Key"
            value={publicKey}
            onChange={setPublicKey}
            rows={5}
          />
        </StackLayout>
      }
      controls={
        <StackLayout type="horizontal" align="end" gap={true} padding={true}>
          <Button
            label="Cancel"
            icon={<Icon icon="Cancel" />}
            onClick={onCancel}
            enabled={true}
          />
          <Button
            label="Create Account"
            icon={<Icon icon="CreateAccount" />}
            onClick={() => {}}
            enabled={true}
          />
        </StackLayout>
      }
    />
  );
}
