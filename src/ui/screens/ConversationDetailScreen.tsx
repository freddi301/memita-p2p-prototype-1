import React from "react";
import { HeaderContentControlsLayout } from "../components/HeaderContentControlsLayout";
import { SimpleHeader } from "../components/SimpleHeader";
import { Text } from "../components/Text";

type ConversationDetailScreenProps = {
  myPublicKey: string;
  otherPublicKey: string;
};
export function ConversationDetailScreen({ myPublicKey, otherPublicKey }: ConversationDetailScreenProps) {
  return (
    <HeaderContentControlsLayout
      header={
        <SimpleHeader>
          <Text color="primary" size="big" weight="normal" text="Conversation Detail" />
        </SimpleHeader>
      }
      content={null}
      controls={null}
    />
  );
}
