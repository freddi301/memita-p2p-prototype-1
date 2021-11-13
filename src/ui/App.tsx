import React from "react";
import { StyleContext, useStyleProvider } from "./StyleProvider";
import { WholeScreen } from "./components/WholeScreen";
import { CreateAccountScreen } from "./screens/CreateAccountScreen";
import { AccountListScreen } from "./screens/AccountListScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { AccountScreen } from "./screens/AccountScreen";
import { CreateContactScreen } from "./screens/CreateContactScreen";
import { ContactListScreen } from "./screens/ContactListScreen";
import { ContactScreen } from "./screens/ContactScreen";
import { ConversationScreen } from "./screens/ConversationScreen";
import { FrontendFacade } from "../logic/FrontendFacade";
import { ConversationItem, ConversationListScreen } from "./screens/ConversationListScreen";
import { css } from "styled-components/macro";
import { Virtuoso } from "react-virtuoso";
import { NavigationContext, useNavigationStack } from "./NavigationStack";
import { MustSelectAccountScreen } from "./screens/MustSelectAccountScreen";

export function App() {
  const styleProviderValue = useStyleProvider();
  const navigationStack = useNavigationStack();
  const preferences = FrontendFacade.usePreferences();
  const setCurrentAccount = React.useCallback(
    (accountPublickKey: string) => {
      FrontendFacade.doUpdatePreferences({ ...preferences, currentAccountPublicKey: accountPublickKey });
    },
    [preferences]
  );
  const screen = React.useMemo(() => {
    switch (navigationStack.current.screen) {
      case "home": {
        return <HomeScreen />;
      }
      case "account-list": {
        return <AccountListScreen />;
      }
      case "create-account": {
        return <CreateAccountScreen />;
      }
      case "account": {
        return <AccountScreen publicKey={navigationStack.current.publicKey} onUse={setCurrentAccount} />;
      }
      case "contact-list": {
        return <ContactListScreen />;
      }
      case "create-contact": {
        return <CreateContactScreen />;
      }
      case "contact": {
        return <ContactScreen publicKey={navigationStack.current.publicKey} />;
      }
      case "conversation": {
        if (preferences?.currentAccountPublicKey) {
          return (
            <ConversationScreen
              myPublicKey={preferences.currentAccountPublicKey}
              otherPublicKey={navigationStack.current.otherPublicKey}
            />
          );
        } else {
          return <MustSelectAccountScreen />;
        }
      }
      case "conversation-list": {
        if (preferences?.currentAccountPublicKey) {
          return <ConversationListScreen myPublicKey={preferences.currentAccountPublicKey} />;
        } else {
          return <MustSelectAccountScreen />;
        }
      }
    }
  }, [navigationStack, preferences?.currentAccountPublicKey, setCurrentAccount]);
  const conversationsCount = FrontendFacade.useConversationsListSize(preferences?.currentAccountPublicKey ?? "") ?? 0;
  return (
    <StyleContext.Provider value={styleProviderValue}>
      <NavigationContext.Provider value={navigationStack}>
        <WholeScreen>
          <div
            css={css`
              display: grid;
              grid-template-columns: auto 1fr;
              grid-template-rows: 100%;
              height: 100%;
            `}
          >
            {styleProviderValue.showLeftPanel && navigationStack.current.screen !== "conversation-list" && (
              <div
                css={css`
                  grid-column: 1;
                  grid-row: 1;
                  border-right: 1px solid ${styleProviderValue.theme.colors.background.active};
                  width: 350px;
                `}
              >
                <Virtuoso
                  style={{ height: "100%" }}
                  totalCount={conversationsCount}
                  itemContent={(index) => (
                    <ConversationItem
                      index={index}
                      myPublicKey={preferences?.currentAccountPublicKey ?? ""}
                      onConversation={(otherPublicKey) => {
                        // TODO better
                        navigationStack.push({
                          screen: "conversation",
                          otherPublicKey,
                        });
                      }}
                    />
                  )}
                />
              </div>
            )}
            <div
              css={css`
                grid-column: 2;
                grid-row: 1;
              `}
            >
              {screen}
            </div>
          </div>
        </WholeScreen>
      </NavigationContext.Provider>
    </StyleContext.Provider>
  );
}

export type Preferences = {
  currentAccountPublicKey?: string;
  conversationScrollPosition?: Record<string, number>;
};
