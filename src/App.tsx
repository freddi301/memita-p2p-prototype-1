import React from "react";
import { ContactsScreen } from "./screens/ContactsScreen";
import { ConversationScreen } from "./screens/ConversationScreen";
import { ConversationsScreen } from "./screens/ConversationsScreen";
import { AddContactScreen } from "./screens/AddContactScreen";
import { StyleProvider } from "./components/StyleProvider";
import { AccountPublicKey } from "./rpc/local/definition";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
} from "@mui/material";
import { Contacts, Chat } from "@mui/icons-material";
import { Box } from "@mui/system";
import { doWriteRpcCall } from "./data-hooks";

type State =
  | {
      screen: "contacts";
    }
  | { screen: "add-contact" }
  | {
      screen: "conversations";
    }
  | {
      screen: "conversation";
      recipient: AccountPublicKey;
    };
export function App() {
  const [state, setState] = React.useState<State>({ screen: "conversations" });
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(true);
  const openAddContactScreen = () => {
    setState({ screen: "add-contact" });
  };
  const openContactsScreen = () => {
    setState({ screen: "contacts" });
  };
  const openConversationsScreen = () => {
    setState({ screen: "conversations" });
  };
  const saveContact = (name: string, accountPublicKey: AccountPublicKey) => {
    doWriteRpcCall("saveContact", {
      name,
      accountPublicKey,
    });
    openContactsScreen();
  };
  const openConversationScreen = React.useCallback(
    (accountPublicKey: AccountPublicKey) => {
      setState({ screen: "conversation", recipient: accountPublicKey });
    },
    []
  );
  React.useLayoutEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDrawerOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);
  return (
    <StyleProvider>
      <SwipeableDrawer
        anchor="left"
        open={isDrawerOpen}
        onOpen={() => setIsDrawerOpen(true)}
        onClose={() => setIsDrawerOpen(false)}
      >
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            <ListItem
              button
              onClick={() => {
                setIsDrawerOpen(false);
                openContactsScreen();
              }}
            >
              <ListItemIcon>
                <Contacts />
              </ListItemIcon>
              <ListItemText primary="Contacts" />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                setIsDrawerOpen(false);
                openConversationsScreen();
              }}
            >
              <ListItemIcon>
                <Chat />
              </ListItemIcon>
              <ListItemText primary="Conversations" />
            </ListItem>
          </List>
        </Box>
      </SwipeableDrawer>
      {(() => {
        switch (state.screen) {
          case "contacts": {
            return (
              <ContactsScreen
                onAdd={openAddContactScreen}
                onConversation={openConversationScreen}
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
              <ConversationsScreen onConversation={openConversationScreen} />
            );
          }
          case "conversation": {
            return (
              <ConversationScreen
                recipient={state.recipient}
                onCancel={openConversationsScreen}
              />
            );
          }
          default:
            throw new Error();
        }
      })()}
    </StyleProvider>
  );
}
