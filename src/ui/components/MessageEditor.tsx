import React from "react";
import { Button } from "./Button";
import { css } from "styled-components/macro";
import { StyleContext } from "../StyleProvider";
import { Picker } from "emoji-mart";
import { Attachment, AttachmentPreview } from "./AttachmentPreview";

type MessageEditorProps = {
  onSend: (text: string, attachments: Array<Attachment>) => void;
};
export function MessageEditor({ onSend }: MessageEditorProps) {
  const { theme } = React.useContext(StyleContext);
  const [text, setText] = React.useState("");
  const [attachments, setAttachments] = React.useState<Array<{ type: string; name: string; content: Uint8Array }>>([]);
  const send = () => {
    onSend(text, attachments);
    setText("");
    setAttachments([]);
  };
  const textRef = React.useRef<HTMLTextAreaElement | null>(null);
  const [showEmojis, setShowEmojis] = React.useState(false);
  return (
    <div
      css={css`
        border-top: 1px solid ${theme.colors.background.active};
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
              right: 48px;
              display: flex;
              flex-direction: column;
              align-items: flex-end;
              transition: 0.5s;
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
                  textRef.current.focus();
                }
              }}
            />
          </div>
        )}
      </div>
      {attachments && (
        <div
          css={css`
            display: flex;
            overflow-x: auto;
            margin-bottom: ${theme.spacing.text.vertical};
          `}
        >
          {attachments.map((attachment, index) => {
            return (
              <div
                key={index}
                css={css`
                  margin-right: 8px;
                `}
              >
                <AttachmentPreview attachment={attachment} />
              </div>
            );
          })}
        </div>
      )}
      <div
        css={css`
          min-height: ${theme.sizes.vertical};
          display: flex;
          align-items: flex-end;
          box-sizing: border-box;
          background-color: ${theme.colors.background.active};
          font-family: ${theme.font.family};
          font-size: ${theme.font.size.normal};
          border-radius: ${theme.spacing.border.radius};
          :focus-within {
            background-color: ${theme.colors.background.focus};
          }
          transition: ${theme.transitions.input.duration};
        `}
      >
        <Button
          icon="Emoji"
          label="Emoji"
          enabled={true}
          onClick={() => setShowEmojis((showEmojis) => !showEmojis)}
          showLabel={false}
        />
        <Button
          icon="Attachment"
          label="Attach"
          enabled={true}
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.multiple = true;
            input.addEventListener("change", (event) => {
              const files = (event.target as HTMLInputElement)?.files;
              if (files) {
                const attachments = Array.from(files).map(
                  (file) =>
                    new Promise<Attachment>((resolve, reject) => {
                      const fileReader = new FileReader();
                      fileReader.addEventListener("progress", (event) => {
                        if (event.loaded && event.total) {
                          const percent = (event.loaded / event.total) * 100;
                          console.log(`Progress: ${Math.round(percent)}`); // TODO
                        }
                      });
                      fileReader.addEventListener("load", (event) => {
                        const data = event.target?.result as ArrayBuffer;
                        if (data) {
                          resolve({ type: file.type, name: file.name, content: new Uint8Array(data) });
                        }
                      });
                      fileReader.readAsArrayBuffer(file);
                    })
                );
                Promise.all(attachments).then((moreAttachemnts) =>
                  setAttachments((attachments) => [...attachments, ...moreAttachemnts])
                );
              }
            });
            input.click();
          }}
          showLabel={false}
        />
        <textarea
          value={text}
          onChange={(event) => setText(event.currentTarget.value)}
          rows={text.split("\n").length}
          autoComplete="off"
          spellCheck={false}
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
            margin-left: ${theme.spacing.text.horizontal};
            margin-right: ${theme.spacing.text.horizontal};
          `}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              send();
              event.currentTarget.focus();
            }
          }}
          onBlur={(event) => {
            textRef.current = event.currentTarget;
          }}
        />
        <Button label="Send" icon="Send" onClick={send} enabled={false} showLabel={false} />
      </div>
    </div>
  );
}
