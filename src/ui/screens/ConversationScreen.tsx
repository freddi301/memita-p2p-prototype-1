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
import { FrontendFacade } from "../../logic/FrontendFacade";

type ConversationScreenProps = {
  myPublicKey: string;
  otherPublicKey: string;
  onHome(): void;
  onContact(publicKey: string): void;
};
export function ConversationScreen({ myPublicKey, otherPublicKey, onHome, onContact }: ConversationScreenProps) {
  const { theme } = React.useContext(StyleContext);
  const [text, setText] = React.useState("");
  const conversationCount = FrontendFacade.useConversationListSize(myPublicKey, otherPublicKey) ?? 0;
  const onSend = React.useCallback(() => {
    FrontendFacade.doMessage(myPublicKey, otherPublicKey, new Date().getTime(), text);
    setText("");
  }, [myPublicKey, otherPublicKey, text]);
  const me = FrontendFacade.useAccountByPublicKey(myPublicKey);
  const other = FrontendFacade.useContactByPublicKey(otherPublicKey);
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
            totalCount={conversationCount}
            itemContent={(index) => (
              <ConversationItem
                index={index}
                myPublicKey={myPublicKey}
                myName={me?.name ?? ""}
                otherPublicKey={otherPublicKey}
                otherName={other?.name ?? ""}
              />
            )}
            components={{
              Footer() {
                return (
                  <div
                    css={css`
                      height: calc(${theme.sizes.vertical} + ${theme.spacing.text.vertical} * 2);
                    `}
                  />
                );
              },
            }}
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
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  onSend();
                  event.currentTarget.focus();
                }
              }}
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

type ConversationItemProps = {
  index: number;
  myPublicKey: string;
  myName: string;
  otherPublicKey: string;
  otherName: string;
};
function ConversationItem({ index, myPublicKey, otherPublicKey, myName, otherName }: ConversationItemProps) {
  const { theme } = React.useContext(StyleContext);
  const message = FrontendFacade.useConversationListAtIndex(myPublicKey, otherPublicKey, index);
  const name = message ? (message.senderPublicKey === myPublicKey ? myName : otherName) : "";
  return (
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
          <Text color="primary" size="normal" weight="bold" text={name} />
        </div>
        <div
          css={css`
            grid-row: 1;
            grid-column: 2;
            display: flex;
            align-items: flex-end;
          `}
        >
          <Text
            color="secondary"
            size="small"
            weight="normal"
            text={message ? dateTimeFormatter.format(message.createdAtEpoch) : "..."}
            textAlign="right"
          />
        </div>
        <div
          css={css`
            grid-row: 2;
            grid-column: 1 / span 2;
          `}
        >
          <Text color="primary" size="normal" weight="normal" text={message ? message.text : "..."} />
        </div>
      </div>
    </Clickable>
  );
}

const dateTimeFormatter = Intl.DateTimeFormat([], { dateStyle: "short", timeStyle: "medium" });
