import React from "react";
import ReactDOM from "react-dom";
import { ContactsScreen } from "./screens/ContactsScreen";
import { ConversationScreen } from "./screens/ConversationScreen";
import { ConversationsScreen } from "./screens/ConversationsScreen";
import { MessagesScreen } from "./screens/MessagesScreen";
import { AddContactScreen } from "./screens/AddContactScreen";
import { StyleProvider } from "./components/StyleProvider";
import { AccountSecretKey } from "./rpc/localRpcDefinition";
import { useCreateDraft, useSaveContact } from "./data-hooks";
import { CompositionScreen } from "./screens/CompositionScreen";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
} from "@mui/material";
import { Contacts, Chat, Drafts } from "@mui/icons-material";
import { Box } from "@mui/system";
import { DraftsScreen } from "./screens/DraftsScreen";

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
    }
  | {
      screen: "composition";
      draftId: string;
    };

function App() {
  const [state, setState] = React.useState<State>({ screen: "conversations" });
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(true);
  const saveContact_ = useSaveContact();
  const createDraft = useCreateDraft();
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
  const openCompositionScreen = async () => {
    const { id } = await createDraft({ text: "" });
    setState({ screen: "composition", draftId: id });
  };
  const openDraftsScreen = () => {
    setState({ screen: "drafts" });
  };
  const editDraft = (id: string) => {
    setState({ screen: "composition", draftId: id });
  };
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
            <ListItem
              button
              onClick={() => {
                setIsDrawerOpen(false);
                openDraftsScreen();
              }}
            >
              <ListItemIcon>
                <Drafts />
              </ListItemIcon>
              <ListItemText primary="Drafts" />
            </ListItem>
          </List>
        </Box>
      </SwipeableDrawer>
      {(() => {
        switch (state.screen) {
          case "contacts": {
            return <ContactsScreen onAdd={openAddContactScreen} />;
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
            return <ConversationsScreen onCompose={openCompositionScreen} />;
          }
          case "composition": {
            return (
              <CompositionScreen
                draftId={state.draftId}
                onCancel={openConversationsScreen}
                onSend={openCompositionScreen}
              />
            );
          }
          case "drafts": {
            return (
              <DraftsScreen
                onCreate={openCompositionScreen}
                onUpdate={editDraft}
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
            return <h1>not implemented</h1>;
        }
      })()}
    </StyleProvider>
  );
}
