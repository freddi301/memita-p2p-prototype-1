import React from "react";
import { Paper, BottomNavigation, BottomNavigationAction } from "@mui/material";
import { Chat, Contacts } from "@mui/icons-material";

type MainBottomNavigationProps = {
  selected: "contacts" | "conversations";
  onContacts(): void;
  onConversations(): void;
};
export function MainBottomNavigation({
  selected,
  onContacts,
  onConversations,
}: MainBottomNavigationProps) {
  return (
    <Paper elevation={3}>
      <BottomNavigation
        showLabels
        value={selected}
        onChange={(event, newValue) => {
          switch (newValue) {
            case "contacts": {
              onContacts();
              break;
            }
            case "conversations": {
              onConversations();
              break;
            }
          }
        }}
      >
        <BottomNavigationAction
          value="contacts"
          label="Contacts"
          icon={<Contacts />}
        />
        <BottomNavigationAction
          value="conversations"
          label="Conversations"
          icon={<Chat />}
        />
      </BottomNavigation>
    </Paper>
  );
}
