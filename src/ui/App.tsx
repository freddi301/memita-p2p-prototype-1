import React from "react";
import { StyleProvider } from "./StyleProvider";
import { WholeScreen } from "./components/WholeScreen";
import { CreateAccountScreen } from "./screens/CreateAccountScreen";
import { AccountListScreen } from "./screens/AccountListScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { AccountScreen } from "./screens/AccountScreen";
import { usePrevious } from "./hooks/usePrevious";
import { Transitionate } from "./components/Transitionate";
import { CreateContactScreen } from "./screens/CreateContactScreen";
import { ContactListScreen } from "./screens/ContactListScreen";
import { ContactScreen } from "./screens/ContactScreen";

export function App() {
  const [routing, setRouting] = React.useState<Routing>({
    screen: "home",
  });
  const previous = usePrevious(routing);
  const openHomeScreen = React.useCallback(() => {
    setRouting({ screen: "home" });
  }, []);
  const openAccountListScreen = React.useCallback(() => {
    setRouting({ screen: "account-list" });
  }, []);
  const openCreateAccountScreen = React.useCallback(() => {
    setRouting({ screen: "create-account" });
  }, []);
  const openAccountScreen = React.useCallback(() => {
    setRouting({ screen: "account" });
  }, []);
  const openContactListScreen = React.useCallback(() => {
    setRouting({ screen: "contact-list" });
  }, []);
  const openCreateContactScreen = React.useCallback(() => {
    setRouting({ screen: "create-contact" });
  }, []);
  const openContactScreen = React.useCallback(() => {
    setRouting({ screen: "contact" });
  }, []);
  const screen = React.useMemo(() => {
    switch (routing.screen) {
      case "home": {
        return (
          <HomeScreen
            onAccounts={openAccountListScreen}
            onContacts={openContactListScreen}
          />
        );
      }
      case "account-list": {
        return (
          <AccountListScreen
            onCreate={openCreateAccountScreen}
            onAccount={openAccountScreen}
            onHome={openHomeScreen}
          />
        );
      }
      case "create-account": {
        return <CreateAccountScreen onCancel={openAccountListScreen} />;
      }
      case "account": {
        return <AccountScreen onCancel={openAccountListScreen} />;
      }
      case "contact-list": {
        return (
          <ContactListScreen
            onCreate={openCreateContactScreen}
            onContact={openContactScreen}
            onHome={openHomeScreen}
          />
        );
      }
      case "create-contact": {
        return <CreateContactScreen onCancel={openContactListScreen} />;
      }
      case "contact": {
        return <ContactScreen onCancel={openContactListScreen} />;
      }
    }
  }, [
    routing.screen,
    openAccountListScreen,
    openCreateAccountScreen,
    openAccountScreen,
    openHomeScreen,
    openCreateContactScreen,
    openContactScreen,
    openContactListScreen,
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
        }
        break;
      }
      case "contact": {
        switch (routing.screen) {
          case "contact-list":
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
    }
  | {
      screen: "contact-list";
    }
  | {
      screen: "create-contact";
    }
  | {
      screen: "contact";
    };
