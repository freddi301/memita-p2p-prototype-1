import React from "react";
import ReactDOM from "react-dom";
import { ContactsScreen } from "./screens/ContactsScreen";
import { ConversationScreen } from "./screens/ConversationScreen";
import { ConversationsScreen } from "./screens/ConversationsScreen";
import { MessagesScreen } from "./screens/MessagesScreen";
import { AddContactScreen } from "./screens/AddContactScreen";
import { StyleProvider } from "./components/StyleProvider";
import { rpcElectronRenderer } from "./rpc/electron/rpc-electron-renderer";
import { AccountPublicKey, AccountSecretKey } from "./rpc/localRpcDefinition";
import { rpcWebsocketClient } from "./rpc/websocket/rpc-websocket-client";

ReactDOM.render(<App />, document.getElementById("root"));

function App() {
  const [state, setState] = React.useState<State>({ screen: "conversations" });
  const openAddContactScreen = () => {
    setState({ screen: "add-contact" });
  };
  const openContactsScreen = () => {
    setState({ screen: "contacts" });
  };
  const openConversationsScreen = () => {
    setState({ screen: "conversations" });
  };
  const saveContact = (name: string) => {
    // TODO move to appropriate level of abstraction
    const rpc = window.rendererIpc ? rpcElectronRenderer : rpcWebsocketClient;
    rpc.saveContact({
      name,
      accountPublicKey: AccountSecretKey.create().publicKey,
    });
    openContactsScreen();
  };
  return (
    <StyleProvider>
      {(() => {
        switch (state.screen) {
          case "contacts": {
            return (
              <ContactsScreen
                onAdd={openAddContactScreen}
                onContacts={openContactsScreen}
                onConversations={openConversationsScreen}
              />
            );
          }
          case "add-contact": {
            return (
              <AddContactScreen
                onCancel={openContactsScreen}
                onSave={saveContact}
              />
            );
          }
          case "conversations": {
            return (
              <ConversationsScreen
                onContacts={openContactsScreen}
                onConversations={openConversationsScreen}
              />
            );
          }
          case "messages": {
            return <MessagesScreen />;
          }
          case "conversation": {
            return <ConversationScreen />;
          }
          default:
            return <h1>not implmented</h1>;
        }
      })()}
    </StyleProvider>
  );
}

type State =
  | {
      screen: "messages";
    }
  | {
      screen: "contacts";
    }
  | { screen: "add-contact" }
  | {
      screen: "drafts";
    }
  | {
      screen: "conversation";
      recipietn: unknown;
    }
  | {
      screen: "conversations";
    }
  | {
      screen: "settings";
    };
