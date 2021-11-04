import React from "react";
import { StyleProvider } from "./StyleProvider";
import { WholeScreen } from "./components/WholeScreen";
import { CreateAccountScreen } from "./screens/CreateAccountScreen";
import { AccountListScreen } from "./screens/AccountListScreen";

export function App() {
  const [routing, setRouting] = React.useState<Routing>({
    screen: "create-account",
  });
  const openAccountListScreen = React.useCallback(() => {
    setRouting({ screen: "account-list" });
  }, []);
  const openCreateAccountScreen = React.useCallback(() => {
    setRouting({ screen: "create-account" });
  }, []);
  return (
    <StyleProvider>
      <WholeScreen>
        {(() => {
          switch (routing.screen) {
            case "home": {
              return null;
            }
            case "create-account": {
              return <CreateAccountScreen onCancel={openAccountListScreen} />;
            }
            case "account-list": {
              return <AccountListScreen onCreate={openCreateAccountScreen} />;
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
    };
