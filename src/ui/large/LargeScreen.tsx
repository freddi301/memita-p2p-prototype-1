import React from "react";
import { css } from "styled-components/macro";
import { ShadowDown } from "../components/ShadowDown";
import { ShadowUp } from "../components/ShadowUp";
import { Compose } from "../components/Compose";
import { MessageList } from "../components/MessageList";
import { ConversationsList } from "../components/ConversationsList";
import { Account } from "../components/Account";

export function LargeScreen() {
  const onSelectConversation = React.useCallback(() => {}, []);
  return (
    <div
      css={css`
        width: 100vw;
        height: 100vh;
        display: grid;
        grid-template-columns: 400px 1fr;
      `}
    >
      <div
        css={css`
          grid-column: 1;
          background-color: #21252b;
          display: flex;
          flex-direction: column;
        `}
      >
        <div>
          <Account name="Frederik" accountPublicKey="yyy" />
          <ShadowDown />
        </div>
        <div
          css={css`
            flex-grow: 1;
          `}
        >
          <ConversationsList onSelectConversation={onSelectConversation} />
        </div>
      </div>
      <div
        css={css`
          grid-column: 2;
          background-color: #282c34;
          display: flex;
          flex-direction: column;
        `}
      >
        <div>
          <Account name="Selected Contact" accountPublicKey="uuu" />
          <ShadowDown />
        </div>
        <div
          css={css`
            flex-grow: 1;
          `}
        >
          <MessageList />
        </div>
        <div>
          <ShadowUp />
          <Compose />
        </div>
      </div>
    </div>
  );
}
