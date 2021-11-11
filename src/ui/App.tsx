import React from "react";
import { StyleProvider } from "./StyleProvider";
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

export function App() {
  const [routing, setRouting] = React.useState<Routing>({
    screen: "home",
  });
  const previous = usePrevious(routing);
  const preferences = FrontendFacade.usePreferences();
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
  const openConversationScreen = React.useCallback((otherPublicKey: string) => {
    setRouting({ screen: "conversation", otherPublicKey });
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
        return <HomeScreen onAccounts={openAccountListScreen} onContacts={openContactListScreen} />;
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
            onConversation={openConversationScreen}
          />
        );
      }
      case "conversation": {
        if (preferences?.currentAccountPublicKey) {
          return (
            <ConversationScreen
              myPublicKey={preferences.currentAccountPublicKey}
              otherPublicKey={routing.otherPublicKey}
              onHome={openHomeScreen}
              onContact={openContactScreen}
            />
          );
        } else {
          // TODO better
          return (
            <AccountListScreen
              onCreate={openCreateAccountScreen}
              onAccount={openAccountScreen}
              onHome={openHomeScreen}
            />
          );
        }
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
  ]);
  const enterFrom = (() => {
    switch (previous.screen) {
      case "home": {
        switch (routing.screen) {
          case "account-list":
            return "right";
          case "contact-list":
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
        }
        break;
      }
    }
    return "stay";
  })();
  return (
    <StyleProvider>
      <WholeScreen>
        <Transitionate enterFrom={enterFrom}>{screen}</Transitionate>
      </WholeScreen>
    </StyleProvider>
  );
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
      otherPublicKey: string;
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
