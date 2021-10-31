import React from "react";
import { css } from "styled-components/macro";
import { Account } from "../components/Account";
import { Compose } from "../components/Compose";
import { ConversationsList } from "../components/ConversationsList";
import { MessageList } from "../components/MessageList";
import { ShadowDown } from "../components/ShadowDown";
import { ShadowUp } from "../components/ShadowUp";

export function SmallScreen() {
  const [state, setState] = React.useState(initialState);
  const onSelectConversation = React.useCallback(() => {
    setState({ screen: "conversation" });
  }, []);
  const onBack = React.useCallback(() => {
    setState((state) => {
      switch (state.screen) {
        case "conversations":
          return state;
        case "conversation":
          return { screen: "conversations" };
      }
    });
  }, []);
  React.useLayoutEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onBack();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onBack]);
  switch (state.screen) {
    case "conversations": {
      return (
        <div
          css={css`
            width: 100vw;
            height: 100vh;
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
      );
    }
    case "conversation": {
      return (
        <div
          css={css`
            width: 100vw;
            height: 100vh;
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
      );
    }
  }
}

type State = { screen: "conversations" } | { screen: "conversation" };
const initialState: State = { screen: "conversations" };
