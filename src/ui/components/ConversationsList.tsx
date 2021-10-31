import React from "react";
import { FixedSizeList } from "react-window";
import { AutoSizer } from "react-virtualized";
import { css } from "styled-components/macro";

type ConversationsListProps = {
  onSelectConversation(): void;
};
export function ConversationsList({
  onSelectConversation,
}: ConversationsListProps) {
  const itemData = React.useMemo(
    () => ({
      onSelectConversation,
    }),
    [onSelectConversation]
  );
  return (
    <AutoSizer>
      {({ width, height }) => (
        <FixedSizeList
          width={width}
          height={height}
          itemData={itemData}
          itemCount={1000}
          itemSize={54}
          overscanCount={10}
        >
          {ContactListItemMemo}
        </FixedSizeList>
      )}
    </AutoSizer>
  );
}

type ContactProps = {
  name: string;
  accountPublicKey: string;
  onSelectConversation(): void;
};
function Contact({
  name,
  accountPublicKey,
  onSelectConversation,
}: ContactProps) {
  return (
    <div
      onClick={() => onSelectConversation()}
      css={css`
        padding: 8px 16px;
        :hover {
          background-color: #282c34;
        }
        cursor: pointer;
      `}
    >
      <div> {name}</div>
      <div
        css={css`
          color: #7f848e;
        `}
      >
        {accountPublicKey}
      </div>
    </div>
  );
}
type ContactListItemProps = {
  index: number;
  style: React.CSSProperties;
  data: {
    onSelectConversation(): void;
  };
};
function ContactListItem({
  index,
  style,
  data: { onSelectConversation },
}: ContactListItemProps) {
  return (
    <div key={index} style={style}>
      <Contact
        name={"fred " + index}
        accountPublicKey={"xxx"}
        onSelectConversation={onSelectConversation}
      />
    </div>
  );
}
export const ContactListItemMemo = React.memo(ContactListItem);
