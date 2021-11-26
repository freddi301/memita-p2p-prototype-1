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
import { FrontendFacade } from "./FrontendFacade";
import { ConversationListScreen } from "./screens/ConversationListScreen";
import { css } from "styled-components/macro";
import { NavigationContext, useNavigationStack } from "./NavigationStack";
import { SelectAccountScreen } from "./screens/SelectAccountScreen";
import { LeftPanelConversationList } from "./components/LeftPanelConversationList";
import { ConversationDetailScreen } from "./screens/ConversationDetailScreen";
import { SelectContactScreen } from "./screens/SelectContactScreen";
import { Transitionate } from "./components/Transitionate";
import { Routing } from "./Routing";
import { WallScreen } from "./screens/WallScreen";

export function App() {
  const styleProviderValue = useStyleProvider();
  const navigationStack = useNavigationStack();
  const routing = navigationStack.current;
  const theme = styleProviderValue.theme;
  const preferences = FrontendFacade.usePreferences();
  const currentAccountPublicKey = FrontendFacade.useAccountByPublicKey(preferences?.currentAccountPublicKey ?? "")
    ? preferences?.currentAccountPublicKey
    : null;
  const showLeftPanel =
    styleProviderValue.showLeftPanel && routing.screen !== "conversation-list" && currentAccountPublicKey;
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
            {showLeftPanel && (
              <div
                css={css`
                  grid-column: 1;
                  grid-row: 1;
                  border-right: 1px solid ${theme.colors.background.active};
                  width: 350px;
                `}
              >
                <LeftPanelConversationList currentAccountPublicKey={currentAccountPublicKey} />
              </div>
            )}
            <div
              css={css`
                grid-column: 2;
                grid-row: 1;
              `}
            >
              <Transitionate enterFrom={({ push: "right", pop: "left" } as const)[navigationStack.lastAction]}>
                {React.useMemo(
                  () => (
                    <Screen routing={routing} />
                  ),
                  [routing]
                )}
              </Transitionate>
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

type ScreenProps = { routing: Routing };
function Screen({ routing }: ScreenProps) {
  const navigationStack = React.useContext(NavigationContext);
  const preferences = FrontendFacade.usePreferences();
  const currentAccountPublicKey = FrontendFacade.useAccountByPublicKey(preferences?.currentAccountPublicKey ?? "")
    ? preferences?.currentAccountPublicKey
    : null;
  const setCurrentAccount = React.useCallback(
    (accountPublickKey: string) => {
      FrontendFacade.doUpdatePreferences({ ...preferences, currentAccountPublicKey: accountPublickKey });
    },
    [preferences]
  );
  switch (routing.screen) {
    case "home": {
      return <HomeScreen myAccountPublicKey={currentAccountPublicKey ?? null} />;
    }
    case "account-list": {
      return <AccountListScreen />;
    }
    case "create-account": {
      return <CreateAccountScreen />;
    }
    case "account": {
      return <AccountScreen publicKey={routing.publicKey} onUse={setCurrentAccount} />;
    }
    case "contact-list": {
      return <ContactListScreen />;
    }
    case "create-contact": {
      return <CreateContactScreen />;
    }
    case "contact": {
      return <ContactScreen publicKey={routing.publicKey} />;
    }
    case "conversation": {
      if (currentAccountPublicKey) {
        return <ConversationScreen myPublicKey={currentAccountPublicKey} otherPublicKey={routing.otherPublicKey} />;
      } else {
        return <SelectAccountScreen onSelect={setCurrentAccount} />;
      }
    }
    case "conversation-list": {
      if (currentAccountPublicKey) {
        return <ConversationListScreen myPublicKey={currentAccountPublicKey} />;
      } else {
        return <SelectAccountScreen onSelect={setCurrentAccount} />;
      }
    }
    case "select-account": {
      return (
        <SelectAccountScreen
          onSelect={(publicKey: string) => {
            setCurrentAccount(publicKey);
            navigationStack.pop();
          }}
        />
      );
    }
    case "select-contact": {
      return (
        <SelectContactScreen
          onSelect={(publicKey: string) => {
            navigationStack.pop();
            navigationStack.push({ screen: "conversation", otherPublicKey: publicKey });
          }}
        />
      );
    }
    case "conversation-detail": {
      if (currentAccountPublicKey) {
        return (
          <ConversationDetailScreen myPublicKey={currentAccountPublicKey} otherPublicKey={routing.otherPublicKey} />
        );
      } else {
        return <SelectAccountScreen onSelect={setCurrentAccount} />;
      }
    }
    case "wall": {
      return <WallScreen authorPublicKey={routing.authorPublicKey} />;
    }
  }
}
