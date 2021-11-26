import React from "react";
import { Button } from "./Button";
import { css } from "styled-components/macro";
import { StyleContext } from "../StyleProvider";
import { Picker } from "emoji-mart";
import { FileView } from "./FileView";
import { Text } from "./Text";
import { selectFiles } from "../../other/fileDialog/fileDialog";
import { fileHash } from "../../other/fileHash/fileHash";

type MessageEditorProps = {
  onSend: (text: string, attachments: Array<{ name: string; contentHash: string }>) => void;
  submitOnEnter: boolean;
};
export function MessageEditor({ onSend, submitOnEnter }: MessageEditorProps) {
  const { theme } = React.useContext(StyleContext);
  const [text, setText] = React.useState("");
  const [attachments, setAttachments] = React.useState<
    Array<{ name: string; src: { type: "path"; path: string } | { type: "file"; file: File } }>
  >([]);
  const send = async () => {
    setText("");
    setAttachments([]);
    onSend(
      text,
      await Promise.all(
        attachments.map(async ({ src, name }) => {
          const hash = await fileHash(src);
          return { name, contentHash: hash };
        })
      )
    );
  };
  const textRef = React.useRef<HTMLTextAreaElement>(null);
  React.useLayoutEffect(() => {
    if (textRef.current) {
      textRef.current.style.height = "";
      textRef.current.style.height = textRef.current.scrollHeight + "px";
    }
  }, [text]);
  const [showEmojis, setShowEmojis] = React.useState(false);
  const canSend = text.trim() !== "" || attachments.length > 0;
  return (
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
        {showEmojis && (
          <div
            css={css`
              position: absolute;
              bottom: ${theme.spacing.text.vertical};
              right: 0px;
              display: flex;
              flex-direction: column;
              align-items: flex-end;
            `}
          >
            <Button icon="Close" label="Close" enabled={true} onClick={() => setShowEmojis(false)} showLabel={false} />
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
                  setText(textRef.current.value);
                  textRef.current.focus();
                }
              }}
            />
          </div>
        )}
      </div>
      <div
        css={css`
          min-height: ${theme.sizes.vertical};
          display: grid;
          grid-template-columns: auto 1fr auto auto;
          grid-template-rows: auto auto;
          box-sizing: border-box;
          background-color: ${theme.colors.background.active};
          font-family: ${theme.font.family};
          font-size: ${theme.font.size.normal};
          border-radius: ${theme.spacing.border.radius};
        `}
      >
        {attachments && attachments.length > 0 && (
          <div
            css={css`
              grid-column: 1 / span 4;
              grid-row: 1;
              overflow-x: auto;
              border-bottom: 1px solid ${theme.colors.background.passive};
            `}
          >
            <div
              css={css`
                display: grid;
                grid-auto-flow: column;
                grid-auto-columns: auto;
                width: min-content;
              `}
            >
              {attachments.map((attachment, index) => {
                return (
                  <div
                    key={index}
                    css={css`
                      border-right: 1px solid ${theme.colors.background.passive};
                      width: 200px;
                      position: relative;
                    `}
                  >
                    <FileView
                      name={attachment.name}
                      src={
                        attachment.src.type === "path" ? attachment.src.path : URL.createObjectURL(attachment.src.file)
                      }
                      width={200}
                      height={200}
                    />
                    <div
                      css={css`
                        padding: ${theme.spacing.text.vertical} ${theme.spacing.text.horizontal};
                      `}
                    >
                      <Text
                        color="secondary"
                        text={attachment.name}
                        truncatedLine={true}
                        size="normal"
                        weight="normal"
                      />
                    </div>
                    <div
                      css={css`
                        position: absolute;
                        top: ${theme.spacing.text.vertical};
                        right: ${theme.spacing.text.vertical};
                      `}
                    >
                      <Button
                        icon="Close"
                        label="Remove"
                        onClick={() => {
                          setAttachments(attachments.filter((a, i) => i !== index));
                        }}
                        enabled={true}
                        showLabel={false}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <div
          css={css`
            grid-column: 1;
            grid-row: 2;
            align-self: end;
          `}
        >
          <Button
            icon="Emoji"
            label="Emoji"
            enabled={true}
            onClick={() => setShowEmojis((showEmojis) => !showEmojis)}
            showLabel={false}
          />
        </div>
        <div
          css={css`
            grid-column: 2;
            grid-row: 2;
            display: flex;
            align-self: center;
          `}
        >
          <textarea
            ref={textRef}
            value={text}
            onChange={(event) => setText(event.currentTarget.value)}
            autoComplete="off"
            spellCheck={false}
            rows={1}
            css={css`
              flex-grow: 1;
              color: ${theme.colors.text.primary};
              border: none;
              outline: none;
              resize: none;
              background-color: inherit;
              font-family: inherit;
              font-size: inherit;
              padding: 0px;
              margin-top: ${theme.spacing.text.vertical};
              margin-bottom: ${theme.spacing.text.vertical};
            `}
            onKeyDown={(event) => {
              if (submitOnEnter) {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  send();
                  event.currentTarget.focus();
                }
              }
            }}
          />
        </div>
        <div
          css={css`
            grid-column: 3;
            grid-row: 2;
            align-self: end;
          `}
        >
          <Button
            icon="Attachment"
            label="Attach"
            enabled={true}
            onClick={() => {
              selectFiles().then((moreAttachments) => {
                setAttachments((attachments) => [...attachments, ...moreAttachments]);
              });
            }}
            showLabel={false}
          />
        </div>
        <div
          css={css`
            grid-column: 4;
            grid-row: 2;
            align-self: end;
          `}
        >
          <Button label="Send" icon="Send" onClick={send} enabled={canSend} showLabel={false} />
        </div>
      </div>
    </div>
  );
}
