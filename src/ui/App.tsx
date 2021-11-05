import React from "react";
import { StyleProvider } from "./StyleProvider";
import { WholeScreen } from "./components/WholeScreen";
import { CreateAccountScreen } from "./screens/CreateAccountScreen";
import { AccountListScreen } from "./screens/AccountListScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { AccountScreen } from "./screens/AccountScreen";
import { usePrevious } from "./hooks/usePrevious";
import { Transitionate } from "./components/Transitionate";

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
  const screen = React.useMemo(() => {
    switch (routing.screen) {
      case "home": {
        return <HomeScreen onAccounts={openAccountListScreen} />;
      }
      case "create-account": {
        return <CreateAccountScreen onCancel={openAccountListScreen} />;
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
      case "account": {
        return <AccountScreen onCancel={openAccountListScreen} />;
      }
    }
  }, [
    routing.screen,
    openAccountListScreen,
    openAccountScreen,
    openCreateAccountScreen,
    openHomeScreen,
  ]);
  const enterFrom = (() => {
    console.log(previous.screen, routing.screen);
    switch (previous.screen) {
      case "home": {
        switch (routing.screen) {
          case "account-list":
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
    };
