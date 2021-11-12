import React from "react";
import { StyleContext, useStyleProvider } from "./StyleProvider";
import { WholeScreen } from "./components/WholeScreen";
import { CreateAccountScreen } from "./screens/CreateAccountScreen";
import { AccountListScreen } from "./screens/AccountListScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { AccountScreen } from "./screens/AccountScreen";
import { Transitionate } from "./components/Transitionate";
import { CreateContactScreen } from "./screens/CreateContactScreen";
import { ContactListScreen } from "./screens/ContactListScreen";
import { ContactScreen } from "./screens/ContactScreen";
import { ConversationScreen } from "./screens/ConversationScreen";
import { FrontendFacade } from "../logic/FrontendFacade";
import { ConversationItem, ConversationListScreen } from "./screens/ConversationListScreen";
import { css } from "styled-components/macro";
import { Virtuoso } from "react-virtuoso";

export function App() {
  const [routing, setRouting] = React.useState<Routing>({
    screen: "home",
  });
  const previous = usePrevious(routing);
  const preferences = FrontendFacade.usePreferences();
  const styleProviderValue = useStyleProvider();
  const openHomeScreen = React.useCallback(() => {
    setRouting({ screen: "home" });
  }, []);
  const openAccountListScreen = React.useCallback(() => {
    setRouting({ screen: "account-list" });
  }, []);
  const openCreateAccountScreen = React.useCallback(() => {
    setRouting({ screen: "create-account" });
  }, []);
  const openAccountScreen = React.useCallback((publicKey: string) => {
    setRouting({ screen: "account", publicKey });
  }, []);
  const openContactListScreen = React.useCallback(() => {
    setRouting({ screen: "contact-list" });
  }, []);
  const openCreateContactScreen = React.useCallback(() => {
    setRouting({ screen: "create-contact" });
  }, []);
  const openContactScreen = React.useCallback((publicKey: string) => {
    setRouting({ screen: "contact", publicKey });
  }, []);
  const openConversationScreen = React.useCallback((myPublicKey: string, otherPublicKey: string) => {
    setRouting({ screen: "conversation", myPublicKey, otherPublicKey });
  }, []);
  const openConversationsScreen = React.useCallback((myPublicKey: string) => {
    setRouting({ screen: "conversation-list", myPublicKey });
  }, []);
  const setCurrentAccount = React.useCallback(
    (accountPublickKey: string) => {
      FrontendFacade.doUpdatePreferences({ ...preferences, currentAccountPublicKey: accountPublickKey });
    },
    [preferences]
  );
  const screen = React.useMemo(() => {
    switch (routing.screen) {
      case "home": {
        return (
          <HomeScreen
            onAccounts={openAccountListScreen}
            onContacts={openContactListScreen}
            onConversations={() => {
              if (preferences?.currentAccountPublicKey) {
                openConversationsScreen(preferences.currentAccountPublicKey);
              }
            }}
          />
        );
      }
      case "account-list": {
        return (
          <AccountListScreen onCreate={openCreateAccountScreen} onAccount={openAccountScreen} onHome={openHomeScreen} />
        );
      }
      case "create-account": {
        return <CreateAccountScreen onCancel={openAccountListScreen} />;
      }
      case "account": {
        return (
          <AccountScreen publicKey={routing.publicKey} onUse={setCurrentAccount} onCancel={openAccountListScreen} />
        );
      }
      case "contact-list": {
        return (
          <ContactListScreen onCreate={openCreateContactScreen} onContact={openContactScreen} onHome={openHomeScreen} />
        );
      }
      case "create-contact": {
        return <CreateContactScreen onCancel={openContactListScreen} onContact={openContactScreen} />;
      }
      case "contact": {
        return (
          <ContactScreen
            publicKey={routing.publicKey}
            onCancel={openContactListScreen}
            onConversation={(otherPublickKey) => {
              // TODO better
              if (preferences?.currentAccountPublicKey) {
                openConversationScreen(preferences.currentAccountPublicKey, otherPublickKey);
              }
            }}
          />
        );
      }
      case "conversation": {
        return (
          <ConversationScreen
            myPublicKey={routing.myPublicKey}
            otherPublicKey={routing.otherPublicKey}
            onHome={openHomeScreen}
            onContact={openContactScreen}
            onConversations={() => {
              if (preferences?.currentAccountPublicKey) {
                openConversationsScreen(preferences.currentAccountPublicKey);
              }
            }}
          />
        );
      }
      case "conversation-list": {
        return (
          <ConversationListScreen
            myPublicKey={routing.myPublicKey}
            onConversation={openConversationScreen}
            onHome={openHomeScreen}
          />
        );
      }
    }
  }, [
    routing,
    preferences?.currentAccountPublicKey,
    openAccountListScreen,
    openContactListScreen,
    openCreateAccountScreen,
    openAccountScreen,
    openHomeScreen,
    setCurrentAccount,
    openCreateContactScreen,
    openContactScreen,
    openConversationScreen,
    openConversationsScreen,
  ]);
  const enterFrom = (() => {
    switch (previous.screen) {
      case "home": {
        switch (routing.screen) {
          case "account-list":
            return "right";
          case "contact-list":
            return "right";
          case "conversation-list":
            return "right";
        }
        break;
      }
      case "account-list": {
        switch (routing.screen) {
          case "home":
            return "left";
          case "account":
            return "right";
          case "create-account":
            return "right";
        }
        break;
      }
      case "create-account": {
        switch (routing.screen) {
          case "account-list":
            return "left";
        }
        break;
      }
      case "account": {
        switch (routing.screen) {
          case "account-list":
            return "left";
        }
        break;
      }
      case "contact-list": {
        switch (routing.screen) {
          case "home":
            return "left";
          case "contact":
            return "right";
          case "create-contact":
            return "right";
        }
        break;
      }
      case "create-contact": {
        switch (routing.screen) {
          case "contact-list":
            return "left";
          case "contact":
            return "bottom";
        }
        break;
      }
      case "contact": {
        switch (routing.screen) {
          case "contact-list":
            return "left";
          case "conversation":
            return "right";
        }
        break;
      }
      case "conversation": {
        switch (routing.screen) {
          case "contact":
            return "left";
          case "home":
            return "left";
          case "conversation-list":
            return "left";
        }
        break;
      }
      case "conversation-list": {
        switch (routing.screen) {
          case "home":
            return "left";
          case "conversation":
            return "right";
        }
        break;
      }
    }
    return "stay";
  })();
  const conversationsCount = FrontendFacade.useConversationsListSize(preferences?.currentAccountPublicKey ?? "") ?? 0;
  if (styleProviderValue.showLeftPanel && routing.screen !== "conversation-list") {
    return (
      <StyleContext.Provider value={styleProviderValue}>
        <WholeScreen>
          <div
            css={css`
              display: grid;
              grid-template-columns: 350px 1fr;
              grid-template-rows: 100%;
              height: 100%;
            `}
          >
            <div
              css={css`
                grid-column: 1;
                grid-row: 1;
                border-right: 1px solid ${styleProviderValue.theme.colors.background.active};
              `}
            >
              <Virtuoso
                style={{ height: "100%" }}
                totalCount={conversationsCount}
                itemContent={(index) => (
                  <ConversationItem
                    index={index}
                    myPublicKey={preferences?.currentAccountPublicKey ?? ""}
                    onConversation={openConversationScreen}
                  />
                )}
              />
            </div>

            <div
              css={css`
                grid-column: 2;
                grid-row: 1;
              `}
            >
              <Transitionate enterFrom={enterFrom}>{screen}</Transitionate>
            </div>
          </div>
        </WholeScreen>
      </StyleContext.Provider>
    );
  } else {
    return (
      <StyleContext.Provider value={styleProviderValue}>
        <WholeScreen>
          <Transitionate enterFrom={enterFrom}>{screen}</Transitionate>
        </WholeScreen>
      </StyleContext.Provider>
    );
  }
}

type Routing =
  | { screen: "home" }
  | {
      screen: "account-list";
    }
  | {
      screen: "create-account";
    }
  | {
      screen: "account";
      publicKey: string;
    }
  | {
      screen: "contact-list";
    }
  | {
      screen: "create-contact";
    }
  | {
      screen: "contact";
      publicKey: string;
    }
  | {
      screen: "conversation";
      myPublicKey: string;
      otherPublicKey: string;
    }
  | {
      screen: "conversation-list";
      myPublicKey: string;
    };

export type Preferences = {
  currentAccountPublicKey?: string;
  conversationScrollPosition?: Record<string, number>;
};

function usePrevious<Value>(value: Value) {
  const ref = React.useRef<Value>(value);
  React.useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
