import React from "react";
import { Button } from "../components/Button";
import { HeaderContentControlsLayout } from "../components/HeaderContentControlsLayout";
import { Text } from "../components/Text";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { Clickable } from "../components/Clickable";
import { Textarea } from "../components/Textarea";
import { css } from "styled-components/macro";
import { StyleContext } from "../StyleProvider";
import { FrontendFacade } from "../../logic/FrontendFacade";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";

type ConversationScreenProps = {
  myPublicKey: string;
  otherPublicKey: string;
};
export function ConversationScreen({ myPublicKey, otherPublicKey }: ConversationScreenProps) {
  const { theme } = React.useContext(StyleContext);
  const [text, setText] = React.useState("");
  const textRef = React.useRef<HTMLTextAreaElement | null>(null);
  const conversationCount = FrontendFacade.useConversationListSize(myPublicKey, otherPublicKey) ?? 0;
  const onSend = React.useCallback(() => {
    FrontendFacade.doMessage(myPublicKey, otherPublicKey, new Date().getTime(), text);
    setText("");
  }, [myPublicKey, otherPublicKey, text]);
  const me = FrontendFacade.useAccountByPublicKey(myPublicKey);
  const other = FrontendFacade.useContactByPublicKey(otherPublicKey);
  const [isAtBottom, setIsAtBottom] = React.useState(false);
  const virtuosoRef = React.useRef<VirtuosoHandle | null>(null);
  const scrollTo = React.useCallback((index: number) => {
    virtuosoRef.current?.scrollToIndex({ index, behavior: "smooth" });
  }, []);
  const [scrollPosition, setScrollPosition] = useConversationScrollPosition(myPublicKey, otherPublicKey);
  const [showEmojis, setShowEmojis] = React.useState(false);
  return (
    <HeaderContentControlsLayout
      header={
        <div
          css={css`
            display: grid;
            grid-auto-flow: row;
            grid-auto-columns: auto;
            padding: ${theme.spacing.text.vertical} ${theme.spacing.text.horizontal};
          `}
        >
          <Text color="primary" size="normal" weight="bold" text={other?.name ?? "..."} />
          <Text color="secondary" size="normal" weight="normal" text={otherPublicKey} />
        </div>
      }
      content={
        <div
          css={css`
            height: 100%;
            display: flex;
            flex-direction: column;
          `}
        >
          {scrollPosition !== null && (
            <Virtuoso
              ref={virtuosoRef}
              style={{ flexGrow: 1 }}
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
              alignToBottom={true}
              followOutput="smooth"
              atBottomStateChange={setIsAtBottom}
              initialTopMostItemIndex={scrollPosition}
              rangeChanged={(range) => {
                setScrollPosition(range.startIndex);
              }}
              overscan={10}
            />
          )}
          <div
            css={css`
              padding-top: ${theme.spacing.text.vertical};
              padding-bottom: ${theme.spacing.text.vertical};
              padding-left: ${theme.spacing.text.horizontal};
              padding-right: ${theme.spacing.text.horizontal};
              box-sizing: border-box;
            `}
          >
            <div
              css={css`
                position: relative;
              `}
            >
              <div
                css={css`
                  position: absolute;
                  right: ${theme.spacing.text.horizontal};
                  bottom: ${theme.spacing.text.vertical};
                  transition: ${theme.transitions.input};
                  transition-delay: 0.5s;
                  opacity: ${isAtBottom ? 0 : 1};
                `}
              >
                <Button
                  icon="ScrollToBottom"
                  label="Scroll to end"
                  enabled={!isAtBottom}
                  onClick={() => scrollTo(conversationCount + 1)}
                  showLabel={false}
                />
              </div>
              <div
                css={css`
                  position: absolute;
                  bottom: ${theme.spacing.text.vertical};
                  right: 72px;
                  display: flex;
                  flex-direction: column;
                  align-items: flex-end;
                `}
              >
                <Button
                  icon="Emoji"
                  label="Emoji"
                  enabled={true}
                  onClick={() => setShowEmojis((showEmojis) => !showEmojis)}
                  showLabel={false}
                />
                {showEmojis && (
                  <Picker
                    style={{ marginTop: theme.spacing.text.vertical }}
                    theme="dark"
                    native={true}
                    showSkinTones={true}
                    emojiTooltip={true}
                    title="choose skin tone"
                    emoji=""
                    onSelect={(emoji) => {
                      if (textRef.current) {
                        textRef.current.setRangeText(
                          (emoji as any).native,
                          textRef.current.selectionStart,
                          textRef.current.selectionEnd,
                          "end"
                        );
                        textRef.current.focus();
                      }
                    }}
                  />
                )}
              </div>
            </div>
            <Textarea
              value={text}
              onChange={setText}
              rows={text.split("\n").length}
              actions={<Button label="Send" icon="Send" onClick={onSend} enabled={false} showLabel={false} />}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  onSend();
                  event.currentTarget.focus();
                }
              }}
              onBlur={(event) => {
                textRef.current = event.currentTarget;
              }}
            />
          </div>
        </div>
      }
      controls={null}
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

function useConversationScrollPosition(myPublicKey: string, otherPublicKey: string) {
  const preferences = FrontendFacade.usePreferences();
  const rangeRef = React.useRef(0);
  const conversationKey = myPublicKey + otherPublicKey;
  React.useEffect(() => {
    return () => {
      if (preferences) {
        FrontendFacade.doUpdatePreferences({
          ...preferences,
          conversationScrollPosition: {
            ...(preferences.conversationScrollPosition ?? {}),
            [conversationKey]: rangeRef.current,
          },
        });
      }
    };
  }, [conversationKey, preferences]);
  const scrollPosition = preferences ? preferences.conversationScrollPosition?.[conversationKey] ?? 0 : null;
  const setScrollPosition = React.useCallback((index: number) => {
    rangeRef.current = index;
  }, []);
  return [scrollPosition, setScrollPosition] as const;
}
