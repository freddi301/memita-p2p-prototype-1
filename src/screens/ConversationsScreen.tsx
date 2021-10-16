import React from "react";
import {
  Avatar,
  Badge,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
} from "@mui/material";
import { FixedSizeList } from "react-window";
import { AutoSizer } from "react-virtualized";
import { FullScreenBottomNavigationLayout } from "../components/FullScreenBottomNavigationLayout";
import { MainBottomNavigation } from "../components/MainBottomNavigation";

type ConversationsScreenProps = {
  onConversations(): void;
  onContacts(): void;
};
export function ConversationsScreen({
  onContacts,
  onConversations,
}: ConversationsScreenProps) {
  return (
    <FullScreenBottomNavigationLayout
      top={
        <AutoSizer>
          {({ width, height }) => {
            return (
              <FixedSizeList
                width={width}
                height={height}
                itemSize={72}
                itemCount={conversations.length}
                overscanCount={5}
              >
                {({ index, style }) => {
                  const conversation = conversations[index];
                  return (
                    <ListItem
                      style={style}
                      key={index}
                      component="div"
                      disablePadding
                    >
                      <ListItemButton>
                        <ListItemAvatar>
                          <Avatar>
                            {conversation.contactName[0].toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={conversation.contactName}
                          secondary={conversation.lastMessageText}
                        />
                        <ListItemSecondaryAction>
                          <Badge badgeContent={4} color="primary">
                            2021-1-1
                          </Badge>
                        </ListItemSecondaryAction>
                      </ListItemButton>
                    </ListItem>
                  );
                }}
              </FixedSizeList>
            );
          }}
        </AutoSizer>
      }
      bottom={
        <MainBottomNavigation
          selected="conversations"
          onContacts={onContacts}
          onConversations={onConversations}
        />
      }
    />
  );
}

const conversations = [
  {
    contactName: "Pippo",
    lastMessageText: "Hi",
    lastMessageDate: new Date("2019"),
    newMessageCount: 1,
  },
  {
    contactName: "Pluto",
    lastMessageText: "Hello",
    lastMessageDate: new Date("2020"),
    newMessageCount: 2,
  },
  {
    contactName: "Paperino",
    lastMessageText: "Bye",
    lastMessageDate: new Date("2021"),
    newMessageCount: 3,
  },
];
