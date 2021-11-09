import React from "react";
import { Button } from "../components/Button";
import { HeaderContentControlsLayout } from "../components/HeaderContentControlsLayout";
import { Text } from "../components/Text";
import { Virtuoso } from "react-virtuoso";
import { Clickable } from "../components/Clickable";
import { Icon } from "../components/Icon";
import { Textarea } from "../components/Textarea";
import { css } from "styled-components/macro";
import { StyleContext } from "../StyleProvider";
import { ButtonGroup } from "../components/ButtonGroup";

type ConversationScreenProps = {
  onSend(): void;
  onHome(): void;
  onContact(publicKey: string): void;
};
export function ConversationScreen({ onSend, onHome, onContact }: ConversationScreenProps) {
  const { theme } = React.useContext(StyleContext);
  const [text, setText] = React.useState("");
  return (
    <HeaderContentControlsLayout
      header={<Text text="Conversation" color="primary" weight="bold" size="big" />}
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
              <Clickable onClick={() => {}}>
                <div
                  css={css`
                    display: grid;
                    grid-template-columns: 1fr auto;
                    grid-template-rows: auto auto;
                    padding: ${theme.spacing.text.vertical} ${theme.spacing.text.horizontal};
                  `}
                >
                  <div
                    css={css`
                      grid-row: 1;
                      grid-column: 1;
                    `}
                  >
                    <Text color="primary" size="normal" weight="bold" text={`Contact Name`} />
                  </div>
                  <div
                    css={css`
                      grid-row: 1;
                      grid-column: 2;
                    `}
                  >
                    <Text color="secondary" size="normal" weight="normal" text={`2021`} />
                  </div>
                  <div
                    css={css`
                      grid-row: 2;
                      grid-column: 1 / span 2;
                    `}
                  >
                    <Text
                      color="primary"
                      size="normal"
                      weight="normal"
                      text={`Message content ${index}\nMessage content ${index}\nMessage content ${index}`}
                    />
                  </div>
                </div>
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
        <ButtonGroup>
          <Button label="Home" icon={<Icon icon="Home" />} onClick={onHome} enabled={true} />
        </ButtonGroup>
      }
    />
  );
}
