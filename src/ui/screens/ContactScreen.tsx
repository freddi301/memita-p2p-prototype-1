import React from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Textarea } from "../components/Textarea";
import { HeaderContentControlsLayout } from "../components/HeaderContentControlsLayout";
import { StackLayout } from "../components/StackLayout";
import { Text } from "../components/Text";
import { Icon } from "../components/Icon";

type ContactScreenProps = {
  onCancel(): void;
  onConversation(): void;
};

export function ContactScreen({
  onCancel,
  onConversation,
}: ContactScreenProps) {
  const [name, setName] = React.useState("");
  const [notes, setNotes] = React.useState("");
  return (
    <HeaderContentControlsLayout
      header={
        <StackLayout type="horizontal" align="start" gap={true} padding={true}>
          <Text text="Contact" color="primary" weight="bold" size="big" />
        </StackLayout>
      }
      content={
        <StackLayout type="vertical" align="start" gap={true} padding={true}>
          <Input label="Name" value={name} onChange={setName} />
          <StackLayout
            type="horizontal"
            align="start"
            gap={true}
            padding={false}
          >
            <Text
              color="secondary"
              size="normal"
              weight="normal"
              text="Public Key"
            />
            <Text
              color="primary"
              size="normal"
              weight="normal"
              text="xxxxxxxxxx"
            />
          </StackLayout>
          <Textarea label="Notes" value={notes} onChange={setNotes} rows={5} />
        </StackLayout>
      }
      controls={
        <StackLayout type="horizontal" align="end" gap={true} padding={true}>
          <Button
            label="Share"
            icon={<Icon icon="Share" />}
            onClick={() => {}}
            enabled={true}
          />
          <Button
            label="Back"
            icon={<Icon icon="Cancel" />}
            onClick={onCancel}
            enabled={true}
          />
          <Button
            label="Save"
            icon={<Icon icon="Save" />}
            onClick={() => {}}
            enabled={false}
          />
          <Button
            label="Conversation"
            icon={<Icon icon="Conversation" />}
            onClick={onConversation}
            enabled={true}
          />
        </StackLayout>
      }
    />
  );
}
