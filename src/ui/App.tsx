import React from "react";
import { StyleProvider } from "./StyleProvider";
import { WholeScreen } from "./components/WholeScreen";
import { CreateAccountScreen } from "./screens/CreateAccountScreen";
import { AccountListScreen } from "./screens/AccountListScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { AccountScreen } from "./screens/AccountScreen";

export function App() {
  const [routing, setRouting] = React.useState<Routing>({
    screen: "create-account",
  });
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
  return (
    <StyleProvider>
      <WholeScreen>
        {(() => {
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
        })()}
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
