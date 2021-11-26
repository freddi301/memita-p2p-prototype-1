import React from "react";
import { Button } from "../components/Button";
import { HeaderContentControlsLayout } from "../components/HeaderContentControlsLayout";
import { Text } from "../components/Text";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { Clickable } from "../components/Clickable";
import { css } from "styled-components/macro";
import { StyleContext } from "../StyleProvider";
import { FrontendFacade, useSrcFromHash } from "../FrontendFacade";
import "emoji-mart/css/emoji-mart.css";
import { MessageEditor } from "../components/MessageEditor";
import { NavigationContext } from "../NavigationStack";
import { EmptyListPlaceholder } from "../components/EmptyListPlaceholder";
import { FileView } from "../components/FileView";

type ConversationScreenProps = {
  myPublicKey: string;
  otherPublicKey: string;
};
export function ConversationScreen({ myPublicKey, otherPublicKey }: ConversationScreenProps) {
  const { theme } = React.useContext(StyleContext);
  const navigationStack = React.useContext(NavigationContext);
  const onSend = (text: string, attachments: Array<{ name: string; contentHash: string }>) => {
    FrontendFacade.doMessage(myPublicKey, otherPublicKey, new Date().getTime(), text, attachments);
  };
  const conversationCount = FrontendFacade.useConversationListSize(myPublicKey, otherPublicKey) ?? 0;
  const me = FrontendFacade.useAccountByPublicKey(myPublicKey);
  const other = FrontendFacade.useContactByPublicKey(otherPublicKey);
  const [isAtBottom, setIsAtBottom] = React.useState(false);
  const virtuosoRef = React.useRef<VirtuosoHandle>(null);
  const scrollToBottom = () => {
    virtuosoRef.current?.scrollToIndex({ index: conversationCount + 1, behavior: "smooth" });
  };
  const [scrollPosition, setScrollPosition] = useConversationScrollPosition(myPublicKey, otherPublicKey);
  const onConversationDetail = () => {
    navigationStack.push({ screen: "wall", authorPublicKey: otherPublicKey });
  };
  return (
    <HeaderContentControlsLayout
      header={
        <Clickable onClick={onConversationDetail}>
          <div
            css={css`
              display: grid;
              grid-auto-flow: row;
              grid-auto-columns: auto;
              padding: ${theme.spacing.text.vertical} ${theme.spacing.text.horizontal};
              height: calc(${theme.sizes.vertical} + ${theme.spacing.text.vertical} * 2);
              box-sizing: border-box;
            `}
          >
            <Text color="primary" size="normal" weight="bold" text={other?.name ?? "..."} />
            <Text color="secondary" size="normal" weight="normal" text={otherPublicKey} truncatedLine={true} />
          </div>
        </Clickable>
      }
      content={
        <div
          css={css`
            height: 100%;
            display: flex;
            flex-direction: column;
          `}
        >
          {conversationCount === 0 && (
            <div
              css={css`
                flex-grow: 1;
              `}
            >
              <EmptyListPlaceholder>No messages</EmptyListPlaceholder>
            </div>
          )}
          {scrollPosition !== null && conversationCount !== 0 && (
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
              increaseViewportBy={5000}
            />
          )}
          <div
            css={css`
              position: relative;
              height: 0px;
            `}
          >
            <div
              css={css`
                position: absolute;
                right: ${theme.spacing.text.horizontal};
                bottom: ${theme.spacing.text.vertical};
                transition: 0.5s;
                transition-delay: 0.5s;
                opacity: ${isAtBottom ? 0 : 1};
              `}
            >
              <Button
                icon="ScrollToBottom"
                label="Scroll to end"
                enabled={!isAtBottom}
                onClick={scrollToBottom}
                showLabel={false}
              />
            </div>
          </div>
          <MessageEditor onSend={onSend} submitOnEnter={true} />
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
          grid-template-rows: auto auto auto;
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
          <Text color="primary" size="normal" weight="normal" text={message ? message.text.trim() : "..."} />
        </div>
        {message && message.attachments.length > 0 && (
          <div
            css={css`
              grid-column: 1 / span 2;
              grid-row: 3;
              position: relative;
              display: flex;
              flex-wrap: wrap;
            `}
          >
            {message.attachments.map(({ name, contentHash }, index) => {
              return <FileHashView key={index} name={name} hash={contentHash} />;
            })}
          </div>
        )}
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

type FileHashViewProps = {
  name: string;
  hash: string;
};
export function FileHashView({ name, hash }: FileHashViewProps) {
  const { theme } = React.useContext(StyleContext);
  const src = useSrcFromHash(hash);
  return (
    <div
      css={css`
        margin-top: ${theme.spacing.text.vertical};
        margin-right: ${theme.spacing.text.vertical};
        display: flex;
        flex-direction: column;
        justify-content: end;
        border: 1px solid ${theme.colors.background.active};
        box-sizing: border-box;
      `}
    >
      <div>
        {src && <FileView name={name} src={src} width={300} height={200} />}
        <div
          css={css`
            padding: ${theme.spacing.text.vertical};
          `}
        >
          <Text color="secondary" size="normal" weight="normal" text={name} truncatedLine={true} />
        </div>
      </div>
    </div>
  );
}
