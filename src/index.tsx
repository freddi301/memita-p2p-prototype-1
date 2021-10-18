import React from "react";
import ReactDOM from "react-dom";
import { ContactsScreen } from "./screens/ContactsScreen";
import { ConversationScreen } from "./screens/ConversationScreen";
import { ConversationsScreen } from "./screens/ConversationsScreen";
import { MessagesScreen } from "./screens/MessagesScreen";
import { AddContactScreen } from "./screens/AddContactScreen";
import { StyleProvider } from "./components/StyleProvider";
import { AccountSecretKey } from "./rpc/localRpcDefinition";
import { useSaveContact } from "./data-hooks";

ReactDOM.render(<App />, document.getElementById("root"));

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

function App() {
  const [state, setState] = React.useState<State>({ screen: "conversations" });
  const saveContact_ = useSaveContact();
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
    saveContact_({
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
