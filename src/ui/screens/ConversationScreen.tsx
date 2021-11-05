import React from "react";
import { Button } from "../components/Button";
import { HeaderContentControlsLayout } from "../components/HeaderContentControlsLayout";
import { StackLayout } from "../components/StackLayout";
import { Text } from "../components/Text";
import { Virtuoso } from "react-virtuoso";
import { Clickable } from "../components/Clickable";
import { Icon } from "../components/Icon";
import { Textarea } from "../components/Textarea";
import { css } from "styled-components/macro";
import { StyleContext } from "../StyleProvider";

type ConversationScreenProps = {
  onSend(): void;
  onHome(): void;
  onContact(): void;
};
export function ConversationScreen({ onSend, onHome, onContact }: ConversationScreenProps) {
  const { theme } = React.useContext(StyleContext);
  const [text, setText] = React.useState("");
  return (
    <HeaderContentControlsLayout
      header={
        <StackLayout type="vertical" align="start" gap={true} padding={true}>
          <Text text="Conversation" color="primary" weight="bold" size="big" />
        </StackLayout>
      }
      content={
        <div
          css={css`
            height: 100%;
            position: relative;
          `}
        >
          <Virtuoso
            style={{ height: "100%" }}
            totalCount={200}
            itemContent={(index) => (
              <Clickable onClick={onContact}>
                <StackLayout type="vertical" align="start" gap={false} padding={true}>
                  <StackLayout type="horizontal" align="start" gap={false} padding={false}>
                    <Text color="primary" size="normal" weight="bold" text={`Contact Name`} />
                    <Text color="secondary" size="normal" weight="normal" text={`2021`} />
                  </StackLayout>
                  <Text
                    color="primary"
                    size="normal"
                    weight="normal"
                    text={`Message content ${index}\nMessage content ${index}\nMessage content ${index}`}
                  />
                </StackLayout>
              </Clickable>
            )}
          />
          <div
            css={css`
              position: absolute;
              width: 100%;
              bottom: 0px;
              padding-top: ${theme.spacing.text.vertical};
              padding-bottom: ${theme.spacing.text.vertical};
              padding-left: ${theme.spacing.text.horizontal};
              padding-right: ${theme.spacing.text.horizontal};
              box-sizing: border-box;
            `}
          >
            <Textarea
              value={text}
              onChange={setText}
              rows={text.split("\n").length}
              actions={<Button label="Send" icon={<Icon icon="Send" />} onClick={onSend} enabled={false} />}
            />
          </div>
        </div>
      }
      controls={
        <StackLayout type="horizontal" align="end" gap={true} padding={true}>
          <Button label="Home" icon={<Icon icon="Home" />} onClick={onHome} enabled={true} />
        </StackLayout>
      }
    />
  );
}
